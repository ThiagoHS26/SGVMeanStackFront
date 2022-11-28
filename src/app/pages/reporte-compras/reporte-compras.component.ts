import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataCompra } from 'src/app/models/dataCompra.model';
import { CompraService } from 'src/app/services/compras.service';
import * as printJS from 'print-js';

@Component({
  selector: 'app-reporte-compras',
  templateUrl: './reporte-compras.component.html',
  styleUrls: ['./reporte-compras.component.css']
})
export class ReporteComprasComponent implements OnInit, OnDestroy {

  public reporteCompra:any;
  public reporteCompraFinal:Array<any>=[];
  public total=0;
  public lista_compras:Array<DataCompra>=[];
  public reporte_productos:Array<any>=[];
  dtOptions: DataTables.Settings = {};
  comprasData:DataCompra[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private _comprasService:CompraService) { }
  
  ngOnInit(): void {
    if(this.reporte_productos === null){
      this.reporte_productos = [];
    }
    this.reporteCompra = this.reporte_productos;
    this.get_compras();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  //listas compras de ls
  get_compras(){
    this.lista_compras = JSON.parse(localStorage.getItem('compras'));
    if(this.lista_compras === null){
      this.lista_compras = [];
    }
    this._comprasService.get_compras().subscribe((res:any)=>{
      this.comprasData = res.compra;
      this.dtTrigger.next();
    });
    //
    var array:Array<any> = [...this.lista_compras];
    var items;

    array.forEach((element,index)=>{
      this.total = this.total + element.total;
      items = {
        fecha:element.fecha,
        total:element.total,
      }
      this.reporte_productos.push(items);
    });
    //console.log("Total: "+this.total);
    //console.log("Subtotal: "+this.total / 1.12);
    //console.log("IVA: "+((this.total)-(this.total / 1.12)));
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  printReport(){
    var items;
    this.reporteCompra.forEach((element,index)=>{
      items ={
        fecha:element.fecha,
        importe: (element.total / 1.12).toFixed(2),
        subtotal: (element.total / 1.12).toFixed(2),
        iva: ((element.total)-(element.total /1.12)).toFixed(2),
        total: (element.total).toFixed(2)
      }
      this.reporteCompraFinal.push(items);
    });
    printJS({printable: this.reporteCompraFinal, properties: [
      { field: 'fecha', displayName: 'Fecha'},
		  { field: 'importe', displayName: 'Importe'},
		  { field: 'iva', displayName: 'Iva 12%'},
      { field: 'subtotal', displayName: 'Subtotal'},
      { field: 'total',displayName:'Total'}
    ], type: 'json',
      header: '<h3>REPORTE DE COMPRAS</h4>'
    });
  }

}
