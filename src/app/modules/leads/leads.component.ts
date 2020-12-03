import { LeadModel, LeadStatus } from './../new-lead/lead-model';
import { Component, OnInit } from '@angular/core';
import { StorageKeys, StorageService } from 'src/app/core/services/storage.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  savedLeads: LeadModel[];
  clienteEmPotencial: LeadModel[];
  dadosConfirmados: LeadModel[];
  reuniaoAgendada: LeadModel[];

  constructor(
    private storageService: StorageService,
  ) {
    this.clienteEmPotencial = [];
    this.dadosConfirmados = [];
    this.reuniaoAgendada = [];
  }

  ngOnInit(): void {
    this.getLeads();
  }

  getLeads() {
    this.savedLeads = [];
    let temp: any = this.storageService.getLeads();
    if (temp !== null) {
      this.savedLeads = [...temp];
      this.sortLeads();
    }
  }

  sortLeads() {
    for (let lead of this.savedLeads) {
      if (lead.status === LeadStatus.clienteEmPotencial) {
        this.clienteEmPotencial = [...this.clienteEmPotencial, lead];
      } else if (lead.status === LeadStatus.dadosConfirmados) {
        this.dadosConfirmados = [...this.dadosConfirmados, lead];
      } else if (lead.status === LeadStatus.reuniaoAgendada) {
        this.reuniaoAgendada = [...this.reuniaoAgendada, lead];
      }
    }
  }

  clear() {
    this.storageService.clear();
  }

  // essa funçao
  dropLead(event: CdkDragDrop<LeadModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log('passou if');
    } else {
      console.log('passou else');
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.id === LeadStatus.dadosConfirmados) {
        this.dadosConfirmados[event.currentIndex].status = LeadStatus.dadosConfirmados;
      } else if (event.container.id === LeadStatus.reuniaoAgendada) {
        this.reuniaoAgendada[event.currentIndex].status = LeadStatus.reuniaoAgendada;
      }
    }
    let newSavedLeads: LeadModel[] = [];
    newSavedLeads = [...this.clienteEmPotencial, ...this.dadosConfirmados, ...this.reuniaoAgendada];
    console.log(newSavedLeads);
    this.storageService.replaceLeads(newSavedLeads);
  }

}
