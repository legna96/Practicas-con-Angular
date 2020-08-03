import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ UserService ]
})
export class AppComponent implements OnInit, DoCheck{

  public title:string;
  public userIdentity;
  public token;
  public stats;
  public url:string;

  constructor(
    private userService:UserService,
    private route: ActivatedRoute,
    private router: Router
  ){
      this.title  = 'Guami';
      this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.userIdentity = this.userService.getUserIdentity();
    this.token = this.userService.getToken();
  }

  ngDoCheck(){
    this.userIdentity = this.userService.getUserIdentity();
    this.stats = this.userService.getStats();
  }

  logout(){
    localStorage.clear();
    this.userIdentity = null;
    //se hace una redireccion de pagina
    this.router.navigate(["/"]);
  }
}
