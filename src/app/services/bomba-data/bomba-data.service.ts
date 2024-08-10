// src/app/services/bomba-data.service.ts
import { Injectable } from '@angular/core';
import { Bomba } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class BombaDataService {
  private bomba: Bomba | null = null;

  setBomba(data: Bomba) {
    this.bomba = data;
  }

  getBomba(): Bomba | null {
    const data = this.bomba;
    this.bomba = null; // Limpar após obter para evitar dados residuais
    return data;
  }
}
