import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  @ViewChild('password') passwordRef!:ElementRef;
  @ViewChild('tooglePassword') tooglePasswordRef!:ElementRef;

  public user;
  public token;
  public identity;

  public loginForm = this._fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', [Validators.required]],
    remember: [false]
  });
  formSubmited=false;
  constructor(
    private _fb:FormBuilder,
    private _userService:UsuarioService,
    private _router:Router
    ) { 
      this.user = new Usuario('','','','','','');
      this.identity = _userService.getIdentity();
    }

  ngOnInit(): void {
  }

  login(){
    this.formSubmited=true;
    if(this.loginForm.invalid){
      return;
    }

    this._userService.login(this.loginForm.value).subscribe(
      response=>{
        this.token = response.jwt;
        localStorage.setItem('token',this.token);
        localStorage.setItem('identity',JSON.stringify(response.user));
        if(this.loginForm.get('remember').value){
          localStorage.setItem('email',this.loginForm.get('email').value);
        }else{
          localStorage.removeItem('email');
        }
        this._router.navigate(['dashboard']);
    },
    (err:any) =>{
      Swal.fire({
        icon:'error',
        title:'Error',
        text:err.error.msg
      });
    });
      //redireccion
      //this._router.navigateByUrl('/dashboard');
  }

  //validar campos
  campoNoValido(campo:string):boolean{

    if(this.loginForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }

  }
  //ver contraseña
  verPass(){
    const inputPass = this.passwordRef.nativeElement;
    const iconEye = this.tooglePasswordRef.nativeElement;

    if(inputPass.getAttribute('type')==='password'){
      inputPass.setAttribute('type','text');
      iconEye.classList.remove('fa-eye-slash');
      iconEye.classList.add('fa-eye');
    }else{
      inputPass.setAttribute('type','password');
      iconEye.classList.remove('fa-eye');
      iconEye.classList.add('fa-eye-slash');
    }
  }
}
