// src\app\pages\cadastro\caddesconto\caddesconto.page.ts

import { Component, OnInit, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DescontoService } from '../../../services/desconto/desconto.service';
import { DescontoDataService } from '../../../services/desconto-data/desconto-data.service';
import { Desconto, DescontosCombustiveis, DescontoTiposPagamento } from '../../../services/database.service';
import { UtilService } from '../../../services/util/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { sincronizarProdutoSingleRequest } from '../../../shared/models/sincronizarProdutoSingle.request.model';

import { Observable } from 'rxjs';

import { confirmarPedidoRequest, ConfirmarPedidoRequestPagamento } from 'src/app/shared/models/confirmarPedido.request.model';
import { Pedido } from 'src/app/shared/models/pedido.model';
import { PedidoService } from 'src/app/core/services/pedido.service';
import { ProdutoService } from 'src/app/core/services/produto.service';

import { CupomDescontoRequest, CupomDescontoRequestProduto } from 'src/app/shared/models/cupomdesconto.request.model';
import { CupomDesconto } from 'src/app/shared/models/cupomdesconto.model';
import { CupomDescontoService } from 'src/app/core/services/cupom-desconto.service';
import { CombustivelService } from 'src/app/services/combustivel/combustivel.service';

import { cancelarPedidoRequest } from 'src/app/shared/models/cancelarPedido.request.model';

import {GerarDadosRetornoIntegracaoRequest, GerarDadosRetornoIntegracaoDescontoCombustivelRequest, GerarDadosRetornoIntegracaoPagamentoPedidoRequest} from '../../../shared/models/gerarDadosRetornoIntegracaoRequest';
import { GerarDadosRetornoIntegracaoService } from 'src/app/core/services/gerar-dados-retorno-integracao.service';

@Component({
  selector: 'app-caddesconto',
  templateUrl: './caddesconto.page.html',
  styleUrls: ['./caddesconto.page.scss']
})
export class CaddescontoPage implements OnInit, OnDestroy, AfterViewInit {
  desconto: Desconto = {
    totalpreco: 0,
    totaldesconto: 0,
    datahora: new Date(),
    numerorecibo: null,
    idpedidodidiglobal: '',
    codigodesconto: '',
    confirmado: false,
    totaldescontorecebido: 0,
    cancelado: false,
    nomeatendente: '',
  };
  
  descontosTiposPagamento: DescontoTiposPagamento[] = [];
  descontosCombustiveis: DescontosCombustiveis[] = [];
  
  pagamentos: string[] = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Carteiras digitais', 'Cheque'];
  isNovoDesconto: boolean = true;
  isNovoDescontoCombustivel: boolean = true;
  isNovoDescontoTiposPagamento: boolean = true;
  isValid: boolean = false;

  SomaTotalDescontoRecebido: number;
  
  responseDesconto: CupomDesconto;
  erroMsgApi: string;

  @ViewChildren('btDeletarProduto') btDeletarProdutos: QueryList<HTMLIonButtonElement>;
  @ViewChildren('btEditarProduto') btEditarProdutos: QueryList<HTMLIonButtonElement>;

  constructor(
    private descontoService: DescontoService,
    private descontoDataService: DescontoDataService,
    private alertController: AlertController,
    private cupomDescontoService: CupomDescontoService,
    private pedidoService: PedidoService,
    private produtoService: ProdutoService,
    private router: Router,
    private utilService: UtilService,
    private gerarDadosRetornoIntegracaoService: GerarDadosRetornoIntegracaoService,
    private combustivelService : CombustivelService,
  ) {}

  ngOnInit() {
    this.loadDesconto();
    this.desabilitaValidarDesconto(false);
    this.desabilitaAdicionarProduto(false);
    this.desabilitaCancelarDesconto(true);
    this.desabilitaGerarDesconto(true);
    this.desabilitaAdicionarPagamento(true);
    //this.desabilitaEditarDeletarProduto(true);
  }

  ngAfterViewInit() {
    this.desabilitaEditarDeletarProduto(true);
  }

