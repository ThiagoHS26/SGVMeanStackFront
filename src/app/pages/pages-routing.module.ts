import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';
import { ComprasComponent } from './compras/compras.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { AuthGuard } from '../guards/auth.guard';
import { VentaCreateComponent } from './ventas/venta-create/venta-create.component';
import { CompraCreateComponent } from './compras/compra-create/compra-create.component';
import { ConfigComponent } from './config/config.component';
import { ReporteComprasComponent } from './reporte-compras/reporte-compras.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';

const routes:Routes=[
  {path:'',component:PagesComponent,canActivate:[AuthGuard],//Ruta padre
    children:[
      {path:'dashboard',component:DashboardComponent, data:{titulo:'Dashboard'}},
      {path:'usuarios',component:UsuariosComponent, data:{titulo:'Usuarios'}},
      {path:'productos',component:ProductosComponent, data:{titulo:'Productos'}},
      {path:'ventas',component:VentasComponent, data:{titulo:'Ventas'}},
      {path:'ventas/registrar',component:VentaCreateComponent, data:{titulo:'Nueva Venta'}},
      {path:'compras',component:ComprasComponent, data:{titulo:'Compras'}},
      {path:'compras/registrar',component:CompraCreateComponent, data:{titulo:'Nueva Compra'}},
      {path:'clientes',component:ClientesComponent, data:{titulo:'Clientes'}},
      {path:'categorias',component:CategoriasComponent, data:{titulo:'Categorias'}},
      {path:'proveedores',component:ProveedoresComponent, data:{titulo:'Proveedores'}},
      {path:'configuraciones',component:ConfigComponent, data:{titulo:'Configuraciones'}},
      {path:'reporte-compras',component:ReporteComprasComponent, data:{titulo:'Reporte de compras'}},
      {path:'reporte-ventas',component:ReporteVentasComponent, data:{titulo:'Reporte de ventas'}}
    ]
  }//ruta padre 
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)//Hijas
  ],
  exports:[RouterModule]
})
export class PagesRoutingModule { }
