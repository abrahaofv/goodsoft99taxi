// src/app/services/database.service.ts

import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import * as bcrypt from 'bcryptjs';


//#region Interface Combustivel
export interface Combustivel {
  id: number;
  nome: string;
  idbicos: string;
  idbombas: string;
  preco: number;
  tipoproduto: string;
  status: boolean;
  ehcombustivel: boolean;
  ncm: string;
  anp: string;
  codigobarras: string;
}
//#endregion

//#region Interface Bomba
export interface Bomba {
  idbomba: number;
  idbicos: string;
}
//#endregion

//#region Interface Desconto
export interface Desconto {
  id?: number;
  totalpreco: number;
  totaldesconto: number;
  datahora: Date;
  numerorecibo: string;
  idpedidodidiglobal: string;
  codigodesconto: string;
  confirmado: boolean;
  totaldescontorecebido: number;
  cancelado: boolean;
  nomeatendente: string;
}
//#endregion

//#region Interface DescontosCombustiveis
export interface DescontosCombustiveis {
  id?: number;
  iddesconto: number;
  idcombustivel: number;
  idbomba: number;
  idbico: number;
  nome: string;
  preco: number;
  totallitros: number;
  totalprecocombustivel: number;
  totaldescontocombustivel: number;
  totaldescontorecebidocombustivel: number;
}
//#endregion

//#region Interface DescontoTiposPagamento
export interface DescontoTiposPagamento {
  id?: number;
  iddesconto: number;
  tipopagamento: string;
  valorpago: number;
}
//#endregion

