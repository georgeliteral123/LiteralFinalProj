import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}
  hide = true;

  register(email: string, password: string) {
    if (!email || !password) {
      window.alert('Email and password cannot be empty.');
      return;
    } else {
      this.auth
        .signUp(email, password)
        .then(() => {
          // console.log('User registered and logged in');
          window.alert('Registration Success');
        })
        .catch((error) => {
          console.error(error);
        });
      this.router.navigate(['/login']);
    }
  }
}
