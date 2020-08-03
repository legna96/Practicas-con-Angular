import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public title;
  public userIdentity;
  public token: any;

  constructor( private userService: UserService) { 
    this.title = 'Bienvenido a Guami';
    this.userIdentity = this.userService.getUserIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit() {
    console.log('Componente home funcionando correctamente')
  }

}
