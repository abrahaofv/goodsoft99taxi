// src/app/services/combustivel-data.service.ts
import { Injectable } from '@angular/core';
import { Combustivel } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class CombustivelDataService {
  private combustivel: Combustivel | null = null;

  setCombustivel(data: Combustivel) {
    this.combustivel = data;
  }

  getCombustivel(): Combustivel | null {
    const data = this.combustivel;
    this.combustivel = null; // Limpar após obter para evitar dados residuais
    return data;
  }
}
