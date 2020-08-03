import { Component, OnInit } from '@angular/core';
import { GitHubService } from '../../services/git-hub.service';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent implements OnInit {

  public totalRepos: number;
  public items_por_pag: number = 3;
  public pagina: number = 1;
  public total_pags: number;
  public hay_mas: boolean = true;

  public repositorios: any = [];

  public loading: boolean = true;
  public status:string;

  constructor(
    private gitHubService: GitHubService
  ) {

  }

  ngOnInit() {
    this.getContRepositorios();
  }

  getContRepositorios() {
    this.gitHubService.contRepositorios().subscribe(
      totalRepos => {
        this.totalRepos = totalRepos;
        this.total_pags = Math.ceil(totalRepos / this.items_por_pag);
        this.getReposPaginados(this.pagina, this.items_por_pag);
      },
      err =>{
        console.log(<any> err);
        this.status = 'error';
        this.loading = false;
      }
    )
  }

  getReposPaginados(pagina, por_pagina, adding = false) {

    this.loading = true;

    this.gitHubService.getReposPaginados(pagina, por_pagina).subscribe(
      res => {

        if (!adding) {
          this.repositorios = res;
        } else {
          let arrayActual = this.repositorios;
          this.repositorios = arrayActual.concat(res);
        }

        this.loading = false;

      },
      err =>{
        console.log(<any> err);
        this.status = 'error';
        this.loading = false;
      }
    );
  }

  getNextRepos() {

    if (this.hay_mas) {
      this.hay_mas = true;
      this.pagina = this.pagina + 1;
      this.getReposPaginados(this.pagina, this.items_por_pag, true);

      if (this.pagina == this.total_pags) {
        this.hay_mas = false;
        this.pagina = 1;
      }

    }
  }

}
