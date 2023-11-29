import { Component } from '@angular/core';
import { ThemeService } from './theme.service';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  isDarkMode: boolean = false;
  title = 'crud';

  constructor(private themeService: ThemeService) {
  }
  
  ngOnInit():void{
    this.themeService.isDarkMode.subscribe(darkMode => {
      this.isDarkMode = darkMode;
    });
  }


}
