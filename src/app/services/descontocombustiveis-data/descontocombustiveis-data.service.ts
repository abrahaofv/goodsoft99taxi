// src\app\services\descontocombustiveis-data\descontocombustiveis-data.service.ts

import { Injectable } from '@angular/core';
import { DescontosCombustiveis } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontocombustiveisDataService {
  private descontoCombustivel: DescontosCombustiveis | null = null;

  setDesconto(data: DescontosCombustiveis) {
    this.descontoCombustivel = data;
  }

  getDesconto(): DescontosCombustiveis | null {
    const data = this.descontoCombustivel;
    this.descontoCombustivel = null; // Limpar após obter para evitar dados residuais
    return data;
  }
}
