import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  public mailForm = this._fb.group({
    email:['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
  });
  formSubmited=false;
  constructor(
    private _emailService:EmailService,
    private _fb:FormBuilder
  ) { }

  ngOnInit(): void {
  }

  send_email(){
    this.formSubmited=true;
    if(this.mailForm.invalid){
      return;
    }
    this._emailService.send_pass(this.mailForm.value).subscribe(
      (res:any)=>{
        console.log(res);
      }
    );
  }

  campoNoValido(campo:string):boolean{

    if(this.mailForm.get(campo).invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }

  }

}
