import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadbombaPageRoutingModule } from './cadbomba-routing.module';

import { CadbombaPage } from './cadbomba.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CadbombaPageRoutingModule],
  declarations: [CadbombaPage]
})
export class CadbombaPageModule {}
