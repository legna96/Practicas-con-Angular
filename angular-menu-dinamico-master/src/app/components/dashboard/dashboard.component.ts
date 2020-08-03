import { Component, OnInit } from '@angular/core';
import { NavListItem } from 'src/app/models/NavListItem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  navlist: Array<NavListItem>;

  constructor() {
    this.navlist = [
      { "titulo": "Home", "url": "/home"}
    ]
  }

  ngOnInit(): void {
  }

}
