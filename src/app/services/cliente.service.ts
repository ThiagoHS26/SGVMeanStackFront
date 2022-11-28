import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { registerClienteForm } from '../interfaces/registerCliente-form.interface';
import { editClienteForm } from '../interfaces/editCliente-form.interface';
import { Observable } from 'rxjs';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http:HttpClient) {
   }
  //obtener usuarios
  get_clientes(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.get(`${URL}clientes`,{headers:headers});
  }

  //crear cliente
  create_cliente(formData:registerClienteForm){

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(`${URL}cliente/registrar/`,formData,{headers:headers});
  }

  //editar cliente
  edit_cliente(id:string,editData:editClienteForm){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.put(`${URL}cliente/editar/${id}`,editData,{headers:headers});

  }

  getCliente_id(id:string){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.get(`${URL}cliente/${id}`,{headers:headers});
  }

  //eliminar cliente
  delete_cliente(id:string){

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.delete(`${URL}cliente/eliminar/${id}`,{headers:headers});
  }

  
}
