import { CurrentUserModel } from './../../modules/user/current-user-model';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
// peguei a ideia de https://stackblitz.com/edit/angular-6-registration-login-example?file=app%2F_helpers%2Ffake-backend.ts
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  // esse interceptor adiciona o cabeçalho com o jwt fake em toda requisiçao onde exista um currentUser
  constructor(
    private storageService: StorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: CurrentUserModel = this.storageService.getCurrentUser();
    if (currentUser && currentUser.token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.token}`
            }
        });
    }

    return next.handle(request);
  }
}
