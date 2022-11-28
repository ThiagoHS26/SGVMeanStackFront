import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Subject } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as printJS from 'print-js';
import * as jQuery from 'jquery';
import Swal from 'sweetalert2';

declare var $:any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public user;
  public identity;
  public datosUsuriosJSON:any;
  dtOptions: DataTables.Settings = {};
  public usuariosCopy: Array<Usuario>=[];
  usuarios: Usuario[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  formSubmited = false;
  //Form Group
  public registerUserForm = this._fb.group({
    nombres:['',[Validators.required]],
    email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    usuario:['',[Validators.required, Validators.maxLength(10)]],
    password:['',[Validators.required]],
    passwordConfirm:['',[Validators.required]],
    role:['',Validators.required]
  },{
    validators: this.passwordIguales('password','passwordConfirm')
  });
  //Form Group Edit user
  public editUserForm = this._fb.group({
    nombres:['',[Validators.required]],
    email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    usuario:['',[Validators.required, Validators.maxLength(10)]],
    password:[''],
    passwordConfirm:[''],
    role:['',Validators.required]
  },{
    validators: this.passwordIguales('password','passwordConfirm')
  });
  editSubmited=false;

  constructor(private usuarioSvc:UsuarioService,  
    private router:Router,
    private _fb:FormBuilder) { 
      this.identity = usuarioSvc.getIdentity();
    }

  ngOnInit(): void {
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
      this.router.navigate(['/dashboard']);
    }
    //console.log(this.formSubmited);
    this.obtenerUsuario();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  obtenerUsuario(){
    this.usuariosCopy = JSON.parse(localStorage.getItem('usuarios'));
    if(this.usuariosCopy===null){
      this.usuariosCopy=[];
    }
    this.usuarioSvc.obtenerUsuarios().subscribe((res:any)=>{
      //console.log(res);
      this.usuarios =res.usuarios;
      this.datosUsuriosJSON = this.usuarios;
      this.dtTrigger.next();
    });
  }

  crearUsuarios(){
    this.formSubmited = true;
    if(this.registerUserForm.invalid){
      return;
    }
    this.usuarioSvc.create_user(this.registerUserForm.value).subscribe((res:any)=>{
      Swal.fire({
        icon:'success',
        title:'Exito',
        text:'Usuario creado correctamente!',
        showConfirmButton:false,
        timer:1500
      }).then((result)=>{
        if(result){
          const item = res.user;
          this.usuariosCopy.push(item);
          localStorage.setItem('usuarios',JSON.stringify(this.usuariosCopy));
          location.reload();
        }
      })
    },(err:any)=>{
      //console.log(err);
      Swal.fire({
        icon:'error',
        title:'Error',
        text:err.error.msg
      });
    });
  }

  campoNoValido(campo:string):boolean{

    if(this.registerUserForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }

  }
  campoEditNoValido(campo:string):boolean{
    if(this.editUserForm.get(campo).invalid && this.editSubmited){
      return true;
    }else{
      return false;
    }
  }

  passwordIguales(pass1Name:string, pass2Name:string){
    return (formGroup : FormGroup)=>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }

    }
  }

  editarUsuario(){
    this.editSubmited=true;
    if(this.editUserForm.invalid){
      return;
    }
    this.usuarioSvc.edit_user(localStorage.getItem('idUser'),this.editUserForm.value).subscribe((res:any)=>{ 
      //local storage editar
        const item = res.user;
        var dataForm = this.editUserForm.value;
        if(dataForm.password != "" && dataForm.confirmPassword != ""){
          var array = {
            _id:item._id,
            nombres: dataForm.nombres,
            usuario: dataForm.usuario,
            email: dataForm.email,
            password: item.password,
            role: dataForm.role,
            createAt:item.createAt
          };
        }else{
          var array = {
            _id:item._id,
            nombres: dataForm.nombres,
            usuario: dataForm.usuario,
            email: dataForm.email,
            password: item.password,
            role: dataForm.role,
            createAt:item.createAt
          };
        }
        let indexArray;
        this.usuariosCopy.forEach((element,index)=>{
          if(element._id === item._id){
            indexArray=index;
          }
        });
        this.usuariosCopy[indexArray] = array;
        localStorage.setItem('usuarios',JSON.stringify(this.usuariosCopy));
      //localstorage
      //Edicion en mongo
      Swal.fire({
        icon:'success',
        title:'Exito',
        text:'Usuario actualizado!',
        showConfirmButton:false,
        timer:1500
      }).then((result)=>{
        if(result){
          localStorage.removeItem('idUser');
          localStorage.removeItem('userId');
          location.reload();
        }
      });
    },(err)=>{
      Swal.fire({
        icon:'error',
        title:'Error',
        text:err.error.msg
      });
    });
  }

  llenarForm(id:string){
    //console.log(id);
    this.usuarioSvc.getUser_id(id).subscribe(
      (response:any)=>{
        this.user = response.user;
        this.editUserForm.setValue({
          nombres:this.user.nombres,
          email:this.user.email,
          usuario:this.user.usuario,
          password:'',
          passwordConfirm:'',
          role:this.user.role
        });
        $('#editarUsuario').modal('toggle');
        $('#editarUsuario').modal('show');
        localStorage.setItem('idUser', this.user._id);
      },
      (err:any)=>{
        console.log(err);
        alert(err);
      }
    );
    $("#agregarUsuario").find("input,textarea,select").val("");
  }

  eliminarUsuario(id:string){
    //eliminar del array
    if(id === this.identity._id){
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'Imposible eliminar un usuario activo!',
        showConfirmButton:false,
        timer:2500
      });
    }else{
      var indexArray;
      this.usuariosCopy.forEach((element,index)=>{
        if(id === element._id){
          indexArray = index;
        }else{
          Swal.fire({
            icon:'error',
            title:'Error',
            text:'No existe el usuario!',
            showConfirmButton:false,
            timer:1500
          });
        }
      });
      if(indexArray!=null){
        Swal.fire({
          icon:'warning',
          title:'Seguro que quieres eliminar este usuario?',
          showCancelButton:true,
          confirmButtonText:'Confirmar'
        }).then((result)=>{
          if(result.isConfirmed){
            Swal.fire({
              icon:'success',
              title:'Éxito',
              text:'Usuario eliminado correctamente',
              showConfirmButton:false,
              timer:1500
            });
            this.usuariosCopy.splice(indexArray,1);
            localStorage.setItem('usuarios',JSON.stringify(this.usuariosCopy));
          }
        });
      }
    }
    //Eliminar de mongo
    /*if(id === this.identity._id){
      Swal.fire({
        icon:'error',
        title:'Error',
        text:'Imposible eliminar un usuario activo!'
      });
    }else{
        Swal.fire({
        icon:'question',
        title:'¿Seguro que quieres eliminar a este usuario?',
        showCancelButton:true,
        confirmButtonText:'Confirmar'}).then((result)=>{
          if(result.isConfirmed){
            this.usuarioSvc.delete_user(id).subscribe(
              (response:any)=>{
                Swal.fire({
                  icon:'success',
                  title:'Éxito',
                  text:'Usuario eliminado correctamente',
                  confirmButtonText:'OK'
                }).then((result)=>{
                  if(result){
                    location.reload();}
                })
              }
            );
          }
        })
    }*/
  }
  //imprimir tabla de usuarios
  printReport(){
    printJS({printable: this.datosUsuriosJSON, properties: [
		  { field: '_id', displayName: 'Código'},
      { field: 'nombres', displayName: 'Nombres'},
		  { field: 'email', displayName: 'Email'},
      { field: 'usuario', displayName: 'Usuario'},
      { field: 'role', displayName: 'Role'},
      { field: 'createAt', displayName: 'Registro'}
    ], type: 'json',header:'Listado de Usuarios'});
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  
}
