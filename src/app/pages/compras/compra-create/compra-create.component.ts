import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataCompra } from 'src/app/models/dataCompra.model';
import { DetalleCompra } from 'src/app/models/detallecompra.model';
import { Producto } from 'src/app/models/producto.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { CompraService } from 'src/app/services/compras.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorSercice } from 'src/app/services/proveedores.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compra-create',
  templateUrl: './compra-create.component.html',
  styleUrls: ['./compra-create.component.css']
})
export class CompraCreateComponent implements OnInit {

  @ViewChild('toogleDNI') toogleDNI!:ElementRef;

  public isDisabled=true;
  public productosCopy:Array<Producto>=[];
  public fecha;
  public identity;
  public proveedores : any;
  public compra : any ={
    idproveedor:''
  }
  public productos;
  public producto : any = {
    stock:'--|--'
  }
  public total=0;
  public total_compra;
  public proveedorCopy:Array<Proveedor>=[];
  public comprasData:Array<DataCompra> = [];
  public data_detalle:Array<any> = [];
  public detalle: any = {
    idproducto:''
  }

  /*Form Group Proveedores*/
  public registerProvForm = this._fb.group({
    ci:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
    nombres:[{ value: '', disabled: this.isDisabled },Validators.required],
    correo:[{ value: '', disabled: this.isDisabled },[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    empresa:[{ value: '', disabled: this.isDisabled },Validators.required],
    telefono:[{ value: '', disabled: this.isDisabled },Validators.required],
    direccion:[{ value: '', disabled: this.isDisabled },[Validators.required]]
  });
  formSubmited=false;

  constructor(
    private _fb:FormBuilder,
    private _usuarioService:UsuarioService,
    private _productoService:ProductoService,
    private _proveedorService:ProveedorSercice,
    private _router:Router,
    private _compraService:CompraService
  ) { 
    this.identity = _usuarioService.getIdentity();
  }

  ngOnInit(): void {
    let date = new  Date().toLocaleDateString('es-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
    this.fecha = date;
    //proveedor
    this._proveedorService.get_proveedores().subscribe(
      (res:any)=>{
        this.proveedores = res.proveedores;
      }
    );
    //productos
    this._productoService.get_productos().subscribe(
      (res:any)=>{
        this.productos = res.productos;
      }
    );
  }
  //datos de compra
  onSubmit(compraForm){
    if(compraForm.valid){
      var data = {
        idproveedor:compraForm.value.idproveedor,
        iduser:this.identity._id,
        tipo_documento:compraForm.value.tipo_documento,
        factura:compraForm.value.factura,
        detalles : this.data_detalle    
      }
      this._compraService.save_data(data).subscribe(
        (res:any)=>{
          var items = res.compra;
          Swal.fire({
            icon: 'success',
            title: 'Compra registrada!',
            showConfirmButton: false,
            timer: 1500
          }).then((result)=>{
            if(result){
               //localstorage
              var dataCompra = {
                _id:items._id,
                fecha: this.fecha,
                proveedor:items.idproveedor,
                tipo_documento:items.tipo_documento,
                n_documento: items.factura,
                detalles:data.detalles,
                total:items.total
              }
              console.log(dataCompra);
              this.comprasData.push(dataCompra);
              localStorage.setItem('compras',JSON.stringify(this.comprasData));
              this._router.navigate(['/compras']);
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

  //Detalles de la compra 
  save_detalle(detalleForm){
    if(detalleForm.valid){
      this.data_detalle.push({
        idproducto : detalleForm.value.idproducto,
        cantidad : detalleForm.value.cantidad,
        producto : this.producto.titulo,
        precio_compra : this.producto.precio_compra
        });
        this.detalle = new DetalleCompra('','',null,null,'');
        this.producto.stock = '--|--';
        this.total = this.total + (parseFloat(this.producto.precio_compra) * parseInt(detalleForm.value.cantidad));
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

  //obtener productos
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

  eliminar(idx,precio_compra,cantidad){
    this.data_detalle.splice(idx,1);
    this.total = this.total - (parseFloat(precio_compra)*parseInt(cantidad))
  }

  //agregar nuevo proveedor
  crearProveedor(){
    this.formSubmited=true;
    if(this.registerProvForm.invalid){
      return;
    }
    this._proveedorService.create_prov(this.registerProvForm.value).subscribe(
      (response:any)=>{
        Swal.fire({
          icon:'success',
          title:'Exito',
          text:'Proveedor agregado correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            location.reload();
          }
        })
      },
      (err:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:err.error.msg,
          showConfirmButton: false,
          timer: 2500
        });
        location.reload();
      }
    );
  }
  //Validar cedula proveedor
   //Validar cedula
  escribirDNI(dato:string){
    const iconX = this.toogleDNI.nativeElement;
    const cedula:string = dato;
    if(cedula.length === 10){
      //console.log("cedula: "+cedula);
      //Obtener el digito verificador, el 10mo digito de la cedula
      const verifiedDig = cedula.substring(9,10);
      //console.log("Digito verificador: "+verifiedDig);
      //Variables de calculo total
      var sumaImpar = 0;
      var sumaPar = 0;
      var sumaParImpar = 0;
      var modularResult = 0;
      var verfiedNumber = 0;
      //Variables de calculo posiciones impares
      var imparDig_1x2 = 0;
      var imparDig_3x2 = 0;
      var imparDig_5x2 = 0;
      var imparDig_9x2 = 0;
      var imparDig_7x2 = 0;
      //Tomar los valores en las posiciones impares
      const imparDig_1 = cedula.substring(0,1);
      const imparDig_3 = cedula.substring(2,3);
      const imparDig_5 = cedula.substring(4,5);
      const imparDig_7 = cedula.substring(6,7);
      const imparDig_9 = cedula.substring(8,9);
      //Tomar los valores en las posiciones pares
      const parDig_2 = cedula.substring(1,2);
      const parDig_4 = cedula.substring(3,4);
      const parDig_6 = cedula.substring(5,6);
      const parDig_8 = cedula.substring(7,8);
      //console.log(imparDig_1,imparDig_3,imparDig_5,imparDig_7,imparDig_9);
      //POSICIONES IMPARES
      //Multiplicar los valores de posiciones impares x2
      //Si el resultado de la multiplicacion es > 9 restar -9
      imparDig_1x2 = parseInt(imparDig_1)*2;
      if(imparDig_1x2 > 9){ imparDig_1x2=imparDig_1x2 - 9};
      imparDig_3x2 = parseInt(imparDig_3)*2;
      if(imparDig_3x2 > 9){ imparDig_3x2=imparDig_3x2 - 9};
      imparDig_5x2 = parseInt(imparDig_5)*2;
      if(imparDig_5x2 > 9){ imparDig_5x2=imparDig_5x2 - 9};
      imparDig_7x2 = parseInt(imparDig_7)*2;
      if(imparDig_7x2 > 9){ imparDig_7x2=imparDig_7x2 - 9};
      imparDig_9x2 = parseInt(imparDig_9)*2;
      if(imparDig_9x2 > 9){imparDig_9x2=imparDig_9x2 - 9}
      //Sumar el resultado final de multiplicar x2 y restar -9
      sumaImpar=imparDig_1x2+imparDig_3x2+imparDig_5x2+imparDig_7x2+imparDig_9x2;
      //console.log("Suma digitos posiciones impares: "+sumaImpar);
      //POSICIONES PARES
      //Sumar los valores de las posiciones pares
      sumaPar = parseInt(parDig_2) + parseInt(parDig_4) + parseInt(parDig_6) + parseInt(parDig_8);
      //console.log("Suma digitos posiciones pares: "+sumaPar);
      //Sumar el resultado de la suma de posiciones pares e impares
      sumaParImpar = sumaPar + sumaImpar;
      //console.log("Suma par impar: "+sumaParImpar);
      //Sacar el modular 10 de la suma total de numeros impares
      //suma % 10
      modularResult = sumaParImpar % 10;
      //console.log("Modular de la suma final: "+modularResult);
      //Restar 10 menos el resultado del modular
      //El valor arrojado es el verificador de la operacion
      verfiedNumber = 10 - modularResult;
      //console.log("Verificador operador: "+verfiedNumber);
      //Se comprueba si el resultado de la verificacion de la cedula coincide
      //con el digito verificador 
      if(verfiedNumber === parseInt(verifiedDig)){
        iconX.classList.remove('fa-triangle-exclamation');
        iconX.classList.add('fa-check');
        this.isDisabled=false;
        this.registerProvForm.controls['nombres'].enable();
        this.registerProvForm.controls['correo'].enable();
        this.registerProvForm.controls['direccion'].enable();
        this.registerProvForm.controls['empresa'].enable();
        this.registerProvForm.controls['telefono'].enable();
      }else{
        console.log("La cedula no está verificada");
        this.isDisabled=true;
        this.registerProvForm.controls['nombres'].disable();
        this.registerProvForm.controls['correo'].disable();
        this.registerProvForm.controls['direccion'].disable();
        this.registerProvForm.controls['empresa'].disable();
        this.registerProvForm.controls['telefono'].disable();
      }

    }else{
      this.isDisabled=true;
      iconX.classList.add('fa-triangle-exclamation');
      console.log("Ingresa la cedula");
      this.registerProvForm.controls['nombres'].disable();
      this.registerProvForm.controls['correo'].disable();
      this.registerProvForm.controls['direccion'].disable();
      this.registerProvForm.controls['empresa'].disable();
      this.registerProvForm.controls['telefono'].disable();
    }

  }
  
  //validar campos Form proveedor
  campoNoValido(campo:string):boolean{

    if(this.registerProvForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }

  }

}
