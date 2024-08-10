import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaddescontoPageRoutingModule } from './caddesconto-routing.module';

import { CaddescontoPage } from './caddesconto.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CaddescontoPageRoutingModule],
  declarations: [CaddescontoPage]
})
export class CaddescontoPageModule {}
