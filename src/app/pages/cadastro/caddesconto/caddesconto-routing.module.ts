import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaddescontoPage } from './caddesconto.page';

const routes: Routes = [
  {
    path: '',
    component: CaddescontoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaddescontoPageRoutingModule {}
