import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootComponent } from './root.component';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule
  ]
})
export class RootModule { }
