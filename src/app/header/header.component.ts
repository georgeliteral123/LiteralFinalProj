import { BackEndService } from './../back-end.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private backEndService:BackEndService) {}

  ngOnInit():void {
  }

  // onSave() {
  //   this.backEndService.saveData();
  // }
  // onFetch() {
  //   this.backEndService.fetchData();
  // }
}
