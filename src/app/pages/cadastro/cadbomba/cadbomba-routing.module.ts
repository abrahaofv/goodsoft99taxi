import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadbombaPage } from './cadbomba.page';

const routes: Routes = [
  {
    path: '',
    component: CadbombaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadbombaPageRoutingModule {}
