import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//services
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { UploadService } from '../../services/upload.service';

//models
import { Publication } from '../../models/publication.model';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {

  //variables de ayuda
  public status: string;
  public url: string;

  //variables localstorage de usuario logeado
  public userIdentity;
  public token;
  public stats;

  //variables de modelo
  public publication: Publication;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private uplodService: UploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.url = GLOBAL.url;

    this.userIdentity = userService.getUserIdentity();
    this.token = userService.getToken();
    this.stats = userService.getStats();

    this.publication = new Publication("", "", "", "", this.userIdentity._id);
  }

  ngOnInit() {
    console.log('Componente SIDEBAR cargado');
  }

  onSubmit(form, $event) {

    this.publicationService.addPublication(this.token, this.publication)
      .subscribe(
        response => {
          if (response.publication) {

            //con imagen
            if (this.filesToUpload && this.filesToUpload.length) {
              //subir imagen
              this.uplodService.makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                .then((result: any) => {

                  this.publication.image = result.image;
                  this.status = 'success';
                  //actualiza los contadores
                  this.updateCounters();
                  form.reset();
                  this.router.navigate(['/timeline']);
                  this.sended.emit({ send: 'true' });
      
                });
            }
            //sin imagen
            else{
              this.status = 'success';
              //actualiza los contadores
              this.updateCounters();
              form.reset();
              this.router.navigate(['/timeline']);
              this.sended.emit({ send: 'true' });
  
            }
          } else {
            this.status = 'error';
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  //Output
  @Output() sended = new EventEmitter();
  sendPublication(event) {
    //console.log(event);
    this.sended.emit({ send: 'true' });
  }

  /**
   * Metodo para actualizar los contadores del
   * servidor y guardarlos en el localstorage
   */
  updateCounters() {
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
