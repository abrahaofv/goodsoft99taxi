// src/app/services/desconto-data/desconto-data.service.ts

import { Injectable } from '@angular/core';
import { Desconto, DescontosCombustiveis, DescontoTiposPagamento } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontoDataService {
  private desconto: Desconto | null = null;
  private descontosCombustiveis: DescontosCombustiveis[] = [];
  private descontoTiposPagamento: DescontoTiposPagamento[] = [];
  private currentDescontoCombustivel: { item: DescontosCombustiveis, index: number } | null = null;
  private currentDescontoTiposPagamento: { item: DescontoTiposPagamento, index: number } | null = null;

  //#region Desconto
  setDesconto(data: Desconto) {
    this.desconto = data;
  }

  getDesconto(): Desconto | null {
    return this.desconto;
  }

  setReciboAndPagamento(numeroRecibo: string) {
    if (this.desconto) {
      this.desconto.numerorecibo = numeroRecibo;
    }
  }

  getReciboAndPagamento() {
    if (this.desconto) {
      return { numerorecibo: this.desconto.numerorecibo };
    }
    return { numerorecibo: null };
  }
  //#endregion

  //#region DescontoCombustivel
  addDescontoCombustivel(data: DescontosCombustiveis) {
    this.descontosCombustiveis.push(data);
  }

  updateDescontoCombustivel(index: number, data: DescontosCombustiveis) {
    this.descontosCombustiveis[index] = data;
  }

  getDescontosCombustiveis(): DescontosCombustiveis[] {
    return this.descontosCombustiveis;
  }

  setDescontosCombustiveis(data: DescontosCombustiveis[]) {
    this.descontosCombustiveis = data;
  }

  setCurrentDescontoCombustivel(item: DescontosCombustiveis, index: number) {
    this.currentDescontoCombustivel = { item, index };
  }

  getCurrentDescontoCombustivel(): { item: DescontosCombustiveis, index: number } | null {
    return this.currentDescontoCombustivel;
  }

  clearCurrentDescontoCombustivel() {
    this.currentDescontoCombustivel = null;
  }
  //#endregion

  //#region DescontoTiposPagamento
  addDescontoTiposPagamento(data: DescontoTiposPagamento) {
    this.descontoTiposPagamento.push(data);
  }

  updateDescontoTiposPagamento(index: number, data: DescontoTiposPagamento) {
    this.descontoTiposPagamento[index] = data;
  }

  getDescontoTiposPagamento(): DescontoTiposPagamento[] {
    return this.descontoTiposPagamento;
  }

  setDescontoTiposPagamento(data: DescontoTiposPagamento[]) {
    this.descontoTiposPagamento = data;
  }

  setCurrentDescontoTiposPagamento(item: DescontoTiposPagamento, index: number) {
    this.currentDescontoTiposPagamento = { item, index };
  }

  getCurrentDescontoTiposPagamento(): { item: DescontoTiposPagamento, index: number } | null {
    return this.currentDescontoTiposPagamento;
  }

  clearCurrentDescontoTiposPagamento() {
    this.currentDescontoTiposPagamento = null;
  }  
  //#endregion

  clear() {
    this.desconto = null;
    this.descontosCombustiveis = [];
    this.descontoTiposPagamento = [];
    this.currentDescontoCombustivel = null;
    this.currentDescontoTiposPagamento = null;
  }
}
