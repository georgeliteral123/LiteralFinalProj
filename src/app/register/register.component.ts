import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  isDarkMode: boolean = false;
  hide = true;

  constructor(
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
  }
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

//   register(email: string, password: string) {
//     if (!email || !password) {
//       window.alert('Email and password cannot be empty.');
//       return;
//     } else {
//       this.auth
//         .signUp(email, password)
//         .then(() => {
//           window.alert('Registration Success');
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//       this.router.navigate(['/login']);
//     }
//   }
// }
register(email: string, password: string) {
  if (!email || !password) {
    window.alert('Email and password cannot be empty.');
    return;
  } else {
    this.auth.signUp(email, password).then((success) => {
      if (success) {
        window.alert('Registration Success');
        this.router.navigate(['/login']);
      }
    });
  }
}
}