  ionViewWillEnter() {
    this.loadDesconto();
    this.updateTotals();
  }

  ionViewWillLeave() {
    this.descontoDataService.setDesconto(this.desconto);
  }

  ngOnDestroy() {
    this.descontoDataService.setDesconto(this.desconto);
  }

  async loadDesconto() {
    const desconto = this.descontoDataService.getDesconto();
    if (desconto) {
      this.desconto = desconto;
      this.isNovoDesconto = !this.desconto.id;  // Se o ID está presente, não é um novo desconto
      this.isNovoDescontoCombustivel = this.isNovoDesconto;      
    } else {
      this.isNovoDesconto = true;  // Se não há desconto carregado, é um novo desconto
      this.isNovoDescontoCombustivel = true;
      this.desconto.nomeatendente = this.getNomeAtendenteFromLocalStorage();
    }
    this.descontosCombustiveis = this.descontoDataService.getDescontosCombustiveis();
    this.descontosTiposPagamento = this.descontoDataService.getDescontoTiposPagamento();
    this.isNovoDescontoTiposPagamento = this.descontosTiposPagamento.length <= 0;
    this.updateTotals();
  }

  getNomeAtendenteFromLocalStorage(): string {
    return localStorage.getItem('nomeatendente') || '';
  }

  saveNomeAtendenteToLocalStorage(nomeatendente: string) {
    localStorage.setItem('nomeatendente', nomeatendente);
  }

  async addDescontosCombustiveis() {
    this.descontoDataService.clearCurrentDescontoCombustivel();
    this.router.navigate(['/caddescontoscombustiveis']);
  }

  async editDescontosCombustiveis(index: number) {
    const descontosCombustiveis = this.descontosCombustiveis[index];
    this.descontoDataService.setCurrentDescontoCombustivel(descontosCombustiveis, index);
    this.router.navigate(['/caddescontoscombustiveis']);
  }

  async deleteDescontosCombustiveis(index: number) {
    this.descontosCombustiveis.splice(index, 1);
    this.updateTotals();
  }

  updateTotals() {
    this.desconto.totalpreco = parseFloat(this.descontosCombustiveis
      .reduce((sum, item) => sum + item.totalprecocombustivel, 0)
      .toFixed(2));
    this.desconto.totaldesconto = parseFloat(this.descontosCombustiveis
      .reduce((sum, item) => sum + item.totaldescontocombustivel, 0)
      .toFixed(2));
      this.desconto.totaldescontorecebido = parseFloat(this.descontosCombustiveis
        .reduce((sum, item) => sum + item.totaldescontorecebidocombustivel, 0)
        .toFixed(2));
  }

  // Valida Desconto
  async validarDesconto(): Promise<boolean> {
    if (!this.desconto.codigodesconto) {
      await this.utilService.showAlert('Erro', 'Código do Desconto obrigatório.');
      return false;
    }

    //if (this.descontosTiposPagamento.length <= 0) {
    //  await this.utilService.showAlert('Erro', 'Informe pelo menos uma forma de pagamento.');
    //  return false;
    //}

    if (this.descontosCombustiveis.length === 0) {
      await this.utilService.showAlert('Erro', 'Adicione pelo menos um item ao desconto.');
      return false;
    }

    const retornoApivalidarDesconto = await this.validaDescontoAPI();
    if (!retornoApivalidarDesconto){
      return false;
    }

    this.desabilitaAdicionarProduto(true);
    this.desabilitaValidarDesconto(true);
    this.desabilitaGerarDesconto(false);
    this.desabilitaAdicionarPagamento(false);
    this.desabilitaEditarDeletarProduto(true);

    if (this.isNovoDesconto){
      await this.sincronizarCombustivel();
    }  

    await this.saveDesconto(false); 

    await this.utilService.showAlert('Sucesso', `Desconto validado com sucesso.`);

    return true;
  }

