import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isDarkMode: boolean = false;
  hide = true;

  constructor(
    private authService: AuthService,
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

  // login(email: string, password: string) {
  //   this.authService
  //     .isUserRegistered(email, password)
  //     .then((isRegistered) => {
  //       if (!isRegistered) {
  //         window.alert('No user with this email found. Please register first.');
  //         return;
  //       }

  //       this.authService
  //         .logIn(email, password)
  //         .then(() => {
  //           console.log('User logged in');
  //           this.router.navigate(['/post-list']);
  //         })
  //         .catch((error) => {
  //           if (error.code === 'auth/wrong-password') {
  //             window.alert('Wrong password. Please try again.');
  //           } else {
  //             console.error(error);
  //           }
  //         });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  login(email: string, password: string) {
    this.authService
      .isUserRegistered(email, password)
      .then((isRegistered) => {
        if (!isRegistered) {
          window.alert('No user with this email found. Please register first.');
          return;
        }

        this.authService
          .logIn(email, password)
          .then(() => {
            console.log('User logged in');
            this.router.navigate(['/post-list']);
          })
          .catch((error) => {
            if (error.code === 'auth/wrong-password') {
              window.alert('Wrong password. Please try again.');
            } else {
              console.error(error);
            }
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
