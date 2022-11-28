import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { Categoria } from 'src/app/models/categoria.model';
import { Subject } from 'rxjs';
import { ProductoService } from 'src/app/services/producto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/services/categoria.service';
import * as jQuery from 'jquery';
import * as printJS from 'print-js';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var $:any;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {

  /*Update stock formulario */
  public updateStockForm = this._fb.group({
    stock:['',[Validators.required, Validators.min(0)]]
  });

  /*Formularios */
  public registerPrudForm = this._fb.group({
    codigo:['',[Validators.required]],
    titulo:['',[Validators.required]],
    marca:['',[Validators.required]],
    descripcion:['',[Validators.required]],
    precio_compra:['',Validators.required],
    precio_venta:['',Validators.required],
    stock:[''],
    idcategoria:['',Validators.required]
  });
  formSubmitted = false;
  stockSubmited = false;

  public productosCopy :Array<Producto>=[];
  public identity;
  public datosProductosJSON:any;
  public url;
  public categorias;
  public producto;
  dtOptions: DataTables.Settings = {};
  public categoriasList:Array<Categoria>=[];
  public productos:Producto[]=[];
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private _productoService:ProductoService,
    private _fb:FormBuilder,
    private _categoriaService:CategoriaService,
    private _userService:UsuarioService
  ) { 
    this.url = environment.urlServer;
    this.identity = _userService.getIdentity();
  }
  
  ngOnInit(): void {
    this.get_categorias();
    this.listar_productos();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  get_categorias(){
    this._categoriaService.get_categorias().subscribe((res:any)=>{
      this.categorias = res.categorias;
    });
  }

  listar_productos(){
    this._productoService.get_productos().subscribe((res:any)=>{
      this.productos = res.productos;
      this.datosProductosJSON = this.productos;
      this.dtTrigger.next();
    });
  }

  deleteById(id:string){
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
    }else{
        
    }
    //Elimnar productos de Mongo
      Swal.fire({
        icon:'warning',
        title:'Advertencia',
        text:'Seguro que quieres eliminar este producto?',
        showCancelButton:true,
        confirmButtonText:'Confirmar'
      }).then((result)=>{
        if(result.isConfirmed){
          this._productoService.delete_producto(id).subscribe((res:any)=>{
            Swal.fire({
              icon:'success',
              title:'Producto eliminado correctamente',
              showConfirmButton:false,
              timer:1500
            }).then((result)=>{
              if(result){
                location.reload();
                localStorage.removeItem('idProducto');
              }
            });
          });
        }
    });
  }

  //Agregar productos
  crearProducto(){
    this.formSubmitted=true;
    if(this.registerPrudForm.invalid){
      return;
    }
    else{
      //Guardar en Mongo
      this._productoService.insert_producto(this.registerPrudForm.value).subscribe(
        (res:any)=>{
          Swal.fire({
            icon:'success',
            title:'Éxito',
            text:"Producto agregado!",
            showConfirmButton:false,
            timer:1500
          }).then((result)=>{
            if(result){
              location.reload();
            }
          });
        }
      ),
      (err:any)=>{
        const errorServer = JSON.parse(err.error);
        Swal.fire('Error',errorServer.msg,'error');
      };
    }
  }

  //editar 
  llenarForm(id:string){
    //console.log(id);
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
    }else{
    this._productoService.getProducto_id(id).subscribe(
      (res:any)=>{
        this.producto = res.producto;
        this.registerPrudForm.setValue({
          codigo: this.producto.codigo,
          titulo:this.producto.titulo,
          marca:this.producto.marca,
          descripcion:this.producto.descripcion,
          precio_compra:this.producto.precio_compra,
          precio_venta:this.producto.precio_venta,
          stock:this.producto.stock,
          idcategoria:this.producto.idcategoria
        });
        $('#editarProducto').modal('toggle');
        $('#editarProducto').modal('show');
      }
    );
    localStorage.setItem('idProducto',id);}
  }
  
  editarProducto(){
    this.formSubmitted=true;
    if(this.registerPrudForm.invalid){
      return;
    }
    this._productoService.update_producto(localStorage.getItem('idProducto'),this.registerPrudForm.value).subscribe(
      (res:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:"Producto actualizado!",
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            location.reload();
          }
        });
        },(err:any)=>{
          const errorServer = JSON.parse(err.error);
          Swal.fire('Error',errorServer.msg,'error');
        }
    );
  }

  //llenar form stock update
  updateStock(id:string){
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
    }else{
      this._productoService.getProducto_id(id).subscribe((res:any)=>{
        this.producto = res.producto;
        this.updateStockForm.setValue({
          stock:this.producto.stock
        });
        $('#editarStock').modal('toggle');
        $('#editarStock').modal('show');
      });
      localStorage.setItem('idProducto',id);
  }
  }

  //actualizar stock
  editarStock(){
    this.stockSubmited = true;
    if(this.updateStockForm.invalid && this.updateStockForm.value.stock<0){
      return;
    }
    this._productoService.update_stock(localStorage.getItem('idProducto'),this.updateStockForm.value)
    .subscribe((res:any)=>{
      Swal.fire({
        icon:'success',
        title:'Exito',
        text:'Stock atualizado!',
        showConfirmButton:false,
        timer:1500
      }).then((result)=>{
        if(result){
          location.reload();
          localStorage.removeItem('idProducto');
        }
      });
    });
  }

  //Validacion de campos
  campoNoValido(campo:string):boolean{

    if(this.registerPrudForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }
  campoStockInvalid(campo:string):boolean{
    if(this.updateStockForm.get(campo).invalid && this.stockSubmited){
      return true;
    }else{
      return false;
    }
  }

  /*Imprimir reportes */
  printReport(){
    printJS({printable: this.datosProductosJSON, properties: [
		  { field: 'codigo', displayName: 'Código'},
      { field: 'titulo', displayName: 'Nombre'},
		  { field: 'descripcion', displayName: 'Descripción'},
      { field: 'stock', displayName: 'Stock'},
      { field: 'precio_compra', displayName: '$ P. Compra'},
      { field: 'precio_venta', displayName: '$ P. Venta'},
      { field: 'createAt', displayName: 'Fecha de registro'}
    ], type: 'json',header:'Listado de Productos'});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('idProducto');
  }

}
