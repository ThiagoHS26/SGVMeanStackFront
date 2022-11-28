export class DetalleCompra{
    constructor(
        //atributos
    public _id:string,
    public idproducto: string,
    public cantidad: string,
    public subtotal: number,
    public compra: string
    //agregar imagen de la factura (opcional)
    ){}
}