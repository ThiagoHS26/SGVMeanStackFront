import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { registerProdInterface } from '../interfaces/registerProducto-form.interface';
import { Observable } from 'rxjs';
import { editProdInterface } from '../interfaces/editProducto-form.interface';
import { editStockForm } from '../interfaces/editStock-form.interface';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class ProductoService {
    constructor(private _http:HttpClient) {
    }

    //obtener categorias 
    get_productos():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}productos`,{headers:headers});
    }     
    
    //registrar producto
    insert_producto(formData:registerProdInterface):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}producto/registrar`,formData,{headers:headers});
    }

    //obtener producto por ID
    getProducto_id(id:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}producto/${id}`,{headers:headers});
    }

    //update producto
    update_producto(id:string,editData:editProdInterface):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(`${URL}producto/editar/${id}/`,editData);
    }

    //eliminar producto
    delete_producto(id:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.delete(`${URL}producto/${id}`,{headers:headers});
    }
    //editar stock
    update_stock(id:string,data:editStockForm):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.put(`${URL}producto/stock/${id}/`,data,{headers:headers});
    }

}