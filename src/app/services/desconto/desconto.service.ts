// src/app/services/desconto.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, Desconto, DescontosCombustiveis, DescontoTiposPagamento } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontoService {
  constructor(private dbService: DatabaseService) {}

  async addDesconto(
    totalpreco: number,
    totaldesconto: number,
    datahora: Date,
    numerorecibo: string,
    idpedidodidiglobal: string,
    codigodesconto: string,
    confirmado: boolean,
    totaldescontorecebido: number,
    cancelado: boolean,
    nomeatendente: string,
  ) {
    return await this.dbService.addDesconto(
      totalpreco,
      totaldesconto,
      datahora,
      numerorecibo,
      idpedidodidiglobal,
      codigodesconto,
      confirmado,
      totaldescontorecebido,
      cancelado,
      nomeatendente,
    );
  }

  async getAllDescontos() {
    return await this.dbService.getAllDescontos();
  }

  async getDescontoById(id: number): Promise<Desconto | undefined> {
    return await this.dbService.getDescontoById(id);
  }

  async updateDesconto(
    id: number,
    totalpreco: number,
    totaldesconto: number,
    datahora: Date,
    numerorecibo: string,
    idpedidodidiglobal: string,
    codigodesconto: string,
    confirmado: boolean,
    totaldescontorecebido: number,
    cancelado: boolean,
    nomeatendente: string,
  ) {
    return await this.dbService.updateDesconto(
      id,
      totalpreco,
      totaldesconto,
      datahora,
      numerorecibo,
      idpedidodidiglobal,
      codigodesconto,
      confirmado,
      totaldescontorecebido,
      cancelado,
      nomeatendente,
    );
  }

  async deleteDesconto(id: number) {
    return await this.dbService.deleteDesconto(id);
  }

  async addDescontoCombustivel(item: DescontosCombustiveis) {
    return await this.dbService.addDescontoCombustivel(
      item.iddesconto,
      item.idcombustivel,
      item.idbomba,
      item.idbico,
      item.nome,
      item.preco,
      item.totallitros,
      item.totalprecocombustivel,
      item.totaldescontocombustivel,
      item.totaldescontorecebidocombustivel
    );
  }

  async updateDescontoCombustivel(item: DescontosCombustiveis) {
    return await this.dbService.updateDescontoCombustivel(
      item.id!,
      item.iddesconto,
      item.idcombustivel,
      item.idbomba,
      item.idbico,
      item.nome,
      item.preco,
      item.totallitros,
      item.totalprecocombustivel,
      item.totaldescontocombustivel,
      item.totaldescontorecebidocombustivel
    );
  }

  async addDescontoTiposPagamento(item: DescontoTiposPagamento){
    return await this.dbService.addDescontoTiposPagamento(
      item.iddesconto,
      item.tipopagamento,
      item.valorpago
    )
  }

  async updateDescontoTiposPagamento(item: DescontoTiposPagamento){
    return await this.dbService.updateDescontoTiposPagamento(
      item.id!,
      item.iddesconto,
      item.tipopagamento,
      item.valorpago
    )
  }

  async cancelaDesconto(id: number){
    return await this.dbService.cancelaDesconto(id);
  }

  async getDescontoTiposPagamentoByDescontoId(iddesconto: number): Promise<DescontoTiposPagamento[]> {
    return await this.dbService.getDescontoTiposPagamentoByDescontoId(iddesconto);
  }

  async deleteDescontoTiposPagamento(id: number) {
    return await this.dbService.deleteDescontoTiposPagamento(id);
  }
}
