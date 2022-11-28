import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DetalleVenta } from 'src/app/models/detalleventa.model';
import { Producto } from 'src/app/models/producto.model';
import Swal from 'sweetalert2';
import { VentaService } from 'src/app/services/ventas.service';
import { Router } from '@angular/router';
import { DataVenta } from 'src/app/models/ventaData.model';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-venta-create',
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.css']
})
export class VentaCreateComponent implements OnInit {

  public fecha;
  public identity;
  public productosCopy :Array<Producto>=[];
  public clientes : any;
  public venta : any = {
    idcliente : ''
  };
  public ventasData:Array<DataVenta>=[];
  public productos;
  public producto : any ={
    stock : '--|--'
  };
  public total=0;
  public total_venta;
  public clientesCopy :Array<Cliente>=[];
  public data_detalle:Array<any> = [];
  public detalle : any ={
    idproducto : ''
  }; //solucion al problema de html ngModel

  public error_message;

  /*Form group clientes */
  public registerClienteForm = this._fb.group({
    ci:['',[Validators.required]],
    nombres:['',Validators.required],
    correo:['',[Validators.required,Validators.email]],
  });
  formSubmited=false;

  constructor(
    private _fb:FormBuilder,
    private _clienteService:ClienteService,
    private _usuarioService:UsuarioService,
    private _productoService:ProductoService,
    private _ventaService:VentaService,
    private _router:Router
  ) { 
    this.identity = _usuarioService.getIdentity();
  }

  ngOnInit(): void {
    this.get_productos();
    let date = new Date().toLocaleDateString('es-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"}) 
    this.fecha = date;
    //clientes
    this._clienteService.get_clientes().subscribe(
      (res:any)=>{
        this.clientes = res.clientes;
      }
    );
    //productos
    this._productoService.get_productos().subscribe(
      (res:any)=>{
        this.productos = res.productos;
      }
    );
  }

  get_productos(){
    this.productosCopy = JSON.parse(localStorage.getItem('productos'));
    const item = this.productosCopy;
    if(this.productosCopy===null){
      this.productosCopy=[];
    }
  }

  get_data_producto(id){
    this._productoService.getProducto_id(id).subscribe(
      (res:any)=>{
        //console.log(response);
        this.producto = res.producto; 
      },
      error=>{
      }
    );
  }
  

  /*Registrar nuevo cliente */
  crearClientes(){
    this.formSubmited=true;
    if(this.registerClienteForm.invalid){
      return;
    }
    this._clienteService.create_cliente(this.registerClienteForm.value).subscribe(
      (response:any)=>{
        //console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Cliente registrado',
          showConfirmButton: false,
          timer: 1500
        }).then((result)=>{
          if(result){
            const item = response.cliente;
            this.clientesCopy.push(item);
            localStorage.setItem('clientes',JSON.stringify(this.clientesCopy));
            location.reload();
          }
        })
      },
      error=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'No pudo completarse la petición!'
        });
      }
    );
  }
  ////////////////////////////

  save_detalle(detalleForm){
    if(detalleForm.valid){
      if(detalleForm.value.cantidad <= this.producto.stock){
        //console.log(detalleForm.value);
        this.data_detalle.push({
          idproducto : detalleForm.value.idproducto,
          cantidad : detalleForm.value.cantidad,
          producto : this.producto.titulo,
          precio_venta : this.producto.precio_venta
        });
        this.detalle = new DetalleVenta('','',null,null,'');
        this.producto.stock = '--|--';
        this.total = this.total + (parseFloat(this.producto.precio_venta) * parseInt(detalleForm.value.cantidad));
        
      }else{
        this.error_message = 'No puedes sobrepasar el stock';
      }
    }else{
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: 'Completa los campos!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  eliminar(idx,precio_venta,cantidad){
    this.data_detalle.splice(idx,1);
    this.total = this.total - (parseFloat(precio_venta)*parseInt(cantidad))
  }
  close_alert(){
    this.error_message = '';
  }

  onSubmit(ventaForm){
    if(ventaForm.valid){
      let data = {
        fecha:this.fecha,
        idcliente:ventaForm.value.idcliente,
        iduser:this.identity._id,
        tipo_documento:ventaForm.value.tipo_documento,
        factura:ventaForm.value.factura,
        detalles : this.data_detalle 
      }
      //localstorage
      ////////////////////
      this._ventaService.save_data(data).subscribe(
        (res:any)=>{
          var items = res.venta;
          Swal.fire({
            icon: 'success',
            title: 'Venta registrada!',
            showConfirmButton: false,
            timer: 1500
          }).then((result)=>{
            if(result){
              //localstorage
              var dataVenta = {
                _id:items._id,
                fecha: this.fecha,
                tipo_documento:items.tipo_documento,
                n_documento: items.factura,
                detalles:[data.detalles],
                total:items.total
              }
              this.ventasData.push(dataVenta);
              console.log(this.ventasData);
              localStorage.setItem('ventas',JSON.stringify(this.ventasData));
              this._router.navigate(['/ventas']);

            }
          })
        },(err:any)=>{
          Swal.fire({
            icon:'error',
            text:err.error.msg
          })
        }
      );
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Completa los campos!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  /*Validacion de modal clientes */
  campoNoValido(campo:string):boolean{
    if(this.registerClienteForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }
  }

}
