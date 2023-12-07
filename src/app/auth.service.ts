import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  isLoggedIn = this.auth.authState.pipe(map((user) => !!user));

  validateEmail(email: string) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

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
      console.log('Sign up successful');
    } catch (error) {
      console.error(error);
    }
  }

  async logIn(email: string, password: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      console.log('Log in successful');
    } catch (error) {
      console.error(error);
    }
  }

  async logOut() {
    try {
      await this.auth.signOut();
      console.log('Log out successful');
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
