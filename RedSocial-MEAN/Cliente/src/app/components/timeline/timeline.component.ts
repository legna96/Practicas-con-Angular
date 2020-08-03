import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//services
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';

//models
import { Publication } from '../../models/publication.model';

// Declaramos las variables para jQuery
declare var jQuery:any;
declare var $: any;


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {

  //variables user logeado
  public userIdentity;
  public token;

  //variables de ayuda
  public url;
  public title: string;
  public status: string;
  public showImage;

  //variables paginacion
  public page;
  public noMore = false;

  //publicaciones
  public publications: Publication[];
  public total;
  public pages;
  public itemsPerPage;


  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.token = userService.getToken();
    this.userIdentity = userService.getUserIdentity();
    this.url = GLOBAL.url;
    this.title = 'TimeLine';
    this.page = 1;
  }

  ngOnInit() {
    console.log('Componente TIMELINE cargado');
    this.getPublications(this.page);
  }


  getPublications(page, adding = false) {
    this.publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          //seteo de variables de la respuesta
          this.pages = response.pages;
          this.total = response.total_items;
          this.itemsPerPage = response.itemsPerPage;

          //valor por defecto, cuando no se pasa el parametro
          if (!adding) {
            this.publications = response.publications;
          } else {
            var arrayA = this.publications;
            var arrayB = response.publications;
            //concatenacion de los arreglos
            this.publications = arrayA.concat(arrayB)

            //$("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 1000);
          }

          /*
          if (page > this.pages) {
            this.router.navigate(['/home']);
          }
          */

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

  viewMore() {

    this.page += 1;
    //ya no se puede dar a siguiente, ya no hay mas publicaciones
    if (this.page == this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.page, true);
  }

  /**
   * Metodo que refresca las propiedades de 
   * la paginacion para mostar las nuevas publicacions
   * mandadas del sidebar
   * @param event 
   */
  refresh(event = null){
    this.page = 1;
    this.noMore = false;
    this.getPublications(this.page);
  }

  /**
   * Metodo para mostrar la imagen de una
   * publicacion
   * @param id 
   */
  showThisImage(id){
    this.showImage = id;
  }

  hideThisImage(){
    this.showImage = 0;
  }

  deletePublication(publicationId){
    this.publicationService.deletePublication(this.token, publicationId).subscribe(
      res =>{
        this.refresh();
      },
      err =>{
        console.log(<any>err);
      }
    )
  }
}
