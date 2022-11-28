import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';

const routes:Routes=[
  {path:'login',component:LoginComponent},
  {path:'forgot-pass',component:ForgotPassComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AuthRoutingModule { }
