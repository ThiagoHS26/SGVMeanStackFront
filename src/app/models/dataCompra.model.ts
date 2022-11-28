export class DataCompra {
    constructor(
        public _id: string,
        public fecha: string,
        public tipo_documento:string,
        public proveedor:string,
        public n_documento: string,
        public total: Number,
        public detalles:object
    ){
    }
}