import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { Observable } from 'rxjs'; // import Observable
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  currentUser: Observable<User | null> = this.authService.currentUser; 

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }
}

