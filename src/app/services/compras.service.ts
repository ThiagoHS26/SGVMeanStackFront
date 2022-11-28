import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class CompraService {
    constructor(private _http:HttpClient) {
    }

    //obtener categorias 
    get_compras():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}compras`,{headers:headers});
    }  
    
    save_data(data):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}compra/registrar/`,data,{headers:headers});
    }
    
    data_compra(id:string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}compra/${id}`,{headers:headers});
    }

}