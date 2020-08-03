import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//models
import { User } from '../../models/user.model';
import { Follow } from '../../models/follow.model';

//services
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {

  //variables de ayuda
  public url:string;
  public title:string;
  public status:string;

  //variables tipo modelo
  public user:User;
  public followed;
  public following;

  //usuario logeado variables
  public userIdentity;
  public token:string;
  public stats;

  constructor(
    private userService:UserService,
    private followService:FollowService,
    private router:Router,
    private route:ActivatedRoute
  ) { 
    this.title = 'Perfil';
    this.url = GLOBAL.url;
    this.userIdentity = userService.getUserIdentity();
    this.token = userService.getToken();
    this.stats = userService.getStats();
    this.followed = false;
    this.following = false;

    //ajuste del reuseStrategy sobre el Router. para poder
    //recargar ngOnInit cuando se trate dela misma ruta
    //pero con otros parametros
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    console.log('Componente PERFIL cargado');
    this.loadPage();
  }

  loadPage(){
    this.route.params.subscribe(params =>{
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    })
  }

  getUser(id){
    this.userService.getUser(id).subscribe(
      res =>{
        if(res.user){
          //console.log(res);
          this.user = res.user;

          if(res.following && res.following._id){
            this.following = true;
          } else{
            this.following = false;
          }

          if (res.followed && res.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }

        }else{
          this.status = 'error';
        }
      },
      error =>{
        console.log(<any>error);
        this.router.navigate(['/perfil', this.userIdentity._id]);
      }
    );
  }

  getCounters(id){
    this.userService.getCounters(id).subscribe(
      res=>{
        //console.log(res);
        this.stats = res;
      },
      error=>{
        console.log(<any>error);
      }
    )
  }

  /**
   * Metodo para hacer que el usuario logeado
   * pueda seguir un usuario
   * @param followed el id del usuario a seguir
   */
  followUser(followed){
    let follow = new Follow("",this.userIdentity._id, followed);
    this.followService.addFollow(this.token,follow).subscribe(
      res=>{
        this.updateCounters();
        //una vez que se crea el follow, se cambia la bandera following a true
        this.following = true;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

  unFollowUser(followed){
    this.followService.deleteFollow(this.token,followed).subscribe(
      res=>{
        this.updateCounters();
        this.following = false;
      },
      error=>{
        console.log(<any>error);
      }
    );
  }

   /**
   * Metodo para actualizar los contadores del
   * servidor y guardarlos en el localstorage
   */
  updateCounters(){
    this.userService.getCounters().subscribe(
      response =>{
        localStorage.setItem('stats', JSON.stringify(response));
        //se actualiza stats
        this.stats = this.userService.getStats();
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave(){
    this.followUserOver = 0;
  }

}
