import { BackEndService } from './../back-end.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Output, EventEmitter } from '@angular/core';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Observable } from 'rxjs'; // import Observable
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: User | null = null;
  currentUser: Observable<User | null> = this.authService.currentUser; // explicitly type currentUser as Observable<User | null>
  isDarkMode: boolean = false;

  constructor(
    private backEndService: BackEndService,
    private themeService: ThemeService,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
  logOut() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logOut();
      this.router.navigate(['/login']);
    }
  }
}

// onSave() {
//   this.backEndService.saveData();
// }
// onFetch() {
//   this.backEndService.fetchData();
// }
