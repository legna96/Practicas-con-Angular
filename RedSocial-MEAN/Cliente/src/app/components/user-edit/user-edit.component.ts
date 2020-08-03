import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [ UserService, UploadService ]
})
export class UserEditComponent implements OnInit {

  public title:string;
  public user:User;
  public userIdentity;
  public token;
  public status:string;
  public url;
  public filesToUpload: Array<File>;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private userService:UserService,
    private uploadService:UploadService

  ) { 
    this.title = 'Actualizar mis Datos';
    this.user = this.userService.getUserIdentity();
    this.userIdentity = this.user;
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('componente user-edit cargado correctamente');
    console.log('Usuario identificado al cargar componente', this.user);
  }

  onSubmit(){
    
    this.userService.updateUser(this.user).subscribe(
      response =>{
        if(!response.user){
          this.status = 'error';
        }else{
          localStorage.setItem('userIdentity', JSON.stringify(this.user));
          this.userIdentity = this.user;

          //SUBiDA DE ARCHIVO
          this.uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
               .then((result:any)=>{
                //console.log('RESULT', result);
                this.user.image = result.user.image;
                //console.log(this.user.image);
                localStorage.setItem('userIdentity', JSON.stringify(this.user));
               });

          this.status = 'success';
        }
      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  
  fileChangeEvent(fileInput:any){

    this.filesToUpload = < Array<File> > fileInput.target.files;
    //console.log(this.filesToUpload);
  }

}
