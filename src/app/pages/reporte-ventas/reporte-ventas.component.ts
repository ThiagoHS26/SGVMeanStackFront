import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataVenta } from 'src/app/models/ventaData.model';
import { VentaService } from 'src/app/services/ventas.service';
import * as printJS from 'print-js';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit, OnDestroy {

  public reporteVenta:any;
  public reporteVentaFinal:Array<any>=[];
  public total=0;
  public lista_ventas:Array<DataVenta>=[];
  public reporte_productos:Array<any>=[];
  dtOptions: DataTables.Settings = {};
  ventasData:DataVenta[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private _ventasService:VentaService) { }

  ngOnInit(): void {
    if(this.reporte_productos === null){
      this.reporte_productos = [];
    }
    this.reporteVenta = this.reporte_productos;
    this.get_ventas();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  get_ventas(){
    this.lista_ventas = JSON.parse(localStorage.getItem('ventas'));
    if(this.lista_ventas === null){
      this.lista_ventas = [];
    }
    this._ventasService.get_ventas().subscribe((res:any)=>{
      this.ventasData = res.venta;
      this.dtTrigger.next();
    });
    var array:Array<any> = [...this.lista_ventas];
    var items;
    array.forEach((element,index)=>{
      this.total = this.total + element.total
      
      items={
        fecha:element.fecha,
        comprobante:element.tipo_documento,
        numero:element.n_documento,
        total_venta:element.total,
      }
      this.reporte_productos.push(items);
    });
  }

  printReport(){
    var items;
    this.reporteVenta.forEach((element,index)=>{
      items = {
        fecha:element.fecha,
        comprobante: element.comprobante,
        numero : element.numero,
        subtotal: element.total_venta,
        iva: 0.00,
        descuento: 0.00,
        total: element.total_venta
      }
      this.reporteVentaFinal.push(items);
    });
    printJS({printable: this.reporteVentaFinal, properties: [
      { field: 'fecha', displayName: 'Fecha'},
		  { field: 'comprobante', displayName: 'Comprobante'},
		  { field: 'numero', displayName: 'Número'},
      { field: 'iva', displayName: 'Iva 12%'},
      { field: 'descuento', displayName: 'Descuento'},
      { field: 'subtotal', displayName: 'Subtotal'},
      { field: 'total',displayName:'Total'}
    ], type: 'json',
      header: '<h3>TALLER DE REPARACION Y MANTENIMIENTO AUTOMOTRIZ HEREDIA</h3></hr><h4><em>VICENTE MORENO & SIMON BOLÍVAR</em></hr></h4><h4><em>RAZON SOCIAL: 1801864024001</em></h4>'
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
