import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';
import { map, filter} from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnDestroy{
  public titulo?:string;
  public tituloSubs$:Subscription;//xjs cada susbripcion mantiene en la memoria

  constructor(private router:Router) {
    this.tituloSubs$ = this.getArgumentos().subscribe(({titulo})=>{
      this.titulo = titulo;
      document.title = `
        AdminSGV | ${titulo}
      `;
    })
   }
  
  ngOnDestroy(): void {//para evitar las fugas de memoria
    this.tituloSubs$.unsubscribe;
  }

  getArgumentos(){
    return this.router.events.pipe(
      filter((event:any)=> event instanceof ActivationEnd),//Durante cada navegacion 
      filter((event:ActivationEnd)=>event.snapshot.firstChild === null),//Ver que esta mandando y guardar las capturas de pantalla
      map((event:ActivationEnd)=> event.snapshot.data)//Si es nulo mostrar lo que viene del data de pages-routing.module.ts
    )
  }

}
