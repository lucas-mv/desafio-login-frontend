import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

import { AuthenticationService } from '../services/authetication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.isLocalTokenValid()) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/authenticate'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
