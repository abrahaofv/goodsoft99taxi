// src/app/pages/cadastro/desconto/desconto.page.ts

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DescontoService } from '../../../services/desconto/desconto.service';
import { DescontocombustiveisService } from '../../../services/descontocombustiveis/descontocombustiveis.service';
import { DescontotipopagamentoService } from 'src/app/services/descontotipopagamento/descontotipopagamento.service';
import { Desconto, DescontoTiposPagamento, DescontosCombustiveis } from '../../../services/database.service';
import { DescontoDataService } from '../../../services/desconto-data/desconto-data.service';
import { Router } from '@angular/router';
import { UtilService } from '../../../services/util/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PedidoService } from 'src/app/core/services/pedido.service';
import {GerarDadosRetornoIntegracaoRequest, GerarDadosRetornoIntegracaoDescontoCombustivelRequest, GerarDadosRetornoIntegracaoPagamentoPedidoRequest} from '../../../shared/models/gerarDadosRetornoIntegracaoRequest';
import { GerarDadosRetornoIntegracaoService } from 'src/app/core/services/gerar-dados-retorno-integracao.service';
import { cancelarPedidoRequest } from 'src/app/shared/models/cancelarPedido.request.model';

@Component({
  selector: 'app-desconto',
  templateUrl: './desconto.page.html',
  styleUrls: ['./desconto.page.scss']
})
export class DescontoPage implements OnInit {
  descontos: Desconto[] = [];
  descontosCombustiveis: { [key: number]: DescontosCombustiveis[] } = {};
  descontoTiposPagamento: { [key: number]: DescontoTiposPagamento[] } = {};

  SomaTotalDescontoRecebido: number;

  constructor(
    private descontoService: DescontoService,
    private descontocombustiveisService: DescontocombustiveisService,
    private descontotipopagamentoService: DescontotipopagamentoService,
    private alertController: AlertController,
    private descontoDataService: DescontoDataService,
    private router: Router,
    private utilService: UtilService,
    private gerarDadosRetornoIntegracaoService: GerarDadosRetornoIntegracaoService,
    private pedidoService: PedidoService,
  ) {}

  ngOnInit() {
    // Deixar comentado. Só chamar o loadDescontos no ionViewWillEnter. Pois gera conflito chamar nos dois locais.
    // É ideal chamar no ionViewWillEnter pois é chamado quando atualiza a página e não apenas quando entra.

    //this.loadDescontos();
  }

  ionViewWillEnter() {
    // Este método é chamado sempre que a página está prestes a ser exibida
    // Garante que os combustíveis sejam carregados sempre que o usuário voltar para esta página

    this.loadDescontos();
  }

  async loadDescontos() {
    try {
      // Limpar dados anteriores
      this.descontos = [];
      this.descontosCombustiveis = {};
      // Carregar os descontos
      this.descontos = await this.descontoService.getAllDescontos();
      this.descontos.sort((a, b) => new Date(b.datahora).getTime() - new Date(a.datahora).getTime());
      // Carregar os registros filhos associados
      for (let desconto of this.descontos) {
        this.descontosCombustiveis[desconto.id] = await this.descontocombustiveisService.getDescontosCombustiveisByDescontoId(desconto.id);
        this.descontoTiposPagamento[desconto.id] = await this.descontotipopagamentoService.getDescontoTiposPagamentoByDescontoId(desconto.id);
      } 
    } catch (error) {
      console.error('Erro ao carregar descontos', error);
      await this.utilService.showAlert('Erro', 'Não foi possível carregar os descontos.');
    }      
  }

