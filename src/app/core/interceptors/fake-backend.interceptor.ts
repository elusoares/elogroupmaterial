import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { UserModel } from 'src/app/modules/user/user-model';

// peguei a ideia de https://stackblitz.com/edit/angular-6-registration-login-example?file=app%2F_helpers%2Ffake-backend.ts
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // array in local storage for registered users
    let users: UserModel[] = this.storageService.getUsers();

    // register user
    if (request.url.endsWith('/users/register') && request.method === 'POST') {
      // get new user object from post body
      let newUser: UserModel = request.body as UserModel;
      console.log(newUser);
      // validation
      let duplicateUser = users.filter((user) => {
        return user.email === newUser.email;
      }).length;
      if (duplicateUser) {
          return throwError({ error: { message: 'Este usuário já existe.' } });
      }

      // save new user
      users.push(newUser);
      this.storageService.replaceUsers(users);

      // respond 200 OK
      return of(new HttpResponse({ status: 200 }));
    }
    return next.handle(request);
  }
}
