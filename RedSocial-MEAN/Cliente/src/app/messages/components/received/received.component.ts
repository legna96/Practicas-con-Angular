import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//models
import { Message } from '../../../models/message.model';
import { Follow } from '../../../models/follow.model';
import { User } from '../../../models/user.model';

//services
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';


@Component({
  selector: 'received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers: [MessageService, FollowService, UserService ]
})
export class ReceivedComponent implements OnInit {

  //variables de apoyo
  public title:string;
  public url:string;
  public status:string;

  //usuario logead
  public token:string;
  public userIdentity;

   //modelos
   public messages:Message[];

   //paginacion variables
   public pages;
   public page;
   public total;
   public next_page;
   public prev_page;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private followService: FollowService,
    private userService: UserService
  ) { 
    this.title = 'Mensajes Recibidos';
    this.url = GLOBAL.url;
    this.userIdentity = userService.getUserIdentity();
    this.token = userService.getToken();
  }

  ngOnInit() {
    console.log('Componente received cargado');
    this.actualPage();
  }

  actualPage() {
    this.route.params.subscribe(params => {

      //obtiene el numero de pagina en la ruta
      let page = +params['page'];

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
      this.getMessages(this.token, page);
    });
  }

  getMessages(token, page){
    this.messageService.getMyMessages(token, page).subscribe(
      res=>{
        if (res.messages) {
          this.messages = res.messages;
          this.total = res.total;
          this.pages = res.pages;
        }
      },
      err=>{
        console.log(<any>err);
      }
    );
  }


}
