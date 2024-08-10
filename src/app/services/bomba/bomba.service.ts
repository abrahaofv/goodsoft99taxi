// src/app/services/bomba.service.ts

import { Injectable } from '@angular/core';
import { DatabaseService, Bomba } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class BombaService {
  constructor(private dbService: DatabaseService) {}

  async addBomba(idbomba: number, idbicos: string) {
    return await this.dbService.addBomba(idbomba, idbicos);
  }

  async getAllBombas() {
    return await this.dbService.getAllBombas();
  }

  async getBombaById(idbomba: number): Promise<Bomba | undefined> {
    return await this.dbService.getBombaById(idbomba);
  }

  async updateBomba(idbomba: number, idbicos: string) {
    return await this.dbService.updateBomba(idbomba, idbicos);
  }

  async deleteBomba(idbomba: number) {
    return await this.dbService.deleteBomba(idbomba);
  }

  async validateBicos(idbicos: string): Promise<{ isValid: boolean; mensagem: string }> {
    const allBombas = await this.dbService.getAllBombas();
    const newBicosArray = idbicos.split(',').map((bico) => bico.trim());

    for (const bomba of allBombas) {
      const existingBicosArray = bomba.idbicos.split(',').map((bico) => bico.trim());
      for (const newBico of newBicosArray) {
        if (existingBicosArray.includes(newBico)) {
          return {
            isValid: false,
            mensagem: `O bico ${newBico} já está cadastrado na bomba ${bomba.idbomba}`
          };
        }
      }
    }

    return { isValid: true, mensagem: '' };
  }

  async getBicosByBomba(bombaId: number) {
    return await this.dbService.getBicosByBomba(bombaId);
  }
}
