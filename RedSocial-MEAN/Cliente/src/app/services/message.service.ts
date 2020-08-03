import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

//modelos
import { Message } from '../models/message.model';

//rutas backend
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public url: string;

  constructor(private http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addMessage(token, message): Observable<any> {
    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.post(this.url + 'message', params, { headers: headers });
  }

  getMyMessages(token, page = 1): Observable<any> {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.get(this.url + 'my-messages/' + page, { headers: headers });
  }

  getEmmitMessages(token, page = 1): Observable<any> {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', token);
    return this.http.get(this.url + 'messages/' + page, { headers: headers });
  }

}
