import { CurrentUserModel } from './../../modules/user/current-user-model';
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
import { LeadModel } from 'src/app/modules/new-lead/lead-model';

// peguei a ideia de https://stackblitz.com/edit/angular-6-registration-login-example?file=app%2F_helpers%2Ffake-backend.ts
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // usuarios armazenados no local storage
    let savedUsers: UserModel[] = this.storageService.getUsers();

    // registrar usuário
    if (request.url.endsWith('/users/register') && request.method === 'POST') {
      // coloca o valor de body em newUser
      let newUser: UserModel = request.body as UserModel;
      // verifica se o usuário já está cadastrado.
      // o endereço de email deve ser único
      let duplicateUser = savedUsers.filter((user) => {
        return user.email === newUser.email;
      }).length;
      // se estiver, retorna um erro
      if (duplicateUser) {
          return throwError({ error: { message: 'Este usuário já existe.' } });
      }

      // se o usuário não estiver duplicado, ele é adicionado no array de usuários
      savedUsers.push(newUser);
      // e então o array com todos os usuários, incluindo o novo, é salvo
      this.storageService.replaceUsers(savedUsers);

      // e aí retorna uma nova resposta com o status ok
      return of(new HttpResponse({ status: 200 }));
    }

    // autenticar usuário
    if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
      // coloca o valor de body em loginUser
      let loginUser: UserModel = request.body as UserModel;
      // verifica se o loginUser é um usuário registrado
      let filteredUsers = savedUsers.filter(user => {
          return user.email === loginUser.email && user.password === loginUser.password;
      });
      // se o usuário estiver registrado...
      if (filteredUsers.length) {
          // ... cria-se um currentUser e retorna com status ok
          let currentUser: CurrentUserModel = new CurrentUserModel(
            filteredUsers[0].email,
            'fake-jwt-token'
          );

          return of(new HttpResponse({ status: 200, body: currentUser }));
        // se não estiver registrado...
      } else {
          // ... retorna um erro
          return throwError({ error: { message: 'Email ou senha incorretos.' } });
      }
    }

    // adicionar nova lead às leads do currentUser
    if (request.url.endsWith('user/new-lead') && request.method === 'POST') {
      // se a requisiçao contem o token no cabeçalho...
      if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
        // ...pega o currentUser
        let currentUser: CurrentUserModel = this.storageService.getCurrentUser();
        // pega a new-lead
        let newLead: LeadModel = request.body as LeadModel;
        // procura o usuario original
        for (let user of savedUsers) {
          if (user.email === currentUser.email) {
            // inclui a nova lead no array de leads do usuário
            user.leads.push(newLead);
            // atualiza o registro de usuários
            this.storageService.replaceUsers(savedUsers);
            // e aí retorna uma nova resposta com o status ok
            return of(new HttpResponse({ status: 200 }));
          }
        }
        // se a requisiçao nao contem o token, retorna um erro
      } else {
        // return 401 not authorised if token is null or invalid
        return throwError({ error: { message: 'Unauthorised' } });
      }
    }

    // recuperar leads do currentUser
    if (request.url.endsWith('user/leads') && request.method === 'GET') {
      // se a requisiçao contem o token no cabeçalho...
      if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
        // ...pega o currentUser
        let currentUser: CurrentUserModel = this.storageService.getCurrentUser();
        // procura o usuario original
        let filteredUsers = savedUsers.filter(user => {
          return user.email === currentUser.email;
        });
        if (filteredUsers.length) {
          // pega os leads do current user
          let leads: LeadModel[] = filteredUsers[0].leads;
          return of(new HttpResponse({ status: 200, body: leads }));
        }
        // se a requisiçao nao contem o token, retorna um erro
      } else {
        // return 401 not authorised if token is null or invalid
        return throwError({ error: { message: 'Unauthorised' } });
      }
    }

    // atualiza o array de leads existente do currentUser
    if (request.url.endsWith('user/leads/update') && request.method === 'POST') {
      // se a requisiçao contem o token no cabeçalho...
      if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
        // ...pega o currentUser
        let currentUser: CurrentUserModel = this.storageService.getCurrentUser();
        // pega o array de leads
        let leads: LeadModel[] = request.body as LeadModel[];
        // procura o usuario original
        for (let user of savedUsers) {
          if (user.email === currentUser.email) {
            // atualiza as leads do usuário
            user.leads = leads;
            // atualiza o registro de usuários
            this.storageService.replaceUsers(savedUsers);
            // e aí retorna uma nova resposta com o status ok
            return of(new HttpResponse({ status: 200 }));
          }
        }
        // se a requisiçao nao contem o token, retorna um erro
      } else {
        // return 401 not authorised if token is null or invalid
        return throwError({ error: { message: 'Unauthorised' } });
      }
    }


    return next.handle(request);
  }
}
