import { Component, OnInit, Input } from '@angular/core';
import { NavListItem } from 'src/app/models/NavListItem';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input('navlist') navList: Array<NavListItem>

  constructor() { }

  ngOnInit(): void {
  }

}
