import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescontoPage } from './desconto.page';

const routes: Routes = [
  {
    path: '',
    component: DescontoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescontoPageRoutingModule {}
