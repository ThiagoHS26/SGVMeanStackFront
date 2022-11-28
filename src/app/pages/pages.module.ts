import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VentaCreateComponent } from './ventas/venta-create/venta-create.component';
import { CompraCreateComponent } from './compras/compra-create/compra-create.component';
import { ConfigComponent } from './config/config.component';
import { ReporteComprasComponent } from './reporte-compras/reporte-compras.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    ClientesComponent,
    ComprasComponent,
    VentasComponent,
    PagesComponent,
    CategoriasComponent,
    ProveedoresComponent,
    VentaCreateComponent,
    CompraCreateComponent,
    ConfigComponent,
    ReporteComprasComponent,
    ReporteVentasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    ClientesComponent,
    ComprasComponent,
    VentasComponent,
    CategoriasComponent,
    ProveedoresComponent,
    VentaCreateComponent,
    CompraCreateComponent,
    ConfigComponent,
    ReporteComprasComponent,
    ReporteVentasComponent
  ]
})
export class PagesModule { }