//#region Interface Configuracao
export interface Configuracao {
  id: number;
  login: string;
  senha: string;
  urlapi: string;
  loginsagaz: string;
  senhasagaz: string;
  diretoriojson: string;
}
//#endregion

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  combustiveis: Dexie.Table<Combustivel, number>;
  bombas: Dexie.Table<Bomba, number>;
  descontos: Dexie.Table<Desconto, number>;
  descontoscombustiveis: Dexie.Table<DescontosCombustiveis, number>;
  descontotipospagamento: Dexie.Table<DescontoTiposPagamento, number>;
  configuracao: Dexie.Table<Configuracao, number>;

  constructor( ){
    super('GoodsoftDB'); 
    this.initDatabase();
  }

  private initDatabase() {
    this.version(10).stores({
      //#region Tabela Combustivel
      combustiveis: 'id, nome, idbicos, idbombas, preco, tipoproduto, status, ehcombustivel, ncm, anp, codigobarras',
      //#endregion
      //#region Tabela Bomba
      bombas: 'idbomba, idbicos',
      //#endregion
      //#region Tabela Descontos
      descontos:
        '++id,' +
        'totalpreco,' +
        'totaldesconto,' +
        'datahora,' +
        'numerorecibo,' +
        'idpedidodidiglobal,' +
        'codigoDesconto,' +
        'confirmado,' +
        'totaldescontorecebido,' +
        'cancelado,' +
        'nomeatendente',
      //#endregion
      //#region Tabela DescontosCombustiveis
      descontoscombustiveis:
        '++id,'+
        'iddesconto,'+
        'idcombustivel,'+
        'idbomba,'+
        'idbico,'+
        'nome,'+
        'preco,'+
        'totallitros,'+
        'totalprecocombustivel,'+
        'totaldescontocombustivel,' +
        'totaldescontorecebidocombustivel',
      //#endregion
      //#region Tabela DescontoTiposPagamento
      descontotipospagamento:
        '++id,' +
        'iddesconto,' +
        'tipopagamento,' +
        'valorpagamento',
      //#endregion
      //#region Tabela Configuracao
        configuracao:
        '++id,'+
        'login,'+
        'senha,'+
        'urlapi,'+
        'loginsagaz,'+
        'senhasagaz,'+
        'diretoriojson'
      //#endregion
    });

    this.combustiveis = this.table('combustiveis');
    this.bombas = this.table('bombas');
    this.descontos = this.table('descontos');
    this.descontoscombustiveis = this.table('descontoscombustiveis');
    this.descontotipospagamento = this.table('descontotipospagamento');
    this.configuracao = this.table('configuracao');
  }

  //#region Combustiveis
  async addCombustivel(id: number, nome: string, idbicos: string, idbombas: string, preco: number, tipoproduto: string, status: boolean, ehcombustivel: boolean, ncm: string, anp: string, codigobarras: string) {
    return await this.combustiveis.add({ id, nome, idbicos, idbombas, preco, tipoproduto, status, ehcombustivel, ncm, anp, codigobarras });
  }

  async getAllCombustiveis() {
    return await this.combustiveis.toArray();
  }

  async getAllCombustiveisCombustivel(){
    const allCombustiveis = await this.combustiveis.toArray();
    return allCombustiveis.filter(combustivel => combustivel.ehcombustivel);
  }

  async getAllCombustiveisProduto(){
    const allCombustiveis = await this.combustiveis.toArray();
    return allCombustiveis.filter(combustivel => !combustivel.ehcombustivel);
  }

  async updateCombustivel(id: number, nome: string, idbicos: string, idbombas: string, preco: number, tipoproduto: string, status: boolean, ehcombustivel: boolean, ncm: string, anp: string, codigobarras: string) {
    return await this.combustiveis.update(id, { nome, idbicos, idbombas, preco, tipoproduto, status, ehcombustivel, ncm, anp, codigobarras });
  }

  async deleteCombustivel(id: number) {
    return await this.combustiveis.delete(id);
  }

  async getCombustivelById(id: number): Promise<Combustivel | undefined> {
    return await this.combustiveis.get(id);
  }

  async getCombustiveisByBombaId(bombaId: number): Promise<Combustivel[]> {
    const combustiveis = await this.combustiveis.toArray();
    return combustiveis.filter((combustivel) =>
      combustivel.idbombas
        .split(',')
        .map((b) => b.trim())
        .includes(bombaId.toString())
    );
  }

  async getCombustivelByBombaAndBico(bombaId: number, bicoId: number): Promise<Combustivel | undefined> {
    const combustiveis = await this.combustiveis.toArray();

    if (combustiveis) {
      return combustiveis.find(
        (combustivel) =>
          combustivel.idbombas
            .split(',')
            .map((b) => b.trim())
            .includes(bombaId.toString()) &&
          combustivel.idbicos
            .split(',')
            .map((b) => b.trim())
            .includes(bicoId.toString())
      );
    } else {
      return undefined;
    }
  }

  async getBicosByBomba(idbomba: number): Promise<string[]> {
    const bomba = await this.getBombaById(idbomba);
    if (!bomba || !bomba.idbicos) {
      return [];
    }
    return bomba.idbicos
      .split(',')
      .map((b) => b.trim())
      .sort();
  }
  //#endregion

  //#region Desconto
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
    return await this.descontos.add({
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
    });
  }

  async getAllDescontos() {
    return await this.descontos.toArray();
  }

  async getDescontoById(id: number): Promise<Desconto | undefined> {
    return await this.descontos.get(id);
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
    return await this.descontos.update(id, {
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
    });
  }

  async deleteDesconto(id: number) {
    await this.descontoscombustiveis.where('iddesconto').equals(id).delete(); 
    await this.descontotipospagamento.where('iddesconto').equals(id).delete();
    return await this.descontos.delete(id);
  }

  async cancelaDesconto(id: number){
    const descontoACancelar = await this.getDescontoById(id);
    if(descontoACancelar){
      descontoACancelar.cancelado = true;
      descontoACancelar.confirmado = false;
      
      return await this.updateDesconto(
        descontoACancelar.id, 
        descontoACancelar.totalpreco,
        descontoACancelar.totaldesconto,
        descontoACancelar.datahora,
        descontoACancelar.numerorecibo,
        descontoACancelar.idpedidodidiglobal,
        descontoACancelar.codigodesconto,
        descontoACancelar.confirmado,
        descontoACancelar.totaldescontorecebido,
        descontoACancelar.cancelado,
        descontoACancelar.nomeatendente);
    }

    return false;
  }
  //#endregion

  //#region Bombas
  async addBomba(idbomba: number, idbicos: string) {
    return await this.bombas.add({ idbomba, idbicos });
  }

  async getAllBombas() {
    return await this.bombas.toArray();
  }

  async getBombaById(idbomba: number): Promise<Bomba | undefined> {
    return await this.bombas.get(idbomba);
  }

  async updateBomba(idbomba: number, idbicos: string) {
    return await this.bombas.update(idbomba, { idbicos });
  }

  async deleteBomba(idbomba: number) {
    return await this.bombas.delete(idbomba);
  }
  //#endregion

  //#region Descontos Combustiveis
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
    return await this.descontoscombustiveis.add({
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
    });
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
    return await this.descontoscombustiveis.update(id, {
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
    });
  }

  async getDescontosCombustiveisByDescontoId(id: number): Promise<DescontosCombustiveis[]> {
    return await this.descontoscombustiveis.where('iddesconto').equals(id).toArray();
  }

  async deleteDescontosCombustiveis(id: number) {
    return await this.descontoscombustiveis.delete(id);
  }
  //#endregion

  //#region TiposPagamento
  async addDescontoTiposPagamento(
    iddesconto: number,
    tipopagamento: string,
    valorpago: number,
  ){
    return await this.descontotipospagamento.add({
      iddesconto,
      tipopagamento,
      valorpago
    })
  }

  async updateDescontoTiposPagamento(
    id: number,
    iddesconto: number,
    tipopagamento: string,
    valorpago: number,
  ){
    return await this.descontotipospagamento.update(id, {
      iddesconto,
      tipopagamento,
      valorpago
    })
  }

  async getDescontoTiposPagamentoByDescontoId(id: number): Promise<DescontoTiposPagamento[]> {
    return await this.descontotipospagamento.where('iddesconto').equals(id).toArray();
  }

  async deleteDescontoTiposPagamento(id: number) {
    return await this.descontotipospagamento.delete(id);
  }
  //#endregion

  //#region Configuracao
  async salvaConfiguracao(id: number, login: string, senha: string, urlapi: string, loginsagaz: string, senhasagaz: string, diretoriojson: string): Promise<string>{
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);
      const hashSagaz = await bcrypt.hash(senhasagaz, salt);
  
      const configuracaoExiste = await this.getConfiguracaoById(id);
  
      if (configuracaoExiste){
        // Atualiza a configuração existente
        const configUpdated = await this.configuracao.update(id, {login, senha: hash, urlapi, loginsagaz, senhasagaz: hashSagaz, diretoriojson}); 
        return configUpdated 
          ? 'Configuração atualizada com sucesso.' 
          : 'Erro ao realizar atualização da configuração.';
      }else{
        const aConfiguracao: Configuracao = {id, login, senha: hash, urlapi, loginsagaz, senhasagaz: hashSagaz, diretoriojson};
        const configSaved = await this.configuracao.add(aConfiguracao);
        return configSaved 
          ? 'Configuração salva com sucesso.' 
          : 'Erro ao realizar o salvamento da configuração.';
      }          
    } catch (error) {
      console.log(`Erro ao criar configuração: ${error}`);
      return `Erro ao criar configuração: ${error}`;
    }    
  }

  async atualizaConfiguracaoParcial(id: number, urlapi: string, diretoriojson: string): Promise<string> {
    try {
      const configuracaoExiste = await this.getConfiguracaoById(id);
  
      if (configuracaoExiste) {
        // Atualiza apenas os campos urlapi e diretoriojson
        const configUpdated = await this.configuracao.update(id, { urlapi, diretoriojson });
        return configUpdated 
          ? 'Configuração atualizada com sucesso.' 
          : 'Erro ao realizar atualização da configuração.';
      } else {
        return 'Configuração não encontrada.';
      }
    } catch (error) {
      console.log(`Erro ao atualizar configuração: ${error}`);
      return `Erro ao atualizar configuração: ${error}`;
    }
  }
  

  async getConfiguracaoById(id: number): Promise<Configuracao | undefined> {
    return await this.configuracao.get(id);
  }

  async getConfiguracaoUrlApi(): Promise<string>{
    const config = await this.getConfiguracaoById(1);
    if(config?.urlapi){
      return config.urlapi;
    }

    return '';
  }

  async autenticar(id: number, login: string, senha: string): Promise<boolean> {
    const configuracao = await this.getConfiguracaoById(id);
    if (configuracao && (configuracao?.login == login)) {
      return bcrypt.compare(senha, configuracao.senha);
    }else if(configuracao && (configuracao?.loginsagaz == login)) {
      return bcrypt.compare(senha, configuracao.senhasagaz);
    }else{   
    return false;
    }
  }  

  async configuracaoInicial(): Promise<string>{
    const configuracaoExiste = await this.getConfiguracaoById(1);
    if(!configuracaoExiste){
      const msgRetorno = await this.salvaConfiguracao(1, 'admin', '123456','','adminsagaz','sagazdevs2024','');      
      return msgRetorno;
    }

    return null;
  }

  async deleteConfiguracao(id: number) {
    return await this.configuracao.delete(id);
  }

  async resetDatabase() {
    // Fechar todas as conexões existentes
    this.close();

    // Excluir o banco de dados
    await Dexie.delete('GoodsoftDB');

    // Redefinir o banco de dados com o novo esquema
    this.initDatabase();

    // Abrir o banco de dados com o novo esquema
    await this.open();
    console.log('Banco de dados redefinido com sucesso.');
  }  
  //#endregion
}
