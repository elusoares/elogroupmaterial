import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    // aqui será redirect to /login pq a autenticaçao nao esta implementada.
    // se estivesse, seria redirect to /home, e aí o authentication guard verificaria se o usuario
    // está de fato autenticado. Se nao, seria redirecionado pra login
    // redirectTo: 'login',
    loadChildren: () => import('./authentication/authentication.module').then( m => m.AuthenticationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
