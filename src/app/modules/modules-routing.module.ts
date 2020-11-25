import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootComponent } from './root/root.component';


const routes: Routes = [
  {
    path: 'leads',
    component: RootComponent,
    children: [
      {
        path: '',
        loadChildren: () => import ('./leads/leads.module').then( m => m.LeadsModule)
      },
      {
        path: 'new-lead',
        loadChildren: () => import ('./new-lead/new-lead.module').then( m => m.NewLeadModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
