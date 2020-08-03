import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  constructor(private http: HttpClient) {

  }

  contRepositorios() {

    let url = "https://api.github.com/users/Fili96";

    return this.http.get(url).pipe(
      map(
        data => data['public_repos'],
        err => console.log(<any>err)
      )
    );
  }

  getReposPaginados(page = 1, per_page){
    let url = `https://api.github.com/users/Fili96/repos?page=${page}&per_page=${per_page}`;
    
    return this.http.get(url);
  }
}
