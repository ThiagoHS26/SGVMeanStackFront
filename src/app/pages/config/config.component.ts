import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public categoriasList:Array<Categoria>=[];
  public categorias;

  constructor(private _categoriaService:CategoriaService) { }

  ngOnInit(): void {
    this.get_categorias();
  }
  //traer los datos de categorias
  get_categorias(){
    this._categoriaService.get_categorias().subscribe((res:any)=>{
      
    });
    
  }

}
