export class DetalleVenta {
    constructor(
        public _id: string,
        public idproducto: string,
        public cantidad: number,
        public subtotal: number,
        public venta:string
    ){

    }
}