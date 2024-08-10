import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescontoPageRoutingModule } from './desconto-routing.module';

import { DescontoPage } from './desconto.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DescontoPageRoutingModule],
  declarations: [DescontoPage]
})
export class DescontoPageModule {}
