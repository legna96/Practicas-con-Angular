import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//modelos
import { User } from '../models/user.model';

//rutas backend
import { GLOBAL } from './global';

@Injectable()
export class UserService {

    public url: string;
    public userIdentity;
    public token;
    public stats;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;

    }

    /**
     * Metodo que recupea el usuario logeado
     * del localStorage
     */
    getUserIdentity(){
        let userIdentity = JSON.parse(localStorage.getItem('userIdentity'));
        if (userIdentity != "undefined") {
            this.userIdentity = userIdentity;
        }else{
            this.userIdentity = null;
        }

        return this.userIdentity;
    }

     /**
     * Metodo que recupea el token del usuario logeado
     * del localStorage
     */
    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));
        if (token != "undefined") {
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

    /**
     * Metodo para obtener el objeto de los contadores
     * o estadistsicas del LocalStorege
     */
    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));
        if(stats != 'undefined'){
            this.stats = stats;
        } else{
            this.stats = null;
        }

        return this.stats;
    }

     /**
     * Metodo para registrar un usuario
     * @param user 
     */
    register(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-type', 'application/json');
        return this.http.post(this.url + 'register', params, { headers: headers });
    }

    /**
     * Metodo para identificar a un usuario
     * @param user 
     * @param getToken 
     */
    singUp(user:any, getToken = null): Observable<any> {
        if (getToken != null) {
            user.getToken = getToken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(this.url + 'login/', params, { headers: headers });
    }

    /**
     * Metodo para obtener los contadores o estadisticas
     * del servidor
     * @param userId 
     */
    getCounters(userId = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        if(userId != null){
            return this.http.get(this.url + 'counters/' + userId, { headers: headers });
        } else{
            return this.http.get(this.url + 'counters', {headers:headers});
        }
    }

    /**
     * Metodo para actualizar los datos de un usario
     * @param user 
     */
    updateUser(user:User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this.http.put(this.url + 'update-user/' + user._id, params, { headers: headers });

    }

    /**
     * Metodo para obtener los usuarios, paginados
     * @param page 
     */
    getUsers(page = null): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this.http.get(this.url + 'users/' + page, { headers: headers });
    }

    /**
     * Metodo para obtener un usuario
     * @param id 
     */
    getUser(id): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this.http.get(this.url + 'user/' + id, { headers: headers });
    }

}