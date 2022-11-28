export class Venta {
    constructor(
        public _id: string,
        public fecha: string,
        public idcliente: string,
        public iduser: string,
        public total: Number
    ){

    }
}