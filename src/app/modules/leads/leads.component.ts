import { UserModel } from './../user/user-model';
import { CurrentUserModel } from './../user/current-user-model';
import { LeadModel, LeadStatus } from './../new-lead/lead-model';
import { Component, OnInit } from '@angular/core';
import { StorageKeys, StorageService } from 'src/app/core/services/storage.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FakeBackendService } from 'src/app/core/services/fake-backend.service';

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
    private fakeBackendService: FakeBackendService
  ) {
    this.clienteEmPotencial = [];
    this.dadosConfirmados = [];
    this.reuniaoAgendada = [];
  }

  ngOnInit(): void {
    this.getLeads();
  }

  // pega as leads do currentUser que estão salvas
  getLeads() {
    this.fakeBackendService.getLeads().subscribe((leads: LeadModel[]) => {
      this.savedLeads = leads;
      this.sortLeads();
    },
    (error) => {
      console.log(error);
    });
  }

  // separa as leads do servidor fake em 3 arrays diferentes:
  // clienteEmPotencial, dadosConfirmados e reuniaoAgendada,
  // para que sejam mostradas nos 3 cards da tela
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

  // essa funçao muda as leads de lugar por meio do arrasta e solta
  dropLead(event: CdkDragDrop<LeadModel[]>) {
    // se o usuario arrastou e soltou a lead dentro do proprio card...
    if (event.previousContainer === event.container) {
      // entao a posiçao da lead no card é atualizada
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // mas se o usuario soltou a lead dentro de um card diferente...
    } else {
      // entao a lead é transferida para o array correspondente ao card.
      // as leads de clienteEmPotencial so podem ser soltadas em dadosConfirmados.
      // as leads de dadosConfirmados so podem ser soltas em reuniaoAgendada.
      // as leads de reuniaoAgendada nao podem ser soltas em nenhum outro card
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // esse if atualiza o campo status de cada lead.
      // esse campo é usado na funçao sortLeads
      if (event.container.id === LeadStatus.dadosConfirmados) {
        this.dadosConfirmados[event.currentIndex].status = LeadStatus.dadosConfirmados;
      } else if (event.container.id === LeadStatus.reuniaoAgendada) {
        this.reuniaoAgendada[event.currentIndex].status = LeadStatus.reuniaoAgendada;
      }
    }
    // atualiza todas as leads do currentUser
    let newSavedLeads: LeadModel[] = [];
    newSavedLeads = [...this.clienteEmPotencial, ...this.dadosConfirmados, ...this.reuniaoAgendada];
    this.fakeBackendService.updateLeads(newSavedLeads).subscribe((res) => {
      console.log('leads atualizadas');
    },
    (error) => {
      console.log(error);
    });
  }

  test() {
    let currentUser: CurrentUserModel = this.storageService.getCurrentUser();
    let users: UserModel[] = this.storageService.getUsers();
    let filteredUsers = users.filter(user => {
      return user.email === currentUser.email;
    });
    // console.log(users.indexOf)

  }

}
