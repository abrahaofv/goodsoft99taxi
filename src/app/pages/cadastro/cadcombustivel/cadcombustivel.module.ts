import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadcombustivelPageRoutingModule } from './cadcombustivel-routing.module';

import { CadcombustivelPage } from './cadcombustivel.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CadcombustivelPageRoutingModule],
  declarations: [CadcombustivelPage]
})
export class CadcombustivelPageModule {}
