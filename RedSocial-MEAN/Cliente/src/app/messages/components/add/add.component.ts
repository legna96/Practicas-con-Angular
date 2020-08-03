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
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [MessageService, FollowService, UserService ]
})
export class AddComponent implements OnInit {

  //variables de apoyo
  public title:string;
  public url:string;
  public status:string;

  //modelos
  public follows;
  public message:Message;

  //usuario logead
  public token:string;
  public userIdentity;

  constructor(
    private router: Router,
    private rote: ActivatedRoute,
    private messageService: MessageService,
    private followService: FollowService,
    private userService: UserService
  ) { 
    this.title = 'Enviar Mensaje';
    this.url = GLOBAL.url;
    this.userIdentity = this.userService.getUserIdentity();
    this.token = this.userService.getToken();
    this.message = new Message('','','','',this.userIdentity._id,'');
  }

  ngOnInit() {
    console.log('Componente add cargado');
    this.getMyFollows();
  }

  onSubmit(form){
    //console.log(this.message);
    this.messageService.addMessage(this.token,this.message).subscribe(
      res=>{
        if(res.message){
          this.status = 'success';
          form.reset();
        }
      },
      err=>{
        this.status = 'error';
        console.log(<any>err);
      }
    )
  }

  getMyFollows(){
    this.followService.getMyFollows(this.token).subscribe(
      res=>{
        this.follows = res.follows;
      },
      err=>{
        console.log(<any>err);
      }
    )
  }

}
