export class Compra {
    constructor(
        public _id: string,
        public fecha: string,
        public idproveedor: string,
        public iduser: string,
        public tipo_document:string,
        public factura: string,
        public total: Number
    ){
    }
}