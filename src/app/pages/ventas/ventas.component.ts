import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Venta } from 'src/app/models/venta.model';
import { VentaService } from 'src/app/services/ventas.service';
import * as printJS from 'print-js';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit, OnDestroy {

  public datosVentaJSON:any;
  public detalleVentaJSON:any;
  /*Detalle de venta */
  public venta : any = {
    iduser:'',
    idcliente:''
  };
  public detalle_venta;
  public identity;

  dtOptions: DataTables.Settings = {};
  ventas:Venta[]=[];
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private _ventaService:VentaService,
    private _productoService:ProductoService
  ) { }

  ngOnInit(): void {
    this.listar_ventas();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  listar_ventas(){
    this._ventaService.get_ventas().subscribe((res:any)=>{
      //console.log(res);
      this.ventas = res.ventas;
      this.datosVentaJSON = this.ventas;
      this.dtTrigger.next();
    });
  }

  getVenta_id(id:string){
    //console.log(id);
    this._ventaService.data_venta(id).subscribe(
      (response:any)=>{
        //console.log(response);
        this.venta = response.data.venta;
        this.detalle_venta = response.data.detalles;

        this.detalleVentaJSON = this.detalle_venta;
      }
    )
  }

  /*Imprimir reportes */
  printReport(){
    printJS({printable: this.datosVentaJSON, properties: [
      { field: 'fecha', displayName: 'Fecha'},
		  { field: 'tipo_documento', displayName: 'Comprobante'},
      { field: 'factura', displayName: 'No. Comprobante'},
      { field: 'total', displayName: 'Venta total'}
    ], type: 'json',header:'Listado de Ventas'});
  }
  /*Imprimir nota de venta */
  print(){
    printJS({printable: this.detalleVentaJSON, properties: [
      { field: 'idproducto.titulo', displayName: 'Descripción'},
		  { field: 'cantidad', displayName: 'Cantidad'},
		  { field: 'idproducto.precio_venta', displayName: 'P. Unitario'},
      { field: 'subtotal', displayName: 'Subtotal'}
    ], type: 'json',
    header:`
    <h3>DETALLE DE VENTA</h3>
    `
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
