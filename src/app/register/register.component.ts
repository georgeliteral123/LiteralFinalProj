import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(public auth: AuthService, private afAuth: AngularFireAuth) {}

  register(email: string, password: string) {
    this.auth
      .signUp(email, password)
      .then(() => {
        console.log('User registered and logged in');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
