import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';

import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [LeadsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