  async cancelaDesconto(iddesconto: number) {
    const DescontoSelecionado = await this.descontoService.getDescontoById(iddesconto);
    if(DescontoSelecionado && DescontoSelecionado?.cancelado){
      await this.utilService.showAlert('Erro', `O Desconto já está cancelado.`);
      return;
    } else if (DescontoSelecionado && !DescontoSelecionado?.confirmado){
      const alert = await this.alertController.create({
        header: 'Confirmar a exclusão',
        message: 'O Desconto ainda não foi gerado para ser cancelado. Deseja excluir este desconto?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel'
          },
          {
            text: 'Sim',
            handler: async () => {            
              await this.descontoService.deleteDesconto(iddesconto);
              this.loadDescontos();
            }
          }
        ]
      });
      await alert.present();

      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar o cancelamento',
      message: 'Deseja realmente cancelar este desconto?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          handler: async () => {        
            await this.cancelaDescontoAPI(iddesconto);    
            await this.descontoService.cancelaDesconto(iddesconto);
            await this.gerarDadosRetornoIntegracao(iddesconto);
            this.loadDescontos();
          }
        }
      ]
    });
    await alert.present();
  }

  // Cancela Desconto na DidiGlobal
  async cancelaDescontoAPI(iddesconto: number){
    const DescontoSelecionado = await this.descontoService.getDescontoById(iddesconto);

    const corpo: cancelarPedidoRequest = {
      pedidoId: DescontoSelecionado.idpedidodidiglobal,
      Recibo: DescontoSelecionado.numerorecibo.toString()
    };

    try {
      const cupom = await this.pedidoService.cancelarPedido(corpo);

      console.log(`${JSON.stringify(corpo)}`);
      console.log(`TraceID CancelaDesconto: ${cupom.trace_Id}`);
      console.log(`statusCode: ${cupom.statusCode}`);

      if (cupom.statusCode = 200){
        DescontoSelecionado.cancelado = true;
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

  async viewDesconto(desconto: Desconto) {
    this.descontoDataService.setDesconto(desconto);
    this.descontoDataService.clearCurrentDescontoCombustivel();
    this.descontoDataService.clearCurrentDescontoTiposPagamento();

    const descontosCombustiveis = await this.descontocombustiveisService.getDescontosCombustiveisByDescontoId(desconto.id!);
    this.descontoDataService.setDescontosCombustiveis(descontosCombustiveis);
    
    const descontoTiposPagamento = await this.descontotipopagamentoService.getDescontoTiposPagamentoByDescontoId(desconto.id!);
    this.descontoDataService.setDescontoTiposPagamento(descontoTiposPagamento);

    this.router.navigate(['/caddesconto']);
  }

  redirectGerarDesconto() {
    this.descontoDataService.clear();
    this.router.navigate(['/caddesconto']);
  }

  formatDateTime(dataHora: Date): string {
    if (!dataHora) {
      return '';
    }
    const date = new Date(dataHora);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }

  async gerarDadosRetornoIntegracao(iddesconto: number){
    const itensCorpo: GerarDadosRetornoIntegracaoDescontoCombustivelRequest[] = [];
    const itensApi: GerarDadosRetornoIntegracaoPagamentoPedidoRequest[] = [];

    this.SomaTotalDescontoRecebido = 0;

    const Desconto = await this.descontoService.getDescontoById(iddesconto);
    const DescontosCombustiveis = await this.descontocombustiveisService.getDescontosCombustiveisByDescontoId(iddesconto);
    const DescontoTiposPagamento = await this.descontotipopagamentoService.getDescontoTiposPagamentoByDescontoId(iddesconto);

    for (const itensDescontosCombustiveis of DescontosCombustiveis){

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

    for (const itensDescontoTiposPagamento of DescontoTiposPagamento){

      const itemApi : GerarDadosRetornoIntegracaoPagamentoPedidoRequest = {
        id: itensDescontoTiposPagamento.id,
        idDesconto: itensDescontoTiposPagamento.iddesconto,
        tipo: itensDescontoTiposPagamento.tipopagamento,
        valor: itensDescontoTiposPagamento.valorpago,
      };

      itensApi.push(itemApi);
    }

    const corpo: GerarDadosRetornoIntegracaoRequest = {
      id: Desconto.id,
      descontoPagamento: itensApi,
      NomeAtendente: Desconto.nomeatendente,
      totalPreco: Desconto.totalpreco,
      totalDesconto : Desconto.totaldesconto,
      dataHora: Desconto.datahora,
      recibo: Desconto.numerorecibo,
      idPedidoDidiGlobal: Desconto.idpedidodidiglobal,
      codigoDesconto: Desconto.codigodesconto,
      confirmado: Desconto.confirmado,
      totalDescontoRecebido: this.SomaTotalDescontoRecebido,
      cancelado: Desconto.cancelado,
      descontoCombustivel: itensCorpo,
    }

    try {
      const retornoGerouArquivo = await this.gerarDadosRetornoIntegracaoService.gerarDadosRetorno(corpo);

      console.log(`${JSON.stringify(corpo)}`);

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
}
