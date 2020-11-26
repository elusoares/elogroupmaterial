import { Injectable } from '@angular/core';
import { LeadModel } from 'src/app/modules/new-lead/lead-model';

export const enum StorageKeys {
  leads = 'leads',
  users = 'users'
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
    // Nao fiz tratamento de erros pq nao tem tempo pra isso agora
    this.localStorage = window.localStorage;
  }

  // salva uma nova lead.
  saveLead(lead: LeadModel) {
    // antes de salvar, verificar se ja existe um array de leads com a key 'leads'.
    // se já existir, a nova lead será iterada ao array existente.
    // se nao existir, será criado um novo registro.
    // saveLeads armazena temporariamente o possivel array de leads que ja esta armazenado
    let savedLeads: LeadModel[] = this.getLeads();
    // newSaveLeads é uma variável que ajudará a incluir uma nova lead no array de leads
    let newSavedLeads: LeadModel[] = [];
    // se saveLeads é null, entao nao ha nenhum registro no storage
    if (savedLeads === null) {
      // ai vamos criar um novo iterando a nova lead ao array newSaveLeads
      newSavedLeads = [...newSavedLeads, lead];
      console.log('nao tem leads cadastradas');
      // e entao adicionar o registro
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(newSavedLeads));
    } else { // se saveLeads nao é nulo, entao ja existe um array de leads armazenado
      console.log('tem lead cadastrada');
      console.log(savedLeads);
      // ai iteramos a nova lead a saveLeads
      savedLeads = [...savedLeads, lead];
      console.log(savedLeads);
      // e sobrescreve o registro existente
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(savedLeads));
    }
  }

  // recupera os leads salvos
  getLeads(): LeadModel[] {
    return JSON.parse(this.localStorage.getItem(StorageKeys.leads));
  }

  // limpa tudo no localstorage
  clear() {
    this.localStorage.clear();
  }

}
