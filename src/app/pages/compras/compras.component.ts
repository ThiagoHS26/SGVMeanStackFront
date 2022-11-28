import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompraService } from 'src/app/services/compras.service';
import { Compra } from 'src/app/models/compra.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as printJS from 'print-js';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit, OnDestroy {

  public datosCompraJSON:any;
  public detalleCompraJSON:any;
  public fecha;
  
  public compra : any = {
    iduser:'',
    idproveedor:''
  };
  public detalle_compra;
  dtOptions: DataTables.Settings = {};
  compras:Compra[]=[];
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private _compraService:CompraService,
    private _router:Router
  ) { }
  
  ngOnInit(): void {
    let date = new  Date().toLocaleDateString('es-us', { weekday:"long", year:"numeric", month:"long", day:"numeric"});
    this.fecha = date;
    this.listar_compras();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  listar_compras(){
    this._compraService.get_compras().subscribe((res:any)=>{
      //console.log(res);
      this.compras = res.compras;
      this.datosCompraJSON = this.compras;
      this.dtTrigger.next();
    });
  }

  getCompra_id(id:string){
    //console.log(id);
    //localStorage.setItem('idCompra',id);
    this._compraService.data_compra(id).subscribe(
      (res:any)=>{
        this.compra = res.data.compra;
        this.detalle_compra = res.data.detalles;
        this.detalleCompraJSON = this.detalle_compra;
      }
    );
  }

  /*reporte */
  printReport(){
    printJS({printable: this.datosCompraJSON, properties: [
      { field: 'fecha', displayName: 'Fecha'},
		  { field: 'tipo_documento', displayName: 'Comprobante'},
		  { field: 'factura', displayName: 'No. Comprobante'},
      { field: 'total', displayName: 'Compra total'}
    ], type: 'json',
      header: '<h3>Listado de compras</h3>'
    });
  }

  /*factura */
  print(){
    printJS({printable: this.detalleCompraJSON, properties: [
      { field: 'idproducto.titulo', displayName: 'Descripción'},
		  { field: 'cantidad', displayName: 'Cantidad'},
		  { field: 'idproducto.precio_compra', displayName: 'P. Unitario'},
      { field: 'subtotal', displayName: 'Subtotal'}
      ], type: 'json',
      header:`
      <h3>DETALLE DE COMPRA</h3>
      `
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
