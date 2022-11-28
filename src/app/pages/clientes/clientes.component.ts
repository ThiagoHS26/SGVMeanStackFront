import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { Subject } from 'rxjs'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jQuery from 'jquery';
import Swal from 'sweetalert2';
import * as printJS from 'print-js';
import { VentaService } from 'src/app/services/ventas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

declare var $:any;

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, OnDestroy {

  @ViewChild('toogleDNI') toogleDNI!:ElementRef;

  public identity;
  public isDisabled=true;
  public cliente;
  public puntos_compra;
  public datosClientesJSON:any;
  dtOptions: DataTables.Settings = {};
  public clientesCopy :Array<Cliente>=[];
  clientes:Cliente[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  //Form group
  public registerClienteForm = this._fb.group({
    ci:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    nombres:[{ value: '', disabled: this.isDisabled },[Validators.required]],
    correo:[{ value: '', disabled: this.isDisabled },[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    direccion:[{ value: '', disabled: this.isDisabled },[Validators.required]]
  });
  formSubmited=false;
  /*Form edit group */
  public editClienteForm = this._fb.group({
    ci:['',[Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    nombres:['',[Validators.required]],
    correo:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    direccion:['',[Validators.required]]
  });
  editSubmited=false;
  constructor(
    private _clienteService:ClienteService,
    private _usuarioService:UsuarioService,
    private _fb:FormBuilder
  ) { 
    this.identity = this._usuarioService.getIdentity();
  }
  
  ngOnInit(): void {
    this.listar_clientes();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  listar_clientes(){
    this._clienteService.get_clientes().subscribe((res:any)=>{
      this.clientes = res.clientes;
      this.datosClientesJSON = this.clientes;
      this.dtTrigger.next();
    });
  }

  //Registrar clientes
  crearClientes(){

    this.formSubmited=true;
    if(this.registerClienteForm.invalid){
      return;
    }

    this._clienteService.create_cliente(this.registerClienteForm.value).subscribe(
      (res:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:'Cliente agregado correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            location.reload();
          }
        });
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

  //Editar cliente
  llenarForm(id:string){
    this._clienteService.getCliente_id(id).subscribe(
      (response:any)=>{
        this.cliente = response.cliente;
        this.editClienteForm.setValue({
          ci: this.cliente.ci,
          nombres: this.cliente.nombres,
          correo: this.cliente.correo,
          direccion: this.cliente.direccion
        });
        $('#editarCliente').modal('toggle');
        $('#editarCliente').modal('show');
      }
    );
    localStorage.setItem('idCliente',id);

  }

  editarCliente(){
    this.editSubmited=true;
    if(this.editClienteForm.invalid){
      return;
    }
    this._clienteService.edit_cliente(localStorage.getItem('idCliente'),this.editClienteForm.value).subscribe(
      (response:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:'Clientes actualizado correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            localStorage.removeItem('idCliente');
            location.reload();
          }
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

  //eliminar cliente
  eliminarCliente(id:string){
    //Eliminar de localstorage
    if(this.identity.role!='ADMIN'){
      alert("No estas autorizado!");
    }else{
    
    }
    Swal.fire({
      icon:'warning',
      title:'Advertencia',
      text:'Eliminar un cliente podría alterar los reportes finales',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._clienteService.delete_cliente(id).subscribe((res:any)=>{
          Swal.fire({
            icon:'success',
            title:'Cliente eliminado correctamente',
            confirmButtonText:'Ok'
          }).then((result)=>{
            if(result){
              location.reload();
            }
          });
        });
      }
    });
  }

  campoNoValido(campo:string):boolean{

    if(this.registerClienteForm.get(campo).invalid && this.formSubmited ){
      return true;
    }else{
      return false;
    }

  }
  //campo no valido editar
  campoEditNoValido(campo:string):boolean{
    if(this.editClienteForm.get(campo).invalid && this.editSubmited){
      return true;
    }else{
      return false;
    }
  }

  //verificacion de cedula
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
        this.registerClienteForm.controls['nombres'].enable();
        this.registerClienteForm.controls['correo'].enable();
        this.registerClienteForm.controls['direccion'].enable();

      }else{
        alert("La cédula ingresada no está verificada!");
        console.log("La cedula no está verificada");
        this.isDisabled=true;
        this.registerClienteForm.controls['nombres'].disable();
        this.registerClienteForm.controls['correo'].disable();
        this.registerClienteForm.controls['direccion'].disable();
      }

    }else{
      this.isDisabled=true;
      iconX.classList.add('fa-triangle-exclamation');
      console.log("Ingresa la cedula");
      this.registerClienteForm.controls['nombres'].disable();
      this.registerClienteForm.controls['correo'].disable();
      this.registerClienteForm.controls['direccion'].disable();
    }

  }
  
  //impirmir tabla de clientes
  printReport(){
    printJS({printable: this.datosClientesJSON, properties: [
		  { field: '_id', displayName: 'Código'},
      { field: 'ci', displayName: 'Cédula'},
      { field: 'nombres', displayName: 'Nombres'},
		  { field: 'correo', displayName: 'Email'},
      { field: 'direccion', displayName: 'direccion'},
      { field: 'createAt', displayName: 'Registro'}
    ], type: 'json',header:'Listado de Clientes'});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('idCliente');
  }
  
}
