import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { CompraService } from 'src/app/services/compras.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/ventas.service';
import * as jQuery from 'jquery';
import { ChartData, ChartType } from 'chart.js';
declare var $:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  //////////////////

  public count=0;
  public clientes_list:Array<any>=[];
  public productos_list:Array<any>=[];
  public productoTop:Array<any>=[];
  public clientes;
  public productos;
  public compras;
  public ventas;
  public total_ventas=0;
  public total_compras=0;
  public inventario=0;
  public total_clientes=0;

  constructor(
    private _clienteService:ClienteService,
    private _compraService:CompraService,
    private _ventaService:VentaService,
    private _productoService:ProductoService
  ) { }

  ngOnInit(): void {
    this.update_puntos();
    this.info_productosTop();
    this.info_productos();
    this.info_compras();
    this.info_clientes();
    this.info_ventas();
  }

  info_productos(){
    this._productoService.get_productos().subscribe((res:any)=>{
      this.productos = res.productos;
        this.productos.forEach((element)=>{
          this.inventario = this.inventario + parseInt(element.stock);
        });
        //console.log(this.inventario);
    });
  }

  update_puntos(){
    this._productoService.get_productos().subscribe((res:any)=>{
      this.productos = res.productos;
      this.productos_list = this.productos;
      localStorage.setItem('productos',JSON.stringify(this.productos_list));
    });
  }

  info_compras(){
    this._compraService.get_compras().subscribe((res:any)=>{
      //console.log(res);
      this.compras = res.compras;
      this.compras.forEach((element)=>{
        this.total_compras = this.total_compras + parseFloat(element.total);
      });
      //console.log(this.total_compras);
    });
  }

  info_clientes(){
    this._clienteService.get_clientes().subscribe((res:any)=>{
      //console.log(res);
      this.clientes = res.clientes;
      this.clientes.forEach((element,index)=>{
        this.total_clientes++;
      });
      //console.log(this.total_clientes);
    });
  }

  info_ventas(){
    this._ventaService.get_ventas().subscribe((res:any)=>{
      //console.log(res);
      this.ventas = res.ventas;
      this.ventas.forEach((element,index)=>{
        this.total_ventas = this.total_ventas + parseFloat(element.total);
        this.clientes_list.push({
          id: element.idcliente._id,
          nombres:element.idcliente.nombres,
          email:element.idcliente.correo,
        
        });
      });
      /*var personas = [...this.clientes_list];
      const busqueda = personas.reduce((acc, persona) => {
        acc[persona.nombres] = ++acc[persona.nombres] || 0;
        return acc;
      }, {});
      const duplicados = personas.filter( (persona) => {
        return busqueda[persona.nombres];
      });
      
      console.log(duplicados);
      this.clientes_list.splice(busqueda,1);
      console.log(this.clientes_list);*/
    });
    
  }
  info_productosTop(){
    this.productoTop = JSON.parse(localStorage.getItem('productos'));
    //console.log(this.productoTop);
  }

  
}
