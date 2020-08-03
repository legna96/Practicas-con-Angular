import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//models
import { User } from '../../models/user.model';
import { Follow } from '../../models/follow.model';

//services
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit {

  //otros
  public user: User;
  public title: string;
  public status: string;
  public url;
  public followUserOver;

  //variables de getFollowing
  public total;
  public pages;
  public users: User[];
  public follows;
  public followed;
  public userPageId;

  //variables de identificacion
  public userIdentity;
  public token;
  public stats;

  //variables de paginacion
  public page;
  public next_page;
  public prev_page;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.title = 'Followers de ';
    this.userIdentity = userService.getUserIdentity();
    this.token = userService.getToken();
    this.stats = userService.getStats();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Componente USERS cargado correctamente');
    this.actualPage();
  }

  actualPage() {
    this.route.params.subscribe(params => {
      let userID = params['id'];
      //obtiene el numero de pagina en la ruta
      let page = +params['page'];
      
      this.userPageId = userID;
      this.page = page;

      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      //devolver listado de usuarios
      this.getUser(userID, page);
    });
  }

  getFollows(userID, page) {
    this.followService.getFollowed(this.token, userID, page).subscribe(
      response => {

        if (!response.follows) {
          this.status = 'error';
        } else {

          console.log(response);

          this.followed = response.follows;
          this.total = response.total;
          this.pages = response.pages;
          this.follows = response.user_following;

          //si la pagina es mas grande que el numero de paginas devueltas por la DB
          //no existe la pagina
          if (page > this.pages) {
            //redireccionar pagina 1
            this.router.navigate(['/gente', 1]);
          }
        }

      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }


  getUser(userID, page) {
    this.userService.getUser(userID).subscribe(
      res => {
        if (res.user) {
          this.user = res.user;
          this.getFollows(userID, page);

        } else {
          this.router.navigate(['/home']);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  /**
   * Metodo para seguir a un usuario
   * @param followed 
   */
  followUser(followed) {
    var follow = new Follow("", this.userIdentity._id, followed);
    this.followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          //se guarda el id (followed) al arreglo
          // de follows
          this.follows.push(followed);
          this.status = 'success';
          this.getcounters();
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  /**
   * Metodo para dejar de seguir a un usuario
   * @param followed 
   */
  unFollowUser(followed) {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response => {
        var search = this.follows.indexOf(followed);
        if (search != -1) {
          this.follows.splice(search, 1);
          this.getcounters();
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }

  /**
   * Metodo para obtener los contadores del
   * servidor y guardarlos en el localstorage
   */
  getcounters() {
    this.userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        //se actualiza stats
        this.stats = this.userService.getStats();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
