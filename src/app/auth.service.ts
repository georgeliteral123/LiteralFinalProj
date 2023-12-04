import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async signUp(email: string, password: string) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Sign up successful');
    } catch (error) {
      console.error(error);
    }
  }

  async logIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Log in successful');
    } catch (error) {
      console.error(error);
    }
  }

  async logOut() {
    try {
      await this.afAuth.signOut();
      console.log('Log out successful');
    } catch (error) {
      console.error(error);
    }
  }
}