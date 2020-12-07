import { CurrentUserModel } from './../../modules/user/current-user-model';
import { Injectable } from '@angular/core';
import { LeadModel } from 'src/app/modules/new-lead/lead-model';
import { UserModel } from 'src/app/modules/user/user-model';

export const enum StorageKeys {
  leads = 'leads',
  users = 'users',
  currentUser = 'currentUser'
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorage: Storage;
  constructor(

  ) {
    // nao usei lib. Ate instalei ngx-pwa/local storage, mas nao consegui
    // lidar com os observers. Precisava subscrever no metodo de set
    // depois de receber o resultado da inscricao do metodo get. Nao entendo muito de rxjs,
    // mas em outros momentos eu usei pipe, map e switchMap e funcionou. Mas nessa lib
    // nao, entao desinstalei.
    // peguei a ideia de https://firstclassjs.com/persist-data-using-local-storage-and-angular/
    this.localStorage = window.localStorage;
  }

  // salva uma nova lead.
  saveOneLead(lead: LeadModel) {
    // salva todos os leads na variavel savedLeads.
    let savedLeads: LeadModel[] = this.getLeads();
    // adiciona o novo lead
    savedLeads.push(lead);
    // sobrescreve o registro de leads
    this.localStorage.setItem(StorageKeys.leads, JSON.stringify(savedLeads));
  }

  // recupera as leads salvas
  getLeads(): LeadModel[] {
    // retorna as leads armazenadas ou um array vazio se nao tiver nada
    return JSON.parse(this.localStorage.getItem(StorageKeys.leads)) || [];
  }

  // em leadsComponent, vai ser necessario subscrever todas as leads
  replaceLeads(leads: LeadModel[]) {
    this.localStorage.setItem(StorageKeys.leads, JSON.stringify(leads));
  }

  // salva um usuario
  saveOneUser(user: UserModel) {
    // salva todos os usuarios na variavel savedUsers.
    let savedUsers: UserModel[] = this.getUsers();
    // adiciona o novo user em savedUsers
    savedUsers.push(user);
    // sobrescreve users
    this.localStorage.setItem(StorageKeys.users, JSON.stringify(savedUsers));
  }

  // recupera os users salvos
  getUsers(): UserModel[] {
    // retorna os usuarios armazenados ou um array vazio se nao houver usuarios
    return JSON.parse(this.localStorage.getItem(StorageKeys.users)) || [];
  }

  // sobrescreve os usuários existentes
  replaceUsers(users: UserModel[]) {
    this.localStorage.setItem(StorageKeys.users, JSON.stringify(users));
  }

  // retorna o current user
  getCurrentUser(): CurrentUserModel {
    return JSON.parse(this.localStorage.getItem(StorageKeys.currentUser));
  }

  // cria um novo currentUser
  saveCurrentUser(user: CurrentUserModel) {
    this.localStorage.setItem(StorageKeys.currentUser, JSON.stringify(user));
  }

  // deleta o currentUser
  deleteCurrentUser() {
    this.localStorage.removeItem(StorageKeys.currentUser);
  }
  // limpa tudo no localstorage
  clear() {
    this.localStorage.clear();
  }

}
