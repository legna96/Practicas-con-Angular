import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//modelos
import { User } from '../../models/user.model';

//servicios
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

    public title:string;
    public status:string;
    public user: User;
    
    constructor(
      private _route: ActivatedRoute,
      private _router:Router,
      private _userService:UserService
    ) { 
      this.title = 'Registrate';
     
      this.user = new User(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        
      );
    }

    ngOnInit() {
      console.log('Componente de register cargado');
    }

    onSubmit(form){
      this._userService.register(this.user).subscribe(
        response => {
          //si me llega el user y la propiedad _id
          //entonces se proceso la peticion correctamente
          if(response.user && response.user._id){
            //si la respuesta del servidor es correcta con el usuario registrado
            //console.log(response.user);
            this.status = 'success';
            form.reset();
          } else{
            //si llega una respuesta negativa del servidor
            //({message: 'Error en algo'})
            this.status = 'error';
          }
        },
        error =>{
          //error con la respuesta del servidor
          console.log(<any> error);
        }
      );
    }

}
