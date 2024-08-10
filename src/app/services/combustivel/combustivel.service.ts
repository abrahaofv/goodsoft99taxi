// src/app/services/combustivel.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, Combustivel } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class CombustivelService {
  constructor(private dbService: DatabaseService) {}

  async getAllCombustiveis() {
    return await this.dbService.getAllCombustiveis();
  }

  async getAllCombustiveisCombustivel() {
    return await this.dbService.getAllCombustiveisCombustivel();
  }

  async getAllCombustiveisProduto() {
    return await this.dbService.getAllCombustiveisProduto();
  }

  async addCombustivel(id: number, nome: string, idbico: string, idbomba: string, preco: number, tipoproduto: string, status: boolean, ehcombustivel: boolean, ncm: string, anp: string, codigobarras: string) {
    return await this.dbService.addCombustivel(id, nome, idbico, idbomba, preco, tipoproduto, status, ehcombustivel, ncm, anp, codigobarras);
  }

  async updateCombustivel(id: number, nome: string, idbico: string, idbomba: string, preco: number, tipoproduto: string, status: boolean, ehcombustivel: boolean, ncm: string, anp: string, codigobarras: string) {
    return await this.dbService.updateCombustivel(id, nome, idbico, idbomba, preco, tipoproduto, status, ehcombustivel, ncm, anp, codigobarras);
  }

  async deleteCombustivel(id: number) {
    return await this.dbService.deleteCombustivel(id);
  }

  async getCombustivelById(id: number) {
    return await this.dbService.getCombustivelById(id);
  }

  async getCombustiveisByBombaId(bombaId: number): Promise<Combustivel[]> {
    return await this.dbService.getCombustiveisByBombaId(bombaId);
  }

  async getCombustivelByBombaAndBico(bombaId: number, bicoId: number): Promise<Combustivel | undefined> {
    return await this.dbService.getCombustivelByBombaAndBico(bombaId, bicoId);
  }
}