  async sincronizarCombustivel(){
    const statusString = 'ATIVO';

    for (const item of this.descontosCombustiveis) {
      const produto = await this.combustivelService.getCombustivelById(item.idcombustivel);

      const corpo: sincronizarProdutoSingleRequest = {
        codigoProduto: produto.id.toString(),
        Descricao: produto.nome,
        tipoProduto: produto.tipoproduto,
        status: statusString,
        preco: this.utilService.verificarEConverterPreco(produto.preco),
        ehCombustivel: produto.ehcombustivel,
        ncm : produto.ncm.toString(),
        anp: produto.anp.toString(),
        codigoBarras: produto.codigobarras.toString(),
      };
      
      try {
        const cupom = await this.produtoService.sincronizarProdutoSingle(corpo);
        
        console.log(`${JSON.stringify(corpo)}`);
        console.log(`TraceID sincronizarCombustivel: ${cupom.trace_Id}`);
        console.log(`statusCode: ${cupom.statusCode}`);
  
        if (cupom.statusCode != 200){
          await this.utilService.showAlert('Erro', `Não foi possível sincronizar o combustível: ${cupom.errmsg}`);
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
      }
    }    
  }

  // Valida Pagamentos
  async validaPagamentos(): Promise<boolean>{
    console.log(`Entrou validaPagamentos`);

    const totalValorPago = this.descontosTiposPagamento
      .reduce((sum, pagamento) => sum + pagamento.valorpago, 0);
  
    if (totalValorPago !== this.desconto.totaldesconto) {
      const mensagemErro = totalValorPago < this.desconto.totaldesconto 
        ? `O valor total pago(${totalValorPago}) é menor que o total do desconto(${this.desconto.totaldesconto}).`
        : `O valor total pago(${totalValorPago}) é maior que o total do desconto(${this.desconto.totaldesconto}).`;
      await await this.utilService.showAlert('Erro', mensagemErro);
      return false;
    }
  
    return true;
  }

  // Confirma Desconto
  async saveDesconto(confirmado: boolean = true){

    console.log(`saveDesconto - idpedidodidiglobal: ${this.desconto.idpedidodidiglobal}`);
    console.log(`saveDesconto - numerorecibo: ${this.desconto.numerorecibo}`);
    console.log(`saveDesconto - cancelado: ${this.desconto.cancelado}`);

    if (!this.desconto.numerorecibo && !this.isNovoDesconto) {
      await this.utilService.showAlert('Erro', 'Obrigatório informar o recibo para geração do desconto.');
      return;
    }

    this.desconto.datahora = new Date();
    this.saveNomeAtendenteToLocalStorage(this.desconto.nomeatendente);
    this.updateTotals();

    if (confirmado && this.desconto.idpedidodidiglobal && this.desconto.numerorecibo && !this.desconto.cancelado){
      const pagamentoValidado = await this.validaPagamentos();
      if (!pagamentoValidado){
        return;
      }
           
      const retornoApiConfirmaDesconto = await this.ConfirmaDescontoAPI();
      if (!retornoApiConfirmaDesconto){
        return;
      } else {
        //Salva tipo pagamento
        if (this.descontosTiposPagamento.length > 0){
          for (const item of this.descontosTiposPagamento) {
            item.iddesconto = this.desconto.id!;
            if (this.isNovoDescontoTiposPagamento) {
              item.id = await this.descontoService.addDescontoTiposPagamento(item);
            } else {
              item.id = await this.descontoService.updateDescontoTiposPagamento(item);
            }
          }
    
          if (this.isNovoDescontoTiposPagamento){
            this.isNovoDescontoTiposPagamento = false;
          }
        }

        //Envia arquivo de retorno
        if (retornoApiConfirmaDesconto){
          const retornoGeraDados = await this.gerarDadosRetornoIntegracao();
          if(!retornoGeraDados){
            return;
          }
        }   
      }
    }        

    console.log(`saveDesconto - confirmado: ${this.desconto.confirmado}`);
    
    let idDesconto;
    if (this.isNovoDesconto) {
      idDesconto = await this.descontoService.addDesconto(
        this.desconto.totalpreco,
        this.desconto.totaldesconto,
        this.desconto.datahora,
        this.desconto.numerorecibo,
        this.desconto.idpedidodidiglobal,
        this.desconto.codigodesconto,
        this.desconto.confirmado,
        this.desconto.totaldescontorecebido,
        this.desconto.cancelado,
        this.desconto.nomeatendente
      );
      this.desconto.id = idDesconto;
      this.isNovoDesconto = false;
    } else {
      idDesconto = this.desconto.id!;
      await this.descontoService.updateDesconto(
        this.desconto.id,
        this.desconto.totalpreco,
        this.desconto.totaldesconto,
        this.desconto.datahora,
        this.desconto.numerorecibo,
        this.desconto.idpedidodidiglobal,
        this.desconto.codigodesconto,
        this.desconto.confirmado,
        this.desconto.totaldescontorecebido,
        this.desconto.cancelado,
        this.desconto.nomeatendente
      );
    }

    for (const item of this.descontosCombustiveis) {
      item.iddesconto = idDesconto;
      if (this.isNovoDescontoCombustivel) {
        item.id = await this.descontoService.addDescontoCombustivel(item);
      } else {
        item.id = await this.descontoService.updateDescontoCombustivel(item);
      }
    }   

    if (this.isNovoDescontoCombustivel){
      this.isNovoDescontoCombustivel = false;
    } 

    if (confirmado){      
      this.descontoDataService.clear();
      this.resetForm(); // Limpar os campos após salvar
      await this.utilService.showAlert('Sucesso', `Desconto gerado com sucesso.`);
      this.router.navigate(['/desconto']);
    }
  }

  resetForm() {
    this.desconto = {
      totalpreco: 0,
      totaldesconto: 0,
      datahora: new Date(),
      numerorecibo: '',
      idpedidodidiglobal: '',
      codigodesconto: '',
      confirmado: false,
      totaldescontorecebido: 0,
      cancelado: false,
      nomeatendente: '',
    };
    this.descontosCombustiveis = [];
    this.descontosTiposPagamento = [];
    this.isNovoDesconto = true;
    this.isNovoDescontoCombustivel = true;
    this.isNovoDescontoTiposPagamento = true;
  }

  voltarPagina() {
    this.descontoDataService.clear();
    this.router.navigate(['/desconto']);
  }

  // Cancela Desconto
  async cancelarDesconto() {    
    const retornoApiCancelaDesconto = await this.cancelaDescontoAPI();
    if (!retornoApiCancelaDesconto){
      return;
    }

    const retornoGeraDados = await this.gerarDadosRetornoIntegracao();
    if(!retornoGeraDados){
      return;
    }
  
    this.desconto.cancelado = true;
    await this.saveDesconto(false);
    await this.utilService.showAlert('Sucesso', `Desconto cancelado com sucesso.`);
    this.voltarPagina();
  }  

  // Tipo Pagamento
  async addDescontosTiposPagamento() {
    this.descontosTiposPagamento.push({
      iddesconto: this.desconto.id!,
      tipopagamento: '',
      valorpago: 0.00
    });
  }

  async editDescontosTiposPagamento(index: number) {

  }

  async deleteDescontosTiposPagamento(index: number) {
    this.descontosTiposPagamento.splice(index, 1);
  }

  async sugerirValorTotalAPagarDescontosTiposPagamento(item: DescontoTiposPagamento){
    item.valorpago = this.desconto.totaldesconto; 
  }

  async formatValue(value: number){
    const valorRegex = /^\d+([.,]\d{1,2})?$/;
    
    // Validação preço
    if (!valorRegex.test(value?.toString())) {
      await this.utilService.showAlert('Erro', 'O campo Preço deve conter apenas números e ponto, com no máximo 2 casas decimais.');
      return;
    }
  }

  //#region Métodos Desabilita Botões
  // Desabilita o botão gerar desconto
  async desabilitaGerarDesconto(desabilitado: boolean) {    
    const gerarDesconto = document.getElementById('btGerarDesconto') as HTMLIonSelectElement;
    if (gerarDesconto) {
      if (this.desconto.cancelado)
        gerarDesconto.disabled = true;
      else if (this.desconto.idpedidodidiglobal != '' && this.desconto.id > 0 && this.desconto.confirmado == false)
        gerarDesconto.disabled = false;
      else
        gerarDesconto.disabled = desabilitado;
    }
  }

  // Desabilita o botão Adicionar Pagamento
  async desabilitaAdicionarPagamento(desabilitado: boolean) {    
    const adicionarPagamento = document.getElementById('btAdicionarPagamento') as HTMLIonSelectElement;
    if (adicionarPagamento) {
      if (this.desconto.cancelado)
        adicionarPagamento.disabled = true;
      else if (this.desconto.idpedidodidiglobal != '' && this.desconto.id > 0 && this.desconto.confirmado == false)
        adicionarPagamento.disabled = false;
      else
        adicionarPagamento.disabled = desabilitado;
    }
  }

  // Desabilita o botão validar desconto
  async desabilitaValidarDesconto(desabilitado: boolean) {
    const validarDesconto = document.getElementById('btValidarDesconto') as HTMLIonSelectElement;
    if (validarDesconto) {
      if (this.desconto.cancelado)
        validarDesconto.disabled = true;
      else if (this.desconto.idpedidodidiglobal == '' && this.desconto.id <= 0)
        validarDesconto.disabled = false;
      else if (this.desconto.idpedidodidiglobal != '' && this.desconto.id > 0)
        validarDesconto.disabled = true;
      else
        validarDesconto.disabled = desabilitado;
    }    
  }
  
  // Desabilita o botão cancelar desconto
  async desabilitaCancelarDesconto(desabilitado: boolean) {    
    const cancelarDesconto = document.getElementById('btCancelarDesconto') as HTMLIonSelectElement;
    if (cancelarDesconto) {
      if (this.desconto.cancelado)
        cancelarDesconto.disabled = true;
      else if (this.desconto.id > 0 && this.desconto.confirmado == true)
        cancelarDesconto.disabled = false
      else
        cancelarDesconto.disabled = desabilitado;
    }
  }   

  // Desabilita o botão deletar produto/combustível
  async desabilitaEditarDeletarProduto(desabilitado: boolean) {
    if (this.btDeletarProdutos && this.btEditarProdutos) {
      this.btDeletarProdutos.forEach(deletarProduto => {
        if (this.desconto.idpedidodidiglobal != '')
          deletarProduto.disabled = true;
        else
          deletarProduto.disabled = desabilitado;
      });

      this.btEditarProdutos.forEach(editarProduto => {
        if (this.desconto.idpedidodidiglobal != '')
          editarProduto.disabled = true;
        else
          editarProduto.disabled = desabilitado;
      });
    }
  }

  // Desabilita o botão Adicionar Produto
  async desabilitaAdicionarProduto(desabilitado: boolean) {
    const adicionarProduto = document.getElementById('btAdicionarProduto') as HTMLIonSelectElement;
    if (adicionarProduto) {
      if (this.desconto.cancelado)
        adicionarProduto.disabled = true;
      else if (this.desconto.idpedidodidiglobal == '' && this.desconto.id <= 0)
        adicionarProduto.disabled = false;
      else if (this.desconto.idpedidodidiglobal != '' && this.desconto.id > 0)
        adicionarProduto.disabled = true;
      else
        adicionarProduto.disabled = desabilitado;
    }    
  }  
  //#endregion

  private generateGUID(): string {
    function s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }  

  //#region Métodos API
  // Valida Desconto já nossa api com DidiGlobal
  async validaDescontoAPI(): Promise<boolean>{
    const itensApi: CupomDescontoRequestProduto[] = []; // Inicializa o array de itens

    for (const itensDescontosCombustiveis of this.descontosCombustiveis) {

      const itemApi: CupomDescontoRequestProduto = {
        codigoProduto: itensDescontosCombustiveis.idcombustivel.toString(),
        precoUnitario: this.utilService.verificarEConverterPreco(itensDescontosCombustiveis.preco),
        quantidade: itensDescontosCombustiveis.totallitros,
        totalItem: itensDescontosCombustiveis.totalprecocombustivel,
      };      

      itensApi.push(itemApi); // Adiciona o item ao array
    }

    const corpo: CupomDescontoRequest = {
      nomeAtendente: this.desconto.nomeatendente,
      codigoDesconto: this.desconto.codigodesconto,
      valorTotalPedido: this.desconto.totalpreco,
      listaItensPedido: itensApi,
    };

    try{
      const cupom = await this.cupomDescontoService.validarDesconto(corpo);

      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceId ValidarDesconto: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if(cupom.statusCode != 200){
        await this.utilService.showAlert('Erro', `Não foi possível validar o desconto: ${cupom.errmsg}`);
        return false;
      };       

      this.desconto.idpedidodidiglobal = cupom.data.orderId;   
      this.desconto.totaldesconto = cupom.data.totalDiscountedOrderAmount;
      this.erroMsgApi = cupom.errmsg;

      cupom.data.orderItems.forEach(orderItem => {
        this.descontosCombustiveis.forEach(descontoCombustivel => {
          if (descontoCombustivel.idcombustivel.toString() === orderItem.productCode) {
            descontoCombustivel.totaldescontocombustivel = descontoCombustivel.totalprecocombustivel - orderItem.discountAmount;
            descontoCombustivel.totaldescontorecebidocombustivel = orderItem.discountAmount;
          }
        });
      });

      return true;
    }catch (error){
      console.error('Erro ao validar cupom:', error);
      
    // Extraia a mensagem de erro correta do objeto error
    let errorMsg = 'Erro desconhecido';
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
        errorMsg = error.error.errmsg;
      } else if (error.message) {
        errorMsg = error.message;
      }
    }

      await this.utilService.showAlert('Erro', `Não foi possível validar o desconto: ${errorMsg}`);
      return false;
    }
  }

  // Confirma Desconto já nossa api com DidiGlobal
  async ConfirmaDescontoAPI(): Promise<boolean>{
    const itensApi: ConfirmarPedidoRequestPagamento[] = []; // Inicializa o array de pagamentos

    for (const itensDescontosTipoPagamento of this.descontosTiposPagamento){

      const itemApi: ConfirmarPedidoRequestPagamento = {
        tipo : itensDescontosTipoPagamento.tipopagamento,
        valor: itensDescontosTipoPagamento.valorpago
      }

      itensApi.push(itemApi); // Adiciona o item ao array
    }

    const corpo: confirmarPedidoRequest = {
      pedidoId: this.desconto.idpedidodidiglobal,
      recibo: this.desconto.numerorecibo.toString(),
      Pagamentos : itensApi
    };

    try {
      const cupom = await this.pedidoService.confirmarPedido(corpo);

      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID ConfirmaPedido: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode == 200){
        this.desconto.confirmado = cupom.confirmado;
        return true;
      }else{
        await this.utilService.showAlert('Erro', `Não foi possível confirmar o desconto: ${cupom.errmsg}`);
        return false;
      }       
    } catch (error) {
      console.error('Erro ao confirmar desconto:', error);

      // Extraia a mensagem de erro correta do objeto error
      let errorMsg = 'Erro desconhecido';
      if (error instanceof HttpErrorResponse) {
        if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
          errorMsg = error.error.errmsg;
        } else if (error.message) {
          errorMsg = error.message;
        }
      }
      
      await this.utilService.showAlert('Erro', `Não foi possível confirmar o desconto: ${errorMsg}`);
      return false;
    }
  }

  // Cancela Desconto na DidiGlobal
  async cancelaDescontoAPI(){
    const corpo: cancelarPedidoRequest = {
      pedidoId: this.desconto.idpedidodidiglobal,
      Recibo: this.desconto.numerorecibo.toString()
    };

    try {
      const cupom = await this.pedidoService.cancelarPedido(corpo);

      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID CancelaDesconto: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode = 200){
        this.desconto.cancelado = true;
        return true;
      }else{
        await this.utilService.showAlert('Erro', `Não foi possível cancelar o desconto: ${cupom.errmsg}`);
        return false;
      }      
    } catch (error) {
      console.error('Erro ao cancelar desconto:', error);

      // Extraia a mensagem de erro correta do objeto error
      let errorMsg = 'Erro desconhecido';
      if (error instanceof HttpErrorResponse) {
        if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
          errorMsg = error.error.errmsg;
        } else if (error.message) {
          errorMsg = error.message;
        }
      }
      
      await this.utilService.showAlert('Erro', `Não foi possível cancelar o desconto: ${errorMsg}`);
      return false;
    }
  }

  // Gera o Json para Goodsoft
  async gerarDadosRetornoIntegracao(){
    const itensCorpo: GerarDadosRetornoIntegracaoDescontoCombustivelRequest[] = [];
    const itensApi: GerarDadosRetornoIntegracaoPagamentoPedidoRequest[] = []; 
    this.SomaTotalDescontoRecebido = 0;

    for (const itensDescontosTipoPagamento of this.descontosTiposPagamento){

      const itemApi: GerarDadosRetornoIntegracaoPagamentoPedidoRequest = {
        id: itensDescontosTipoPagamento.id,
        idDesconto : itensDescontosTipoPagamento.iddesconto,
        tipo : itensDescontosTipoPagamento.tipopagamento,
        valor: itensDescontosTipoPagamento.valorpago
      }

      itensApi.push(itemApi);
    }

    for (const itensDescontosCombustiveis of this.descontosCombustiveis){

      const itemCorpo: GerarDadosRetornoIntegracaoDescontoCombustivelRequest = {
        id : itensDescontosCombustiveis.id,
        idDesconto: itensDescontosCombustiveis.iddesconto,
        idCombustivel: itensDescontosCombustiveis.idcombustivel,
        idBomba: itensDescontosCombustiveis.idbomba,
        idBico: itensDescontosCombustiveis.idbico,
        nome: itensDescontosCombustiveis.nome,
        preco: itensDescontosCombustiveis.preco,
        totalLitros: itensDescontosCombustiveis.totallitros,
        totalPrecoCombustivel: itensDescontosCombustiveis.totalprecocombustivel,
        totalDescontoCombustivel: itensDescontosCombustiveis.totaldescontocombustivel,
        totalDescontoRecebidoCombustivel: itensDescontosCombustiveis.totaldescontorecebidocombustivel,
      };

      this.SomaTotalDescontoRecebido += itensDescontosCombustiveis.totaldescontorecebidocombustivel;

      itensCorpo.push(itemCorpo);
    }

    const corpo: GerarDadosRetornoIntegracaoRequest = {
      id: this.desconto.id,
      descontoPagamento: itensApi,
      NomeAtendente: this.desconto.nomeatendente,
      totalPreco: this.desconto.totalpreco,
      totalDesconto : this.desconto.totaldesconto,
      dataHora: this.desconto.datahora,
      recibo: this.desconto.numerorecibo,
      idPedidoDidiGlobal: this.desconto.idpedidodidiglobal,
      codigoDesconto: this.desconto.codigodesconto,
      confirmado: this.desconto.confirmado,
      totalDescontoRecebido: this.SomaTotalDescontoRecebido,
      cancelado: this.desconto.cancelado,
      descontoCombustivel: itensCorpo,
    }

    console.log(`${JSON.stringify(corpo)}`);

    try {
      const retornoGerouArquivo = await this.gerarDadosRetornoIntegracaoService.gerarDadosRetorno(corpo);

      if(!retornoGerouArquivo.arquivoGerado){
        await this.utilService.showAlert('Erro', `Não foi possível gerar o arquivo de retorno JSON`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao gerar retorno:', error);

      // Extraia a mensagem de erro correta do objeto error
      let errorMsg = 'Erro desconhecido';
      if (error instanceof HttpErrorResponse) {
        if (error.error && typeof error.error === 'object' && 'errmsg' in error.error) {
          errorMsg = error.error.errmsg;
        } else if (error.message) {
          errorMsg = error.message;
        }
      }
      
      await this.utilService.showAlert('Erro', `Não foi possível gerar o arquivo de retorno JSON: ${errorMsg}`);
      return false;
    }
  }
  //#endregion
}
