import { BackEndService } from './../back-end.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Output, EventEmitter } from '@angular/core';
import { PostService } from '../post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  searchKeyword: string;
  listOfPosts: any;

  constructor(
    private backEndService: BackEndService,
    private themeService: ThemeService,
    private postService: PostService
  ) {
    this.searchKeyword = '';

  }

  ngOnInit() {
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
  }
  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}

// onSave() {
//   this.backEndService.saveData();
// }
// onFetch() {
//   this.backEndService.fetchData();
// }
