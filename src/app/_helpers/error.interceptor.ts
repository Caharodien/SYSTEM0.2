// src/app/_helpers/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Change this line to import directly from the service file
import { AccountService } from '../_services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.accountService.accountValue) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }

            const error = err.error?.message || err.statusText;
            console.error(err);
            return throwError(() => error);
        }))
    }
}