import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//models
import { Publication } from '../../models/publication.model';

//services
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {

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

  @Input() user;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.title = 'Publicaciones';
    this.url = GLOBAL.url;
    this.token = userService.getToken();
    this.userIdentity = userService.getUserIdentity();
    this.page = 1;

  }

  ngOnInit() {
    console.log('Componente PUBLICATIONS cargado');
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false) {
    this.publicationService.getPublicationsUser(this.token, user, page).subscribe(
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

            //$("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
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

  viewMore() {
    this.page += 1;
    //ya no se puede dar a siguiente, ya no hay mas publicaciones
    if (this.page == this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.user, this.page, true);
  }

  showThisImage(id){
    this.showImage = id;
  }

  hideThisImage(){
    this.showImage = 0;
  }

}
