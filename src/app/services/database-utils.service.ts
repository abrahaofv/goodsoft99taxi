// src\app\services\database-utils.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { ExportarDatabaseFrontendService } from '../core/services/ExportarDatabaseFrontend.service';
import { ExportarDatabaseFrontendRequest } from '../shared/models/exportarDatabaseFrontendRequest';

@Injectable({
  providedIn: 'root'
})
export class DatabaseUtilsService {

  constructor(
    private databaseService: DatabaseService,
    private exportarDatabaseFrontendService: ExportarDatabaseFrontendService,
  ) {}

  //#region Exportar Banco de dados do JSON
  async exportDatabaseToJSON(): Promise<boolean> {
    try {
      const data = {
        combustiveis: await this.databaseService.combustiveis.toArray(),
        bombas: await this.databaseService.bombas.toArray(),
        descontos: await this.databaseService.descontos.toArray(),
        descontoscombustiveis: await this.databaseService.descontoscombustiveis.toArray(),
        descontotipospagamento: await this.databaseService.descontotipospagamento.toArray(),
        configuracao: (await this.databaseService.configuracao.toArray()).map(config => ({
          ...config,
          login: '',
          loginsagaz: '',
          senha: '',
          senhasagaz: ''
        }))
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const filename = `GoodsoftDBapp99taxi${timestamp}.json`;     
      
      console.log(`${JSON.stringify(data)}`);
      console.log(`${filename}`);
      console.log(`${json}`);

      const corpo: ExportarDatabaseFrontendRequest = {
        JSONdb : json
      }

      try {
        const retornoGerouArquivo = await this.exportarDatabaseFrontendService.ExportarDatabaseFrontend(corpo);
  
        if(!retornoGerouArquivo.arquivoGerado){
          return false;
        }
  
        return true;
      } catch (error) {
        console.error('Erro ao enviar JSON para API:', error);
        return false;
      }
    } catch (error) {
      console.error('Erro ao exportar o banco de dados para JSON:', error);
    }

    return false;
  }  
  //#endregion  

  //#region Importar Banco de dados do JSON
  async importDatabaseFromJSON(jsonData: string, importCombustiveis: boolean, importBombas: boolean): Promise<boolean> {
    try {
      // Parse JSON
      const data = JSON.parse(jsonData);

      // Importar combustiveis se o usuário escolher
      if (importCombustiveis) {
        await this.databaseService.combustiveis.clear();
        for (const combustivel of data.combustiveis) {
          await this.databaseService.addCombustivel(
            combustivel.id,
            combustivel.nome,
            combustivel.idbicos,
            combustivel.idbombas,
            parseFloat(combustivel.preco), // Converter string para número
            combustivel.tipoproduto,
            combustivel.status,
            combustivel.ehcombustivel,
            combustivel.ncm.toString(), // Converter para string se necessário
            combustivel.anp.toString(), // Converter para string se necessário
            combustivel.codigobarras.toString() // Converter para string se necessário
          );
        }
      }

      // Importar bombas se o usuário escolher
      if (importBombas) {
        await this.databaseService.bombas.clear();
        for (const bomba of data.bombas) {
          await this.databaseService.addBomba(bomba.idbomba, bomba.idbicos);
        }
      }

      // Importar descontos
      const newDescontoIds: Record<number, number> = {}; // Para mapear ids antigos para novos
      for (const desconto of data.descontos) {
        const existingDesconto = await this.databaseService.descontos
          .where('idpedidodidiglobal')
          .equals(desconto.idpedidodidiglobal)
          .first();

        if (!existingDesconto) {
          // Adicionar novo desconto e armazenar novo id
          const newId = await this.databaseService.addDesconto(
            desconto.totalpreco,
            desconto.totaldesconto,
            new Date(desconto.datahora),
            desconto.numerorecibo,
            desconto.idpedidodidiglobal,
            desconto.codigodesconto,
            desconto.confirmado,
            desconto.totaldescontorecebido,
            desconto.cancelado,
            desconto.nomeatendente
          );

          newDescontoIds[desconto.id] = newId;
        }
      }

      // Importar descontoscombustiveis usando os novos ids de desconto
      for (const descontoCombustivel of data.descontoscombustiveis) {
        const newDescontoId = newDescontoIds[descontoCombustivel.iddesconto];
        if (newDescontoId !== undefined) {
          await this.databaseService.addDescontoCombustivel(
            newDescontoId,
            descontoCombustivel.idcombustivel,
            descontoCombustivel.idbomba,
            parseInt(descontoCombustivel.idbico), // Converter string para número se necessário
            descontoCombustivel.nome,
            descontoCombustivel.preco,
            descontoCombustivel.totallitros,
            descontoCombustivel.totalprecocombustivel,
            descontoCombustivel.totaldescontocombustivel,
            descontoCombustivel.totaldescontorecebidocombustivel
          );
        }
      }

      // Importar descontotipospagamento usando os novos ids de desconto
      for (const descontoTipoPagamento of data.descontotipospagamento) {
        const newDescontoId = newDescontoIds[descontoTipoPagamento.iddesconto];
        if (newDescontoId !== undefined) {
          await this.databaseService.addDescontoTiposPagamento(
            newDescontoId,
            descontoTipoPagamento.tipopagamento,
            descontoTipoPagamento.valorpago
          );
        }
      }

      // Atualizar configuracao se necessário
      for (const config of data.configuracao) {
        await this.databaseService.atualizaConfiguracaoParcial(config.id, config.urlapi, config.diretoriojson);
      }

      return true; // Importação concluída com sucesso
    } catch (error) {
      console.error('Erro ao importar o banco de dados do JSON:', error);
      return false;
    }
  }
  //#endregion  

  //#region Importar/Atualizar Combustível do JSON
  async importCombustivelFromJSON(jsonData: string): Promise<boolean> {
    try {
      // Parse do JSON
      const data = JSON.parse(jsonData);

      // Verificar se o campo TiposProduto é válido
      const tiposPermitidos = ['ETANOL', 'ETANOL_ADITIVADO', 'GASOLINA', 'GASOLINA_ADITIVADA', 'DIESEL', 'DIESEL_S500_ADITIVADO', 'DIESEL_ADITIVADO', 'DIESEL_S10_ADITIVADO', 'GASOLINA_PODIUM', 'GASOLINA_PREMIUM', 'GNV', 'ARLA32', 'QUEROSENE', 'GASOLINA_TROCA_OLEO', 'PONTUACAO', 'OUTRO'];

      if (!tiposPermitidos.includes(data.TiposProduto)) {
        throw new Error(`Tipo de Produto inválido: ${data.TiposProduto}`);
      }

      // Verificar se o combustível já existe
      const combustivelExistente = await this.databaseService.getCombustivelById(data.Codigo);

      if (combustivelExistente) {
        // Deletar combustível existente
        await this.databaseService.deleteCombustivel(data.Codigo);
      }

      // Cadastrar novo combustível
      await this.databaseService.addCombustivel(
        data.Codigo,
        data.Nome,
        data.Bico.toString(),
        data.Bomba.toString(),
        data.Preco,
        data.TiposProduto,
        true, // status
        true, // ehcombustivel
        data.NCM,
        data.ANP,
        data.CodigoBarras
      );

      // Verificar e atualizar as bombas e bicos
      const bombasIds = data.Bomba.toString().split(',').map((b: string) => b.trim());
      const bicosIds = data.Bico.toString().split(',').map((b: string) => b.trim());

      for (const idbomba of bombasIds) {
        const bomba = await this.databaseService.getBombaById(parseInt(idbomba));

        if (bomba) {
          // Bomba já existe, verificar bicos
          let bicosExistentes = bomba.idbicos.split(',').map((b) => b.trim());
          for (const bico of bicosIds) {
            if (!bicosExistentes.includes(bico)) {
              bicosExistentes.push(bico);
            }
          }
          // Atualizar bomba com os novos bicos
          await this.databaseService.updateBomba(parseInt(idbomba), bicosExistentes.join(','));
        } else {
          // Se a bomba não existir, adiciona nova bomba com os bicos
          await this.databaseService.addBomba(parseInt(idbomba), bicosIds.join(','));
        }
      }

      return true; // Importação concluída com sucesso

    } catch (error) {
      console.error('Erro ao importar o combustível do JSON:', error);
      return false;
    }
  }  
  //#endregion
}
