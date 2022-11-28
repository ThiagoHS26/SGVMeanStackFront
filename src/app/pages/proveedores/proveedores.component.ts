import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Subject } from 'rxjs';
import { ProveedorSercice } from 'src/app/services/proveedores.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import * as jQuery from 'jquery';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var $:any;

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  @ViewChild('toogleDNI') toogleDNI!:ElementRef;

  public proveedor;
  public isDisabled=true;
  public datosProveJSON:any;
  public identity;

  dtOptions: DataTables.Settings = {};
  public proveedorCopy:Array<Proveedor>=[];
  proveedores: Proveedor[]=[];
  dtTrigger: Subject<any> = new Subject<any>();


  public registerProvForm = this._fb.group({
    ci:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
    nombres:[{ value: '', disabled: this.isDisabled },Validators.required],
    correo:[{ value: '', disabled: this.isDisabled },[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    empresa:[{ value: '', disabled: this.isDisabled },Validators.required],
    telefono:[{ value: '', disabled: this.isDisabled },Validators.required],
    direccion:[{ value: '', disabled: this.isDisabled },[Validators.required]]
  });
  formSubmited=false;
  public editProvForm = this._fb.group({
    ci:['',[Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
    nombres:['',Validators.required],
    correo:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    empresa:['',Validators.required],
    telefono:['',Validators.required],
    direccion:['',[Validators.required]]
  });
  editSubmited = false;

  constructor(
    private _proveedorService:ProveedorSercice,
    private _fb:FormBuilder,
    private _userService:UsuarioService
  ) { 
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    this.lista_proveedores();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  lista_proveedores(){
    this._proveedorService.get_proveedores().subscribe((res:any)=>{
      this.proveedores = res.proveedores;
      this.datosProveJSON = this.proveedores;
      this.dtTrigger.next();
    });
  }

//registrar proveedor
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

  //validacion de campos
  campoNoValido(campo:string):boolean{

    if(this.registerProvForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }

  }

  campoEditNoValido(campo:string):boolean{
    if(this.editProvForm.get(campo).invalid && this.editSubmited){
      return true;
    }else{
      return false;
    }
  }

  //llenar el formulario
  llenarFormulario(id:string){
    //console.log(id);
    this._proveedorService.getProve_id(id).subscribe(
      (response:any)=>{
        //console.log(response);
        this.proveedor = response.proveedor;
        //console.log(this.proveedor);
        this.editProvForm.setValue({
          ci: this.proveedor.ci,
          nombres:this.proveedor.nombres,
          correo:this.proveedor.correo,
          empresa:this.proveedor.empresa,
          telefono:this.proveedor.telefono,
          direccion:this.proveedor.direccion
        });
      }
    );
    $('#editarProveedor').modal('toggle');
    $('#editarProveedor').modal('show');
    localStorage.setItem('idProveedor',id);
  }

  //editar proveedor
  editarProveedor(){
    this.editSubmited=true;
    if(this.editProvForm.invalid){
      return;
    }
    this._proveedorService.edit_prove(localStorage.getItem('idProveedor'),this.editProvForm.value).subscribe(
      (response:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:'Proveedor actualizado correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
            localStorage.removeItem('idProveedor');
            location.reload();
        });
      },
      (err:any)=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:err.error.msg
        });
      }
    );
  }

  //elminar proveedor
  eliminarProve(id:string){
    //Eliminar de locastorage
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
    }else{
    
    }
    Swal.fire({
      icon:'warning',
      title:'Advertencia',
      text:'Eliminar un proveedor podría alterar los reportes finales',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._proveedorService.delete_prove(id).subscribe(
          (response:any)=>{
            Swal.fire({
              icon:'success',
              title:'Proveedor eliminado correctamente!',
              showConfirmButton:false,
              timer:1500
            }).then((result)=>{
              if(result){
                location.reload();
              }
            });
          }
        );
      }
    });
  }

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
        alert("La cédula ingresada no está verificada!");
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

  //Imprimir tabla 
  printReport(){
    printJS({printable: this.datosProveJSON, properties: [
		  { field: '_id', displayName: 'Código'},
      { field: 'ci', displayName: 'Cédula'},
      { field: 'nombres', displayName: 'Nombres'},
		  { field: 'correo', displayName: 'Email'},
      { field: 'empresa', displayName: 'Empresa'},
      { field: 'telefono', displayName: 'Contacto'},
      { field: 'direccion', displayName: 'direccion'},
      { field: 'createAt', displayName: 'Registro'}
    ], type: 'json',header:'Listado de Proveedores'});
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('idProveedor');
  }

}
