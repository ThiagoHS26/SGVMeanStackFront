export class DataVenta {
    constructor(
        public _id: string,
        public fecha: string,
        public tipo_documento:string,
        public n_documento: string,
        public total: Number,
        public detalles:object
    ){
    }
}