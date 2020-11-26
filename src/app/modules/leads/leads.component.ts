import { LeadModel, LeadsCollumns, LeadStatus } from './../new-lead/lead-model';
import { Component, OnInit } from '@angular/core';
import { StorageKeys, StorageService } from 'src/app/core/services/storage.service';

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

  leadsCols: LeadsCollumns[];
  constructor(
    private storageService: StorageService,
  ) {
    this.leadsCols = [
      { field: LeadStatus.clienteEmPotencial, header: 'Cliente em Potencial' },
      { field: LeadStatus.dadosConfirmados, header: 'Dados Confirmados' },
      { field: LeadStatus.reuniaoAgendada, header: 'Reunião Agendada' }
    ];
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
    console.log(this.savedLeads);
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
    console.log(this.clienteEmPotencial);
    console.log(this.dadosConfirmados);
    console.log(this.reuniaoAgendada);
  }


  setLead() {
    // this.storageService.saveLead();
  }

  clear() {
    this.storageService.clear();
  }

  dropLead(event) {

  }

}
