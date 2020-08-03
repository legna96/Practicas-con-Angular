import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, CanActivate } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate{
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService:UserService
    ){

    }
    canActivate(){
        let userIdentity = this.userService.getUserIdentity();
        if (userIdentity && (userIdentity.role == 'ROLE_USER' || userIdentity.role == 'ROLE_ADMIN')){
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

}