import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BombaPage } from './bomba.page';

const routes: Routes = [
  {
    path: '',
    component: BombaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BombaPageRoutingModule {}
