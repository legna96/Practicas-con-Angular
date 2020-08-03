import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//modelos
import { Follow } from '../models/follow.model';

//rutas backend
import { GLOBAL } from './global';

@Injectable()
export class FollowService {

    public url: string;


    constructor(
        private http: HttpClient
    ) {
        this.url = GLOBAL.url;
    }

    addFollow(token, follow): Observable<any> {

        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post(this.url + 'follow', params, { headers: headers });

    }

    deleteFollow(token, id): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.delete(this.url + 'follow/' + id, { headers: headers });
    }

    getFollowing(token, idUser, page): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        var url = this.url + 'following';
        if (idUser != null) {
            url = this.url + 'following/' + idUser + '/' + page;
        }
        return this.http.get( url, { headers: headers });
    }

    getFollowed(token, idUser, page): Observable<any> {

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        var url = this.url + 'followed';
        if (idUser != null) {
            url = this.url + 'followed/' + idUser + '/' + page;
        }
        return this.http.get( url, { headers: headers });
    }

    getMyFollows(token) :Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
            //recibo mis followers (los que me siguen)
        return this.http.get(this.url + 'get-my-follows/true', { headers: headers });
    }

}