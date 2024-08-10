// src/app/pages/cadcombustivel/cadcombustivel.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CombustivelService } from '../../../services/combustivel/combustivel.service';
import { Combustivel } from '../../../services/database.service';
import { CombustivelDataService } from '../../../services/combustivel-data/combustivel-data.service';
import { AlertController } from '@ionic/angular';
import { BombaService } from '../../../services/bomba/bomba.service';
import { UtilService } from '../../../services/util/util.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Produto } from 'src/app/shared/models/produto.model';
import { ProdutoService } from 'src/app/core/services/produto.service';
import { sincronizarProdutoSingleRequest } from '../../../shared/models/sincronizarProdutoSingle.request.model';

@Component({
  selector: 'app-cadcombustivel',
  templateUrl: './cadcombustivel.page.html',
  styleUrls: ['./cadcombustivel.page.scss']
})
export class CadcombustivelPage implements OnInit {
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

  combustiveisDiferentes: boolean;
  erroMsgApi: string;

  tiposproduto: string[] = ['ETANOL',
  'ETANOL_ADITIVADO',
  'GASOLINA',
  'GASOLINA_ADITIVADA',
  'DIESEL',
  'DIESEL_S500_ADITIVADO',
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
    private produtoService: ProdutoService,
  ) {}

  ngOnInit() {
    this.loadCombustivel();
  }

  loadCombustivel() {
    const combustivel = this.combustivelDataService.getCombustivel();
    if (combustivel) {
      this.newCombustivel = combustivel;
    }
  }

