import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { reporteVentasForm } from '../interfaces/reporteVentas-form.interface';

//Http://localhost:3000
const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class VentaService {
    constructor(private _http:HttpClient) {
    }

    //obtener categorias 
    get_ventas():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.get(`${URL}ventas`,{headers:headers});
    } 
    
    save_data(data):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
        return this._http.post(`${URL}venta/registrar/`,data,{headers:headers});
    }
    
    data_venta(id):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(`${URL}venta/${id}`,{headers:headers});
    }
    //reporte ventas
    reporte_ventas(formData:reporteVentasForm):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this._http.get(`${URL}/ventas/reporte/${formData}`,{headers:headers});
    }

}