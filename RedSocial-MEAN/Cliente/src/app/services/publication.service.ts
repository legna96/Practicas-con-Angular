import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//modelos
import { Publication } from '../models/publication.model';

//rutas backend
import { GLOBAL } from './global';

@Injectable()
export class PublicationService {

  //otros
  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  /**
   * Metodo para crear una nueva publicacion en la DB.
   * @param token cadena de autentificacion del usuario logeado
   * @param publication objeto publicacion con los datos a agregar
   * @returns Devuelve un observable con response y error mediante 
   * metodo subscribe
   */
  addPublication(token, publication): Observable<any> {
    let params = JSON.stringify(publication);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.post(this.url + 'publication', params, { headers: headers });
  }

  /**
   * Metodo para recuperar las publicaciones accesibles por el usuario logeado 
   * (aquellas publicaciones de los usuarios que sigue) en la DB
   * @param token cadena de autentificacion del usuario logeado
   * @param page numero de pagina para las publicaciones,
   *  por defecto asigna 1 si no se envia nada
   * @returns Devuelve un observable con response y error mediante 
   * metodo subscribe
   */
  getPublications(token, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'publications/' + page, { headers: headers });
  }

  /**
   * Metodo para recuerar todas las publicaciones de un usuario
   * @param token cadena de autentificacion del usuario logeado
   * @param page numero de pagina para las publicaciones,
   *  por defecto asigna 1 si no se envia nada
   * @returns Devuelve un observable con response y error mediante 
   * metodo subscribe
   */
  getPublicationsUser(token, userId, page = 1): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this.http.get(this.url + 'publications-user/' + userId + '/' + page, { headers: headers });
  }

  /**
   * Metodo para borrar una publicacion de forma persistente en la DB
   * @param token cadena de autentificacion del usuario logeado
   * @param id id de la publicacion a eliminar
   * @returns Devuelve un observable con response y error mediante 
   * metodo subscribe
   */
  deletePublication(token, id): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.delete(this.url + 'publications/' + id, { headers: headers });

  }

}
