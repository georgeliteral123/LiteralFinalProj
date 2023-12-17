// interface User {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   // other properties like photoURL, emailVerified, etc.
// }

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, BehaviorSubject, switchMap, of } from 'rxjs';
import { User } from './user.model'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser = this._currentUser.asObservable();

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  isLoggedIn = this.auth.authState.pipe(map((user) => !!user));


  async signUp(email: string, password: string): Promise<boolean> {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      window.alert('Registration success');
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'auth/email-already-in-use') {
        window.alert('This email is already registered. Please use another email.');
      } else {
        console.log(error);
      }
      return false;
    }
  }


  async logIn(email: string, password: string) {
    try {
      const credential = await this.auth.signInWithEmailAndPassword(email, password);
      const firebaseUser = credential.user;
      if (firebaseUser) {
        const doc = await this.firestore.collection('users').doc(firebaseUser.uid).get().toPromise();
        let profileImageUrl = '';
        if (doc && doc.exists) {
          const data = doc.data() as { profileImageUrl?: string }; // Add type assertion here
          if (data && 'profileImageUrl' in data) {
            profileImageUrl = data.profileImageUrl || ''; // Provide a default value here
          }
        }
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          profileImageUrl: profileImageUrl
        };
        this._currentUser.next(user);
      }
      window.alert('Log in successful');
    } catch (error) {
      console.error(error);
    }
  }

  async logOut() {
    try {
      await this.auth.signOut();
      this._currentUser.next(null); // Emit null through _currentUser
      window.alert('Log out successful');
    } catch (error) {
      console.error(error);
    }
  }

  isUserRegistered(email: string, password: string): Promise<boolean> {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // If the promise resolves, the user is registered
        this.auth.signOut(); // Sign out immediately after checking
        return true;
      })
      .catch((error) => {
        // If the promise rejects, the user is not registered
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        ) {
          return false;
        } else {
          // If the error is something else, log it and return false
          console.error(error);
          return false;
        }
      });
  }
  updateUserProfileImage(uid: string, url: string): void {
    this.firestore.collection('users').doc(uid).update({
      profileImageUrl: url
    });
  }
  getCurrentUser(): Observable<User | null> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            map(user => user ? user : null)
          );
        } else {
          return of(null);
        }
      })
    );
  }
}