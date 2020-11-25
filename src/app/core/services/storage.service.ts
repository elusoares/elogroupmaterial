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
    this.localStorage = window.localStorage;
  }

  saveLead(lead: LeadModel) {
    let savedLeads: LeadModel[] = this.getLeads();
    let newSavedLeads: LeadModel[] = [];
    if (savedLeads === null) {
      newSavedLeads = [...newSavedLeads, lead];
      console.log('nao tem leads cadastradas');
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(newSavedLeads));
    } else {
      console.log('tem lead cadastrada');
      console.log(savedLeads);
      savedLeads = [...savedLeads, lead];
      console.log(savedLeads);
      this.localStorage.setItem(StorageKeys.leads, JSON.stringify(savedLeads));
    }
  }

  getLeads(): LeadModel[] {
    return JSON.parse(this.localStorage.getItem(StorageKeys.leads));
  }

  clear() {
    this.localStorage.clear();
  }

}
