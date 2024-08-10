// src\app\services\descontocombustiveis\descontocombustiveis.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, DescontosCombustiveis } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class DescontocombustiveisService {
  constructor(private dbService: DatabaseService) {}

  async addDescontoCombustivel(
    iddesconto: number,
    idcombustivel: number,
    idbomba: number,
    idbico: number,
    nome: string,
    preco: number,
    totallitros: number,
    totalprecocombustivel: number,
    totaldescontocombustivel: number,
    totaldescontorecebidocombustivel: number
  ) {
    return await this.dbService.addDescontoCombustivel(
      iddesconto,
      idcombustivel,
      idbomba,
      idbico,
      nome,
      preco,
      totallitros,
      totalprecocombustivel,
      totaldescontocombustivel,
      totaldescontorecebidocombustivel
    );
  }

  async updateDescontoCombustivel(
    id: number,
    iddesconto: number,
    idcombustivel: number,
    idbomba: number,
    idbico: number,
    nome: string,
    preco: number,
    totallitros: number,
    totalprecocombustivel: number,
    totaldescontocombustivel: number,
    totaldescontorecebidocombustivel: number
  ) {
    return await this.dbService.updateDescontoCombustivel(
      id,
      iddesconto,
      idcombustivel,
      idbomba,
      idbico,
      nome,
      preco,
      totallitros,
      totalprecocombustivel,
      totaldescontocombustivel,
      totaldescontorecebidocombustivel
    );
  }

  /*   async getDescontoCombustiveisByDescontoId(iddesconto: number) {
    return await this.dbService.getDescontoCombustiveisByDescontoId(iddesconto);
  } */

  async getDescontosCombustiveisByDescontoId(id: number): Promise<DescontosCombustiveis[]> {
    return await this.dbService.descontoscombustiveis.where('iddesconto').equals(id).toArray();
  }

  async deleteDescontosCombustiveis(id: number){
    return await this.dbService.deleteDescontosCombustiveis(id);
  }
}
