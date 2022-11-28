import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { registerUserForm } from '../interfaces/registerUser-form.interface';
import { editUserForm } from '../interfaces/editUser-form.interface';
import { emailFormInt } from '../interfaces/sendEmail-form.interface';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public token;
  public identity;

  constructor(private _http:HttpClient) {
   
  }
  login(formData:LoginForm):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(`${URL}login`,formData,{headers:headers});
  }
 //obtener token
 getToken():Observable<any>{
  let token = localStorage.getItem('token');
  if(token){
    this.token = token;
  }else{
    this.token = null;
  }
  return this.token;
}
getIdentity():Observable<any>{
  let identity = JSON.parse(localStorage.getItem('identity'));
  if(identity){
    this.identity = identity;
  }else{
    this.identity = null;
  }
  return this.identity;
}
  obtenerUsuarios(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(`${URL}usuarios`);
  }

  //crear usuarios
  create_user(formData:registerUserForm){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(`${URL}registrar`,formData,{headers:headers});
  }

  //editar usuario
  getUser_id(id:string){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(`${URL}/usuario/${id}`,{headers:headers});
  }

  edit_user(id:string,editData:editUserForm){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.put(`${URL}usuario/editar/${id}`,editData,{headers:headers});
  }

  //eliminar usuario
  delete_user(id):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.delete(`${URL}usuario/eliminar/${id}`,{headers:headers});
  }

}
