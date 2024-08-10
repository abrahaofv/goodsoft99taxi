import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'desconto',
    pathMatch: 'full'
  },
  {
    path: 'sobre',
    loadChildren: () => import('./pages/sobre/sobre.module').then((m) => m.SobrePageModule)
  },
  {
    path: 'ajuda',
    loadChildren: () => import('./pages/ajuda/ajuda.module').then((m) => m.AjudaPageModule)
  },
  {
    path: 'combustivel',
    loadChildren: () => import('./pages/cadastro/combustivel/combustivel.module').then((m) => m.CombustivelPageModule)
  },
  {
    path: 'cadcombustivel',
    loadChildren: () =>
      import('./pages/cadastro/cadcombustivel/cadcombustivel.module').then((m) => m.CadcombustivelPageModule)
  },
  {
    path: 'bomba',
    loadChildren: () => import('./pages/cadastro/bomba/bomba.module').then((m) => m.BombaPageModule)
  },
  {
    path: 'cadbomba',
    loadChildren: () => import('./pages/cadastro/cadbomba/cadbomba.module').then((m) => m.CadbombaPageModule)
  },
  {
    path: 'caddesconto',
    loadChildren: () => import('./pages/cadastro/caddesconto/caddesconto.module').then((m) => m.CaddescontoPageModule)
  },
  {
    path: 'desconto',
    loadChildren: () => import('./pages/cadastro/desconto/desconto.module').then((m) => m.DescontoPageModule)
  },
  {
    path: 'caddescontoscombustiveis',
    loadChildren: () => import('./pages/cadastro/caddescontoscombustiveis/caddescontoscombustiveis.module').then( m => m.CaddescontoscombustiveisPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./pages/configuracao/configuracao.module').then( m => m.ConfiguracaoPageModule)
  },
  {
    path: 'produto',
    loadChildren: () => import('./pages/cadastro/produto/produto.module').then( m => m.ProdutoPageModule)
  },
  {
    path: 'cadproduto',
    loadChildren: () => import('./pages/cadastro/cadproduto/cadproduto.module').then( m => m.CadprodutoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
