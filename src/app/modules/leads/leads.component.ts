import { LeadModel } from './../new-lead/lead-model';
import { Component, OnInit } from '@angular/core';
import { StorageKeys, StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  constructor(
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
  }

  getLead() {
    console.log(this.storageService.getLeads());
  }

  setLead() {
    // this.storageService.saveLead();
  }

  clear() {
    this.storageService.clear();
  }

}
