// src\app\pages\ajuda\ajuda.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss']
})
export class AjudaPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  fazerLigacao() {
    window.location.href = 'tel:+552125440159';
  }

  enviarEmail() {
    window.location.href = 'mailto:contato@goodsoft.com.br';
  }

  abrirWhatsApp() {
    window.location.href = 'https://wa.me/+5521984766888';
  }
}
