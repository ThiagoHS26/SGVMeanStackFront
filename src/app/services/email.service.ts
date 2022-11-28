import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { emailFormInt } from '../interfaces/sendEmail-form.interface'

//Http://localhost:3443
const URL = 'https://localhost:4334/';

@Injectable({
    providedIn: 'root'
})

export class EmailService {
    constructor (private _http:HttpClient){}

    //Recuperar contraseña
    send_pass(formData:emailFormInt):Observable<any>{
        
        return this._http.post(`${URL}`,formData);
    }
}