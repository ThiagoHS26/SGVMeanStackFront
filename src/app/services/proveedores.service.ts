import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { registerClienteForm } from '../interfaces/registerCliente-form.interface';
import { editProvForm } from '../interfaces/editProve-form.interface';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class ProveedorSercice {
    constructor(private _http:HttpClient) {
    }

    //obtener categorias 
    get_proveedores(){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}proveedores`);
    }
    
    //Crear proveedor
    create_prov(formData:registerClienteForm){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}proveedor/registrar`,formData,{headers:headers});
    }
    //obtener proveedor por id
    getProve_id(id:string){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}proveedor/${id}`,{headers:headers});
    }
    
    //editar proveedor
    edit_prove(id:string, editData:editProvForm){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(`${URL}proveedor/editar/${id}`,editData,{headers:headers});
    }

    //eliminar proveedor
    delete_prove(id:string){
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(`${URL}proveedor/eliminar/${id}`,{headers:headers});
    }

}
