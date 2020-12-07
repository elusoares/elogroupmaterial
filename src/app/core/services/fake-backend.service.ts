import { LeadModel } from './../../modules/new-lead/lead-model';
import { CurrentUserModel } from './../../modules/user/current-user-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/modules/user/user-model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FakeBackendService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  // as requisiçoes feitas aqui sao interceptadas por fake-backend-interceptor

  // registra um novo usuário
  signup(user: UserModel) {
    return this.http.post('/users/register', user);
  }

  // autentica um usuário existente
  login(email: string, password: string) {
    // faz uma requisiçao para '/users/authenticate' e armazena o currentUser, se houver
    return this.http.post('/users/authenticate', {email: email, password: password}).pipe(
      map(user => {
        if (user) {
          this.storageService.saveCurrentUser(user as CurrentUserModel);
        }
        return user;
      })
    );
  }

  // desloga do sistema
  logout() {
    // remove user from local storage to log user out
    this.storageService.deleteCurrentUser();
  }

  getLeads() {
    return this.http.get('user/leads');
  }

  newLead(lead: LeadModel) {
    return this.http.post('user/new-lead', lead);
  }

  updateLeads(leads: LeadModel[]) {
    return this.http.post('user/leads/update', leads);
  }
}
