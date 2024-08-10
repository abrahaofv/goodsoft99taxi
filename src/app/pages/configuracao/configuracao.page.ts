// src\app\pages\configuracao\configuracao.page.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Configuracao } from '../../services/database.service';
import { ConfiguracaoService } from '../../services/configuracao/configuracao.service';
import { UtilService } from '../../services/util/util.service';
import { Router } from '@angular/router';
import { DatabaseToJSONService } from 'src/app/services/DatabaseToJSON/database-to-json.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.page.html',
  styleUrls: ['./configuracao.page.scss'],
})
export class ConfiguracaoPage implements OnInit {
  newConfiguracao: Configuracao = {id: 1, login: '', senha: '', urlapi: '', loginsagaz: '', senhasagaz: '', diretoriojson: ''}

  id: number = 1;
  username: string;
  password: string;
  passwordConfirm: string;
  passwordType: string = 'password';
  passwordTypeNew: string = 'password';
  passwordTypeConfirm: string = 'password';
  isAuthenticated: boolean = false;

  importDB: boolean = false;
  importBombas: boolean = false;
  importCombustiveis: boolean = false;

  constructor(
    private alertController: AlertController,
    private configuracaoService: ConfiguracaoService,
    private utilService: UtilService,
    private router: Router,
    private databaseToJSONService: DatabaseToJSONService
  ) {}

  ngOnInit() {
    // Verificar se o usuário já está autenticado
    const isAuth = localStorage.getItem('isAuthenticated');
    if (isAuth && isAuth === 'true') {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
    
    // Inicializa configuração
    this.realizaConfiguracaoInicial();
  }

  ionViewWillLeave() {
    this.logout();
  }

  ngOnDestroy() {
    
  }

  async loadConfiguracoes(){
    const configuracao = await this.configuracaoService.getConfiguracaoById(1);
    if (configuracao){
      this.newConfiguracao = configuracao;
    }
  }

  async realizaConfiguracaoInicial(){
    const msgRetorno = await  this.configuracaoService.configuracaoInicial();
    if(msgRetorno){
      await this.utilService.showAlert('Configuração', msgRetorno);
      this.loadConfiguracoes();
    }
  }

  async login() {
    //Código secreto para retornar configuracao inicial  
    if (this.username == 'goodsoft' && this.password == 'G2024soft'){
      this.configuracaoService.deleteConfiguracao(1);
      this.username = '';
      this.password = '';
      this.realizaConfiguracaoInicial();
      return;
    }    

    const isAuthenticated = await this.configuracaoService.autenticar(this.id, this.username, this.password);
    if (isAuthenticated) {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
      this.username = '';
      this.password = '';
      this.passwordConfirm = '';
      this.loadConfiguracoes();
    } else {
      await this.utilService.showAlert('Erro', 'Login ou senha incorretos.');
    }
  }

  async atualizarSenha(){
    if (this.passwordConfirm != this.password){
      await this.utilService.showAlert('Erro', 'As senhas informadas não batem.');
      return;
    }

    this.newConfiguracao.senha = this.password;

    this.salvarConfiguracao().then(async () => {
      await this.utilService.showAlert('Sucesso', 'Senha atualizada com sucesso.');
      this.logout();
    }).catch(async error => {
      await this.utilService.showAlert('Erro', 'Falha ao atualizar senha. Tente novamente mais tarde.');
      console.error('Erro ao salvar senha:', error);
      this.logout();
    });
  }

  async atualizarConfiguracoes(){
    this.atualizaConfiguracaoParcial().then(async () => {
      await this.utilService.showAlert('Sucesso', 'Configuração atualizada com sucesso.');
      this.logout();
    }).catch(async error => {
      await this.utilService.showAlert('Erro', 'Falha ao atualizar configurações. Tente novamente mais tarde.');
      console.error('Erro ao salvar configuração:', error);
      this.logout();
    });
  }

  async salvarConfiguracao(){
     return await this.configuracaoService.salvaConfiguracao(
      this.newConfiguracao.id,
      this.newConfiguracao.login,
      this.newConfiguracao.senha,
      this.newConfiguracao.urlapi,
      this.newConfiguracao.loginsagaz,
      this.newConfiguracao.senhasagaz,
      this.newConfiguracao.diretoriojson
    );
  }

  async atualizaConfiguracaoParcial(){
    return await this.configuracaoService.atualizaConfiguracaoParcial(
      this.newConfiguracao.id,
      this.newConfiguracao.urlapi,
      this.newConfiguracao.diretoriojson
    );
  }

  togglePassword(field: string) {
    if (field === 'new') {
      this.passwordTypeNew = this.passwordTypeNew === 'password' ? 'text' : 'password';
    } else if (field === 'confirm') {
      this.passwordTypeConfirm = this.passwordTypeConfirm === 'password' ? 'text' : 'password';
    } else if (field === 'loginpassword') {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }
  }

  async resetDatabase(){
    const alert = await this.alertController.create({
      header: 'Confirmar Reset',
      message: 'Deseja realmente resetar o Banco de Dados? Isso irá apagar todas as informações de descontos, bombas, combustíveis e configurações.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Reset cancelado');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.configuracaoService.resetDatabase();
            this.logout();            
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated = false;
    window.location.reload();
    this.router.navigate(['/configuracao']);
  }

  async exportDatabase(){
    try {
      const arquivoGerado = await this.databaseToJSONService.exportDatabaseToJSON();

      if (!arquivoGerado){
        await this.utilService.showAlert(`Erro`,`Erro ao exportar Banco de Dados.`);  
        return;
      }

      await this.utilService.showAlert(`Sucesso`,`Banco de Dados exportado com sucesso.`);  
    } catch (error) {
      await this.utilService.showAlert(`Erro`,`Erro ao exportar Banco de Dados: ${error}.`);  
    }   
  }

  async importDatabase(){
    try{      
      await this.perguntaImportarDB();

      if (!this.importDB){
        return;
      } 
      
      //Primeiro, chama a api para retornar o arquivo json
      const jsonData = await this.databaseToJSONService.retornaJSON();

      console.log('Início importação do Banco de Dados');
       
      const DBImportado = await this.databaseToJSONService.importDatabaseFromJSON(jsonData, this.importCombustiveis, this.importBombas);

      if(DBImportado){
        this.utilService.showAlert('Sucesso','Importação do Bando de Dados realizada com sucesso.');
      }
    } catch (error) {
      this.utilService.showAlert('Erro',`Ocorreu um erro na Importação do Bando de Dados: ${error}`);        
    }
  }

  async perguntaImportarDB(): Promise<void> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Importar Banco de Dados',
        message: 'Deseja importar o backup do banco de dados (nome - data arquivo)?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            handler: () => {
              this.importDB = false;
              resolve();
            }
          },
          {
            text: 'Sim',
            handler: async () => {
              this.importDB = true;
              this.importBombas = await this.perguntaImportaTabela('Bombas');
              this.importCombustiveis = await this.perguntaImportaTabela('Combustíveis');
              resolve();
            }
          }
        ]
      });

      await alert.present();
    });
  }

  async perguntaImportaTabela(NomeTabela: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const pronome = NomeTabela.includes("Bombas") ? 'as' : 'os';   

      const alert = await this.alertController.create({
        header: `Importar ${NomeTabela}`,
        message: `ATENÇÃO!!! Deseja importar ${pronome} ${NomeTabela}? isto irá apagar tod${pronome} ${NomeTabela} atuais e irá cadastrar ${pronome} ${NomeTabela} da importação.`,
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Sim',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
