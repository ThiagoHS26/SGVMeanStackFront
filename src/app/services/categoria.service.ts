import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { registerCategoriaInt } from '../interfaces/registerCategoria-form.interface';
import { editCategoriaInt } from '../interfaces/editCategoria-form.interface';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class CategoriaService {
    constructor(private _http:HttpClient) {
    }

    //obtener categorias 
    get_categorias(){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}categorias`);
    }     
    //Crear categorias
    create_categoria(formData:registerCategoriaInt){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}categoria/registrar`,formData,{headers:headers});
    }

    //Editar 
    edit_categoria(id:string,editData:editCategoriaInt){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(`${URL}categoria/editar/${id}`,editData,{headers:headers});
    }

    //obtener categoria por id
    getCategoria_id(id:string){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}categoria/${id}`,{headers:headers});
    }

    //eliminar categoria
    delete_categoria(id:string){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(`${URL}categoria/eliminar/${id}`,{headers:headers});
    }

}
