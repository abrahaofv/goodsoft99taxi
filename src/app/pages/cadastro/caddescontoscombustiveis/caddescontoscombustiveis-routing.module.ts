import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaddescontoscombustiveisPage } from './caddescontoscombustiveis.page';

const routes: Routes = [
  {
    path: '',
    component: CaddescontoscombustiveisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaddescontoscombustiveisPageRoutingModule {}
