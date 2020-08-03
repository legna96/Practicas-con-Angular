import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { User } from '../../models/user.model';

//servicios
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  viewProviders: [UserService]
})
export class LoginComponent implements OnInit {


  public title:string;
  public user: User;
  public status: string;
  public userIdentity;
  public token;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    this.title = 'Identificate';
    this.user = new User("","","","","","","","");
   }

  ngOnInit() {
    console.log('componente de login cargado');
  }

  onSubmit(form){
    
    //logear al usuario y obtener sus datos
    this.userService.singUp(this.user).subscribe(
      response =>{
        //se guarda el usuario de la peticion 
        this.userIdentity = response.user;
        //console.log('userIdentity', this.userIdentity);
        //si no se ha podido identificar el usuario en la BD
        if(!this.userIdentity || !this.userIdentity._id){

          this.status = 'error';

        } else{

          //PERSISTIR LOS DATOS DEL USUARIO
          localStorage.setItem('userIdentity', JSON.stringify(this.userIdentity));

          //CONSEGUIR EL TOKEN
          //otra peticion ajax        
          this.getToken();
          
        }
        
      },
      error =>{
        var errorMessage = <any>error;
        console.log('error', errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }

      }
    );
  }

  /**
   * Metodo para conseguir el token haciendo
   * una peticion ajax tipo get pasando getToken = true
   * y guardar la respuesta en la variable 
   * token de la clase
   */
  getToken(){
    this.userService.singUp(this.user, 'true').subscribe(
      response =>{
        
        this.token = response.token;

        if(this.token.length <= 0){
          this.status = 'error';
          
        } else{

          //PERSISTIR TOKEN DEL USUARIO
          localStorage.setItem('token',JSON.stringify(this.token));

          //conseguir los contadores ó estadisticas del usuario
          //otra peticion ajax  
          this.getcounters();

        }   
      },
      error =>{
        var errorMessage =<any>error;
        console.log('error', errorMessage);
        if(errorMessage != null){
          this.status = 'error'; 
        }

      }
    );
  }

  /**
   * Metodo para obtener los contadores del
   * servidor y guardarlos en el localstorage
   */
  getcounters(){
    this.userService.getCounters().subscribe(
      response =>{
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        //redireccion a la pagina de inicio
        this.router.navigate(['/']);

      },
      error =>{
        console.log(<any>error);
      }
    );
  }

}
