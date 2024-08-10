// src/app/pages/combustivel/combustivel.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CombustivelService } from '../../../services/combustivel/combustivel.service';
import { Combustivel } from '../../../services/database.service';
import { CombustivelDataService } from '../../../services/combustivel-data/combustivel-data.service';
import { Router } from '@angular/router';
import { sincronizarProdutoSingleRequest } from 'src/app/shared/models/sincronizarProdutoSingle.request.model';
import { sincronizarProdutoBatchRequest } from 'src/app/shared/models/sincronizarProdutoBatch.request.model';
import { UtilService } from '../../../services/util/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProdutoService } from 'src/app/core/services/produto.service';

@Component({
  selector: 'app-combustivel',
  templateUrl: './combustivel.page.html',
  styleUrls: ['./combustivel.page.scss']
})
export class CombustivelPage implements OnInit {
  combustiveis: Combustivel[] = [];
  newCombustivel: Combustivel = { 
    id: null, 
    nome: '', 
    idbicos: '', 
    idbombas: '', 
    preco: 0.0, 
    tipoproduto: '',
    status: true,
    ehcombustivel: true,
    ncm: '',
    anp: '',
    codigobarras: ''};

  constructor(
    private combustivelService: CombustivelService,
    private alertController: AlertController,
    private combustivelDataService: CombustivelDataService,
    private router: Router,
    private utilService: UtilService,
    private produtoService: ProdutoService,
  ) {}

  ngOnInit() {
    //this.loadCombustiveis();
  }

  ionViewWillEnter() {
    // Este método é chamado sempre que a página está prestes a ser exibida
    // Garante que os combustíveis sejam carregados sempre que o usuário voltar para esta página
    this.loadCombustiveis();
  }

  async loadCombustiveis() {
    this.combustiveis = await this.combustivelService.getAllCombustiveisCombustivel();
    this.combustiveis.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async addCombustivel() {
    if (this.newCombustivel.nome && this.newCombustivel.preco) {
      const id = await this.combustivelService.addCombustivel(
        this.newCombustivel.id,
        this.newCombustivel.nome,
        this.newCombustivel.idbicos,
        this.newCombustivel.idbombas,
        this.newCombustivel.preco,
        this.newCombustivel.tipoproduto, 
        this.newCombustivel.status, 
        this.newCombustivel.ehcombustivel, 
        this.newCombustivel.ncm, 
        this.newCombustivel.anp, 
        this.newCombustivel.codigobarras
      );
      this.newCombustivel.id = id;
      this.newCombustivel = { 
        id: null, 
        nome: '', 
        idbicos: '', 
        idbombas: '', 
        preco: 0.0, 
        tipoproduto: '',
        status: true,
        ehcombustivel: true,
        ncm: '',
        anp: '',
        codigobarras: ''
      };
      this.loadCombustiveis();
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: `Combustível ${id} - ${this.newCombustivel.nome} salvo com sucesso!`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async deleteCombustivel(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Deseja realmente excluir este combustível?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: async () => {
            await this.combustivelService.deleteCombustivel(id);
            this.loadCombustiveis();
          }
        }
      ]
    });
    await alert.present();
  }

  editCombustivel(combustivel: Combustivel) {
    this.combustivelDataService.setCombustivel(combustivel);
    this.router.navigate(['/cadcombustivel']);
  }

  retornaStatusString(status:boolean): string{
    if (status){
      return 'ATIVO';
    }else if(!status){
      return 'INATIVO';
    }else{
      return '';
    }
  }

  async sincronizarTodosCombustiveis(){
    const itensCorpo: sincronizarProdutoSingleRequest[] = []; 

    for (const itemCombustivel of this.combustiveis) {
      const statusString = this.retornaStatusString(itemCombustivel.status);
      
      const itemCorpo: sincronizarProdutoSingleRequest = {
        codigoProduto: itemCombustivel.id.toString(),
        Descricao: itemCombustivel.nome,
        tipoProduto: itemCombustivel.tipoproduto,
        status: statusString,
        preco: this.utilService.verificarEConverterPreco(itemCombustivel.preco),
        ehCombustivel: itemCombustivel.ehcombustivel,
        ncm : itemCombustivel.ncm.toString(),
        anp: itemCombustivel.anp.toString(),
        codigoBarras: itemCombustivel.codigobarras.toString(),
      }; 
      
      itensCorpo.push(itemCorpo);
    }

    const corpo: sincronizarProdutoBatchRequest = {
      listaProdutos: itensCorpo,
    }
    
    console.log(`${JSON.stringify(corpo)}`);

    try {
      const cupom = await this.produtoService.sincronizarProdutoBatch(corpo);
      
      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode = 200){
        await this.utilService.showAlert('Sucesso', `Todos os combustíveis foram sincronizados.`);
        return true;
      }else{
        await this.utilService.showAlert('Erro', `Não foi possível sincronizar os combustíveis: ${cupom.errmsg}`);
        return false;
      }   
    } catch (error) {
      console.error('Erro ao sincronizar os combustíveis:', error);

      // Extraia a mensagem de erro correta do objeto error
      let errorMsg = 'Erro desconhecido';
      if (error instanceof HttpErrorResponse) {
        if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
          errorMsg = error.error.errmsg;
        } else if (error.message) {
          errorMsg = error.message;
        }
      }

      await this.utilService.showAlert('Erro', `Não foi possível sincronizar os combustíveis: ${errorMsg}`);
      return false;
    }
  }  
}
