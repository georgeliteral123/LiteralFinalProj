interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // other properties like photoURL, emailVerified, etc.
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser = this._currentUser.asObservable();

  constructor(private auth: AngularFireAuth) {
    this.auth.user.subscribe((user) => {
      this._currentUser.next(user);
    });
  }
  // currentUser = this.auth.user;
  isLoggedIn = this.auth.authState.pipe(map((user) => !!user));

  // async signUp(email: string, password: string) {
  //   try {
  //     await this.auth.createUserWithEmailAndPassword(email, password);
  //     console.log('Sign up successful');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async signUp(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      window.alert('Sign up successful');
    } catch (error) {
      console.log(error);
    }
  }

  async logIn(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
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
  

  // isUserRegistered(email: string, password : string): Promise<boolean> {
  //   return this.auth
  //     .getUserByEmail(email),
  //     .getUserByPassword(password)
  //     .then(() => {
  //       // If the promise resolves, the user is registered
  //       return true;
  //     })
  //     .catch((error) => {
  //       // If the promise rejects, the user is not registered
  //       if (error.code === 'auth/user-not-found') {
  //         return false;
  //       } else {
  //         // If the error is something else, log it and return false
  //         console.error(error);
  //         return false;
  //       }
  //     });
  // }

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
}
