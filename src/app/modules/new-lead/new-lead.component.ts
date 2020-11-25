import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomFormValidatorService } from 'src/app/core/services/custom-form-validator.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { LeadModel, OpportunityInterface, Status } from './lead-model';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-new-lead',
  templateUrl: './new-lead.component.html',
  styleUrls: ['./new-lead.component.css']
})
export class NewLeadComponent implements OnInit {
  newLeadForm: FormGroup;
  submitted: boolean;
  opportunities: OpportunityInterface[];
  selectedOpportunities: OpportunityInterface[];
  newLead: LeadModel;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private customFormValidatorService: CustomFormValidatorService,
    private storageService: StorageService,
    private router: Router
    ) {
    this.newLeadForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        this.customFormValidatorService.patternValidator(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { invalidEmail: true })
      ]),
      phone: new FormControl('', Validators.required),
      selectedOpportunities: new FormControl('', Validators.required)
    });
    this.submitted = false;
    this.opportunities = [
      {name: 'RPA'},
      {name: 'Produto Digital'},
      {name: 'Analytics'},
      {name: 'BPM'},
    ];
   }

  ngOnInit(): void {
  }

  saveLead() {
    this.submitted = true;
    if (this.newLeadForm.valid) {
      this.newLead = new LeadModel(
        this.newLeadForm.get('name').value,
        this.newLeadForm.get('phone').value,
        this.newLeadForm.get('email').value,
        this.newLeadForm.get('selectedOpportunities').value,
        Status.clienteEmPotencial
      );
      this.storageService.saveLead(this.newLead);
      this.openSnackBar('Lead incluído com sucesso', 'fechar');
      this.router.navigateByUrl('/leads');
    }
    console.log(this.newLead);
  }

  selectAll(event: MatCheckboxChange, options: MatSelectionList) {
    if (event.checked) {
      options.selectAll();
      // options.selectedOptions.selected.map(o => console.log(o.value));
    } else {
      options.deselectAll();
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }
}

