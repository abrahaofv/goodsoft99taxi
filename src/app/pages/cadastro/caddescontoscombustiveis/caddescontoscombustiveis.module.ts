import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaddescontoscombustiveisPageRoutingModule } from './caddescontoscombustiveis-routing.module';

import { CaddescontoscombustiveisPage } from './caddescontoscombustiveis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaddescontoscombustiveisPageRoutingModule
  ],
  declarations: [CaddescontoscombustiveisPage]
})
export class CaddescontoscombustiveisPageModule {}
