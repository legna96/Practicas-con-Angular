import { Component, OnInit } from '@angular/core';
import { NavListItem } from 'src/app/models/NavListItem';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  navlist: Array<NavListItem>;

  constructor() {
    this.navlist = [
      { "titulo": "DashBoard", "url": "/dashboard"},
      { "titulo": "404", "url": "/cualquiercosa"}
    ]
  }

  ngOnInit(): void {
  }

}
