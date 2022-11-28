import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
//import * as $ from 'jquery';

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public usuario;
  public identity;
  public token;
  menuItems:any[];

  constructor(private sidebarService: SidebarService, private router:Router, private _userService:UsuarioService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    //this.menuItems = this.sidebarService.menu;
    //console.log(this.menuItems);
   }

  ngOnInit(): void {
    //$('[data-widget="treeview"]').Treeview('init');
    //$("li").removeClass("menu-is-opening menu-open");
  }
  /*Cerrar sesion */
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.router.navigate(['/login']);
    this.token = null;
    this.identity = null;
  }

}
