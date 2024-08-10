import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BombaPageRoutingModule } from './bomba-routing.module';

import { BombaPage } from './bomba.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BombaPageRoutingModule],
  declarations: [BombaPage]
})
export class BombaPageModule {}
