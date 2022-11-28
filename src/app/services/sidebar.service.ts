import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

    menu:any=[{
      titulo:'Dashboard',
      icono:'nav-icon fas fa-tachometer-alt',
      submenu:[
        {titulo:'Usuarios', url:'usuarios', icono:'fa fa-user-circle'},
        {titulo:'Productos', url:'productos', icono:'fa fa-cubes'},
        {titulo:'Clientes', url:'clientes', icono:'fa fa-users'},
        {titulo:'Compras', url:'compras', icono:'fa fa-shopping-basket'},
        {titulo:'Ventas', url:'ventas', icono:'fa fa-calculator'}
      ]
    }]

}
