// src\app\pages\cadastro\cadproduto\cadproduto.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CombustivelService } from '../../../services/combustivel/combustivel.service';
import { Combustivel } from '../../../services/database.service';
import { CombustivelDataService } from '../../../services/combustivel-data/combustivel-data.service';
import { AlertController } from '@ionic/angular';
import { BombaService } from '../../../services/bomba/bomba.service';
import { UtilService } from '../../../services/util/util.service';

import { Produto } from 'src/app/shared/models/produto.model';
import { ProdutoService } from 'src/app/core/services/produto.service';
import { sincronizarProdutoSingleRequest } from '../../../shared/models/sincronizarProdutoSingle.request.model';

@Component({
  selector: 'app-cadproduto',
  templateUrl: './cadproduto.page.html',
  styleUrls: ['./cadproduto.page.scss'],
})
export class CadprodutoPage implements OnInit {

  newProduto: Combustivel = { 
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
  produtosDiferentes: boolean;
  erroMsgApi: string;

  tiposproduto: string[] = ['ETANOL',
  'ETANOL_ADITIVADO',
  'GASOLINA',
  'GASOLINA_ADITIVADA',
  'DIESEL,DIESEL_S500_ADITIVADO',
  'DIESEL_ADITIVADO',
  'DIESEL_S10_ADITIVADO',
  'GASOLINA_PODIUM',
  'GASOLINA_PREMIUM',
  'GNV',
  'ARLA32',
  'QUEROSENE',
  'GASOLINA_TROCA_OLEO',
  'PONTUACAO',
  'OUTRO'];

  constructor(
    private combustivelService: CombustivelService,
    private route: ActivatedRoute,
    private combustivelDataService: CombustivelDataService,
    private alertController: AlertController,
    private router: Router,
    private bombaService: BombaService,
    private utilService: UtilService,
    private produtoService: ProdutoService
  ) {}

  ngOnInit() {
    this.loadProduto();
  }

  loadProduto() {
    const produto = this.combustivelDataService.getCombustivel();
    if (produto) {
      this.newProduto = produto;
    }
  }

  async saveProduto() {
    // Validação de campos obrigatórios
    if (
      !this.newProduto.id ||
      !this.newProduto.nome ||
      !this.newProduto.preco ||
      !this.newProduto.tipoproduto
    ) {
      await this.utilService.showAlert('Erro', 'Os campos (Id, nome, preço, tipo produto) são obrigatórios.');
      return;
    }

    const precoRegex = /^\d+([.,]\d{1,2})?$/;

    // Validação preço
    if (!precoRegex.test(this.newProduto.preco.toString())) {
      await this.utilService.showAlert('Erro', 'O campo Preço deve conter apenas números e ponto, com no máximo 4 casas decimais.');
      return;
    }

    //Restringe atualizar Código do produto
    const produtoCarregado = this.combustivelDataService.getCombustivel();
    if (produtoCarregado?.id != undefined && produtoCarregado?.id != this.newProduto.id) {
      await this.utilService.showAlert('Erro', 'Não é permitido atualizar o código do produto.');
      return;
    }

    //Valida Produto duplicado
    const produtoJaExiste = await this.combustivelService.getCombustivelById(this.newProduto.id);
    if (produtoJaExiste && produtoCarregado?.id > 0) {
      await this.utilService.showAlert('Erro', `O produto ${produtoJaExiste.id} já foi cadastrado.`);
      return;
    }

    let message = '';
    if (this.newProduto.id != 0 && produtoJaExiste == undefined) {
      const id = await this.combustivelService.addCombustivel(
        this.newProduto.id,
        this.newProduto.nome,
        this.newProduto.idbicos,
        this.newProduto.idbombas,
        this.newProduto.preco,
        this.newProduto.tipoproduto, 
        this.newProduto.status, 
        this.newProduto.ehcombustivel, 
        this.newProduto.ncm, 
        this.newProduto.anp, 
        this.newProduto.codigobarras
        );
      this.newProduto.id = id;
      message = `Produto ${id} - ${this.newProduto.nome} adicionado com sucesso!`;
    } else {
      await this.combustivelService.updateCombustivel(
        this.newProduto.id,
        this.newProduto.nome,
        this.newProduto.idbicos,
        this.newProduto.idbombas,
        this.newProduto.preco,
        this.newProduto.tipoproduto, 
        this.newProduto.status, 
        this.newProduto.ehcombustivel, 
        this.newProduto.ncm, 
        this.newProduto.anp, 
        this.newProduto.codigobarras
        );
      message = `Produto ${this.newProduto.id} - ${this.newProduto.nome} atualizado com sucesso!`;
    }

    await this.sincronizarProduto();

    // Exibir alerta de sucesso
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Redirecionar para a página combustivel após clicar em OK
            this.router.navigate(['/produto']);
          }
        }
      ]
    });

    await alert.present();
  }

  voltarPagina() {
    this.router.navigate(['/produto']);
  }

  async sincronizarProduto(){
    const statusString = await this.retornaStatusString(this.newProduto.status);

    const corpo: sincronizarProdutoSingleRequest = {
      codigoProduto: this.newProduto.id.toString(),
      Descricao: this.newProduto.nome,
      tipoProduto: this.newProduto.tipoproduto,
      status: statusString,
      preco: this.utilService.verificarEConverterPreco(this.newProduto.preco),
      ehCombustivel: this.newProduto.ehcombustivel,
      ncm : this.newProduto.ncm,
      anp: this.newProduto.anp,
      codigoBarras: this.newProduto.codigobarras,
    }; 

    try {
      const cupom = await this.produtoService.sincronizarProdutoSingle(corpo);
      
      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode = 200){        
        return true;
      }else{
        await this.utilService.showAlert('Erro', `Não foi possível cancelar o desconto: ${cupom.errmsg}`);
        return false;
      }   
    } catch (error) {
      console.error('Erro ao sincronizar combustível:', error);
      await this.utilService.showAlert('Erro', `Não foi possível sincronizar o combustível: ${error}`);
      return false;
    }
  }

  async retornaStatusString(status:boolean): Promise<string>{
    if (status){
      return 'ATIVO';
    }else{
      return 'INATIVO';
    }
  }
}
