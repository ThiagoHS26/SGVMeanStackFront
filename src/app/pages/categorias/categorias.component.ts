import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit, OnDestroy {

  public identity;
  public categoria;
  dtOptions: DataTables.Settings = {};
  public categoriasCopy :Array<Categoria>=[];
  categorias: Categoria[]=[];
  dtTrigger: Subject<any> = new Subject<any>();

  //Form Group
  public registerCategoriaForm = this._fb.group({
    titulo:['',[Validators.required]],
    descripcion:['',[Validators.required]]
  });
  formSubmitted=false;

  constructor(
    private _categoriaService:CategoriaService,
    private _userService:UsuarioService,
    private _router:Router,
    private _fb:FormBuilder,
  ) { 
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {
    if(this.identity.role!='ADMIN'){
      alert("No tienes autorización!");
      this._router.navigate(['/dashboard']);
    }
    this.listar_categorias();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive:true,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  listar_categorias(){
    this.categoriasCopy = JSON.parse(localStorage.getItem('categorias'));
    if(this.categoriasCopy===null){
      this.categoriasCopy=[];
    }
    this._categoriaService.get_categorias().subscribe((res:any)=>{
      //console.log(res);
      this.categorias =res.categorias;
      
      this.dtTrigger.next();
      //console.log(res);
    });
  }

  //crear categoria
  crearCategoria(){
    this.formSubmitted=true;
    if(this.registerCategoriaForm.invalid){
      return;
    }
    this._categoriaService.create_categoria(this.registerCategoriaForm.value).subscribe(
      (response:any)=>{
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:'Categoría agregada correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            location.reload();
          }
        });
      },
      error=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'No pudo completarse la petición!',

        });
      }
    );

  }

  //editar categoria
  editarCategoria(){
    this._categoriaService.edit_categoria(localStorage.getItem('idCate'),this.registerCategoriaForm.value).subscribe(
      (response:any)=>{
        //console.log(response);
        Swal.fire({
          icon:'success',
          title:'Éxito',
          text:'Categoría actualizada correctamente!',
          showConfirmButton:false,
          timer:1500
        }).then((result)=>{
          if(result){
            location.reload();
          }
        });
      },
      error=>{
        Swal.fire({
          icon:'error',
          title:'Error',
          text:'No se pudo completar la petición!'
        });
      }
    );
  }

  //eliminar categoria
  eliminarCategoria(id:string){
    Swal.fire({
      icon:'warning',
      title:'Advertencia',
      text:'Seguro que quieres eliminar esta categoría?',
      showCancelButton:true,
      confirmButtonText:'Confirmar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._categoriaService.delete_categoria(id).subscribe(
          (response:any)=>{
            Swal.fire({
              icon:'success',
              title:'Categoría eliminada correctamente!',
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

  //llenar formulario
  llenarFormulario(id:string){
    this._categoriaService.getCategoria_id(id).subscribe(
      (response:any)=>{
        //console.log(response);
        this.categoria = response.categoria;
        this.registerCategoriaForm.setValue({
          titulo:this.categoria.titulo,
          descripcion:this.categoria.descripcion
        });
      }
    );
    $('#editarCategoria').modal('toggle');
    $('#editarCategoria').modal('show');
    localStorage.setItem('idCate',id);
    $("#agregarCategoria").find("input,textarea,select").val("");
  }

  //validacion de campos
  campoNoValido(campo:string):boolean{

    if(this.registerCategoriaForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    localStorage.removeItem('idCate');
  }

}
