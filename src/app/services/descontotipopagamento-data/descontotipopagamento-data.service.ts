// src\app\services\descontotipopagamento-data\descontotipopagamento-data.service.ts

import { Injectable } from '@angular/core';
import { DescontoTiposPagamento } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontotipopagamentoDataService {
  private descontoTiposPagamento: DescontoTiposPagamento | null = null;

  setDesconto(data: DescontoTiposPagamento) {
    this.descontoTiposPagamento = data;
  }

  getDesconto(): DescontoTiposPagamento | null {
    const data = this.descontoTiposPagamento;
    this.descontoTiposPagamento = null; // Limpar após obter para evitar dados residuais
    return data;
  }
}
