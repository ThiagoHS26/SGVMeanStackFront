export class Producto{
    constructor(
        //atributos
    public _id:string,
    public codigo: String,
    public titulo: String,
    public descripcion: String,
    public marca:String,
    public precio_compra: Number,
    public precio_venta: Number,
    public stock: Number,
    public idcategoria: String
    ){}
}