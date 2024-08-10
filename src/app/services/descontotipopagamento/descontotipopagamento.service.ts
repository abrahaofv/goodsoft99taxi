// src\app\services\descontotipopagamento\descontotipopagamento.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, DescontoTiposPagamento } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontotipopagamentoService {
  constructor(private dbService: DatabaseService) {}

  async addDescontotipopagamentoService(
    iddesconto: number,
    tipopagamento: string,
    valorpago: number
    ){
      return await this.dbService.addDescontoTiposPagamento(
        iddesconto, 
        tipopagamento, 
        valorpago)
    };
  
  async updateDescontotipopagamentoService(
    id: number,
    iddesconto: number,
    tipopagamento: string,
    valorpago: number
    ){
      return await this.dbService.updateDescontoTiposPagamento(
        id,
        iddesconto, 
        tipopagamento, 
        valorpago)
    };

  async getDescontoTiposPagamentoByDescontoId(id: number): Promise<DescontoTiposPagamento[]>{
    return await this.dbService.getDescontoTiposPagamentoByDescontoId(id);
  }

  async deleteDescontoTiposPagamento(id: number){
    return await this.dbService.deleteDescontoTiposPagamento(id);
  }
}
