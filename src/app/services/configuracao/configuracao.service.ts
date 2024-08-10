// src\app\services\configuracao\configuracao.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, Configuracao } from '../database.service';
import { UtilService } from '../util/util.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {
  
  constructor(
    private dbService: DatabaseService,
    private utilService: UtilService,    
  ) {}

  async salvaConfiguracao(id: number, login: string, senha: string, urlapi: string, loginsagaz: string, senhasagaz: string, diretoriojson: string){
    return await this.dbService.salvaConfiguracao(id, login, senha, urlapi, loginsagaz, senhasagaz, diretoriojson); 
  }

  async atualizaConfiguracaoParcial(id: number, urlapi: string, diretoriojson: string){
    return await this.dbService.atualizaConfiguracaoParcial(id, urlapi, diretoriojson); 
  }

  async getConfiguracaoById(id: number): Promise<Configuracao | undefined> {
    return await this.dbService.getConfiguracaoById(id);
  }

  async getConfiguracaoUrlApi(): Promise<string>{
    return await this.dbService.getConfiguracaoUrlApi();
  }

  async autenticar(id: number, login: string, senha: string): Promise<boolean> {
    return await this.dbService.autenticar(id, login, senha);
  }

  async configuracaoInicial(){
    return await this.dbService.configuracaoInicial();
  }

  async deleteConfiguracao(id: number){
    return await this.dbService.deleteConfiguracao(id);
  }

  async resetDatabase(){
    this.dbService.resetDatabase()
    .then(async () => {
      await this.utilService.showAlert('Sucesso','Banco de dados redefinido com sucesso.');
    })
    .catch(async (err) => {
      await this.utilService.showAlert('Erro',`Erro ao redefinir o banco de dados: ${err}`);
    });  
  }

  async estaComInternet(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  // async exportDatabase() {
  //   try {
  //     await this.dbUtilsService.exportDatabaseToJSON(this.dbService);
  //     await this.utilService.showAlert('Sucesso', 'Banco de dados exportado com sucesso.');
  //   } catch (error) {
  //     await this.utilService.showAlert('Erro', 'Erro ao exportar o banco de dados.');
  //     console.error('Erro ao exportar o banco de dados:', error);
  //   }
  // }

  // async importDatabase(file: File) {
  //   try {
  //     await this.dbUtilsService.importDatabaseFromJSON(file, this.dbService);
  //     await this.configuracaoInicial();
  //     await this.utilService.showAlert('Sucesso', 'Banco de dados importado com sucesso.');
  //   } catch (error) {
  //     await this.utilService.showAlert('Erro', 'Erro ao importar o banco de dados.');
  //     console.error('Erro ao importar o banco de dados:', error);
  //   }
  // }
}