  async saveCombustivel() {
    // Validação de campos obrigatórios
    if (
      !this.newCombustivel.nome ||
      !this.newCombustivel.idbicos ||
      !this.newCombustivel.idbombas ||
      !this.newCombustivel.preco ||
      !this.newCombustivel.tipoproduto
    ) {
      await this.utilService.showAlert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    // Validação de idbicos e idbombas para aceitar apenas números e vírgulas, e remover vírgulas no início ou no fim
    this.newCombustivel.idbicos = this.newCombustivel.idbicos.replace(/(^,)|(,$)/g, '');
    this.newCombustivel.idbombas = this.newCombustivel.idbombas.replace(/(^,)|(,$)/g, '');

    const idbicosRegex = /^(\d+)(,\d+)*$/;
    const idbombasRegex = /^(\d+)(,\d+)*$/;
    const precoRegex = /^\d+([.,]\d{1,2})?$/;

    // Validação Bico
    if (!idbicosRegex.test(this.newCombustivel.idbicos)) {
      await this.utilService.showAlert('Erro', 'O campo Bicos deve conter apenas números e vírgulas.');
      return;
    }

    // Validação campo Bomba
    if (!idbombasRegex.test(this.newCombustivel.idbombas)) {
      await this.utilService.showAlert('Erro', 'O campo Bombas deve conter apenas números e vírgulas.');
      return;
    }

    // Validação preço
    if (!precoRegex.test(this.newCombustivel.preco.toString())) {
      await this.utilService.showAlert('Erro', 'O campo Preço deve conter apenas números e ponto, com no máximo 2 casas decimais.');
      return;
    }

    //Restringe atualizar Código do combustível
    const combustivelCarregado = this.combustivelDataService.getCombustivel();
    if (combustivelCarregado?.id != undefined && combustivelCarregado?.id != this.newCombustivel.id) {
      await this.utilService.showAlert('Erro', 'Não é permitido atualizar o código do combustível.');
      return;
    }

    //Valida Combustivel duplicado
    const combustivelJaExiste = await this.combustivelService.getCombustivelById(this.newCombustivel.id);
    if (combustivelJaExiste && combustivelCarregado?.id > 0) {
      await this.utilService.showAlert('Erro', `O combustível ${combustivelJaExiste.id} já foi cadastrado.`);
      return;
    }

    // Verificar se a bomba informada existe e se o bico informado existe, vinculado a uma bomba
    if (!(await this.validaSeBombasEBicosExistem())) {
      return;
    }

    // Verificação de duplicidade de bicos
    const combustivelBicoJaCadastrado = await this.bicoJaExisteNoCombustivel();
    this.combustiveisDiferentes = false;

    if (combustivelBicoJaCadastrado != undefined) {
      this.combustiveisDiferentes = combustivelBicoJaCadastrado.id != this.newCombustivel.id; //Verifica não está localizando ele mesmo
    }

    if (combustivelBicoJaCadastrado && this.combustiveisDiferentes) {
      const bicoDuplicado = await this.retornaBicoDuplicado(combustivelBicoJaCadastrado);
      await this.utilService.showAlert(
        'Erro',
        `O bico ${bicoDuplicado} já está cadastrado no combustível: ${combustivelBicoJaCadastrado.id} - ${combustivelBicoJaCadastrado.nome}.`
      );
      return;
    }

    //Se o usuário estiva atualizando o número de ID do combustível e deleta antes de adicionar.
    if (combustivelBicoJaCadastrado) {
      console.log(`Combustível deletado: ${combustivelBicoJaCadastrado.id}`);
      this.combustivelService.deleteCombustivel(combustivelBicoJaCadastrado.id);
    }

    let message = '';
    if (this.newCombustivel.id != 0 && combustivelJaExiste == undefined) {
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
      message = `Combustível ${id} - ${this.newCombustivel.nome} adicionado com sucesso!`;
    } else {
      await this.combustivelService.updateCombustivel(
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
      message = `Combustível ${this.newCombustivel.id} - ${this.newCombustivel.nome} atualizado com sucesso!`;
    }

    await this.sincronizarCombustivel();

    // Exibir alerta de sucesso
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Redirecionar para a página combustivel após clicar em OK
            this.router.navigate(['/combustivel']);
          }
        }
      ]
    });

    await alert.present();
  }

  async retornaBicoDuplicado(combustivel: Combustivel): Promise<string> {
    const bicosUsuario = this.newCombustivel.idbicos.split(',').map((bico) => bico.trim());
    const combustivelBicosArray = combustivel.idbicos.split(',').map((bico) => bico.trim());

    for (const bico of bicosUsuario) {
      if (combustivelBicosArray.includes(bico)) {
        return bico;
      }
    }

    return '';
  }

  async bicoJaExisteNoCombustivel(): Promise<Combustivel | null> {
    const bicosUsuario = this.newCombustivel.idbicos.split(',').map((bico) => bico.trim());
    const combustiveis = await this.combustivelService.getAllCombustiveis();

    for (const combustivel of combustiveis) {
      const combustivelBicosArray = combustivel.idbicos.split(',').map((bico) => bico.trim());
      for (const userBico of bicosUsuario) {
        if (combustivelBicosArray.includes(userBico) && this.newCombustivel.id != combustivel.id) {
          return combustivel;
        }
      }
    }

    return null;
  }

  voltarPagina() {
    this.router.navigate(['/combustivel']);
  }

  async validaSeBombasEBicosExistem(): Promise<boolean> {
    const bombas = await this.bombaService.getAllBombas();
    const bombasInput = this.newCombustivel.idbombas.split(',').map(Number);
    const bicosInput = this.newCombustivel.idbicos.split(',').map(Number);

    // Validação de Bombas
    for (const bombaInput of bombasInput) {
      let bombaExiste = false;
      for (const bomba of bombas) {
        if (Number(bomba.idbomba) === bombaInput) {
          bombaExiste = true;
          break;
        }
      }
      if (!bombaExiste) {
        await this.utilService.showAlert('Erro de Validação', `A bomba ${bombaInput} não existe.`);
        return false;
      }
    }

    // Validação de Bicos
    const bicosArray: number[] = [];
    bombas.forEach(bomba => {
      bomba.idbicos.split(',').map(Number).forEach(bico => {
        if (!bicosArray.includes(bico)) {
          bicosArray.push(bico);
        }
      });
    });

    for (const bicoInput of bicosInput) {
      if (!bicosArray.includes(bicoInput)) {
        await this.utilService.showAlert('Erro de Validação', `O bico ${bicoInput} não está vinculado a nenhuma bomba.`);
        return false;
      }
    }

    return true;
  }

  async retornaStatusString(status:boolean): Promise<string>{
    if (status){
      return 'ATIVO';
    }else{
      return 'INATIVO';
    }
  }
  
  async sincronizarCombustivel(){
    const statusString = await this.retornaStatusString(this.newCombustivel.status);

    const corpo: sincronizarProdutoSingleRequest = {
      codigoProduto: this.newCombustivel.id.toString(),
      Descricao: this.newCombustivel.nome,
      tipoProduto: this.newCombustivel.tipoproduto,
      status: statusString,
      preco: this.utilService.verificarEConverterPreco(this.newCombustivel.preco),
      ehCombustivel: this.newCombustivel.ehcombustivel,
      ncm : this.newCombustivel.ncm.toString(),
      anp: this.newCombustivel.anp.toString(),
      codigoBarras: this.newCombustivel.codigobarras.toString(),
    }; 

    try {
      const cupom = await this.produtoService.sincronizarProdutoSingle(corpo);
      
      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode = 200){
        return true;
      }else{
        await this.utilService.showAlert('Erro', `Não foi possível sincronizar o combustível: ${cupom.errmsg}`);
        return false;
      }   
    } catch (error) {
      console.error('Erro ao sincronizar combustível:', error);

      // Extraia a mensagem de erro correta do objeto error
      let errorMsg = 'Erro desconhecido';
      if (error instanceof HttpErrorResponse) {
        if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
          errorMsg = error.error.errmsg;
        } else if (error.message) {
          errorMsg = error.message;
        }
      }

      await this.utilService.showAlert('Erro', `Não foi possível sincronizar o combustível: ${errorMsg}`);
      return false;
    }
  }
}
