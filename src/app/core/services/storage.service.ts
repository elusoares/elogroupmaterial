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
    // antes de salvar, verificar se ja existe um array de leads com a key 'leads'.
    // se já existir, a nova lead será iterada ao array existente.
    // se nao existir, será criado um novo registro.
    // saveLeads armazena temporariamente o possivel array de leads que ja esta armazenado
    let savedLeads: LeadModel[] = this.getLeads();
    // newSaveLeads é uma variável que ajudará a incluir uma nova lead no array de leads
    /* let newSavedLeads: LeadModel[] = [];
    // se o tamanho de saveLeads é 0, entao nao ha nenhum registro no storage
    if (savedLeads.length === 0) {
      // ai vamos criar um novo registro iterando a nova lead ao array newSaveLeads
      newSavedLeads = [...newSavedLeads, lead];
      console.log('nao tem leads cadastradas');
      // e entao adicionar o registro
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(newSavedLeads));
    } else { // se saveLeads nao é 0, entao ja existe um array de leads armazenado
      console.log('tem lead cadastrada');
      console.log(savedLeads);
      // ai iteramos a nova lead a saveLeads
      savedLeads = [...savedLeads, lead];
      console.log(savedLeads);
      // e sobrescreve o registro existente
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(savedLeads));
    } */
    savedLeads.push(lead);
    // e entao adicionar o registro
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
    // getUsers() retornará um array com os users ou um array vazio se nao houver user salvo
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

  replaceUsers(users: UserModel[]) {
    this.localStorage.setItem(StorageKeys.users, JSON.stringify(users));
  }

  getCurrentUser(): UserModel {
    return JSON.parse(this.localStorage.getItem(StorageKeys.currentUser));
  }

  saveCurrentUser(user: UserModel) {
    this.localStorage.setItem(StorageKeys.currentUser, JSON.stringify(user));
  }

  deleteCurrentUser() {
    this.localStorage.removeItem(StorageKeys.currentUser);
  }
  // limpa tudo no localstorage
  clear() {
    this.localStorage.clear();
  }

}
