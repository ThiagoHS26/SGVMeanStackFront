export class Usuario{
    constructor(
        public _id:string,
        public nombres: string,
        public email: string,
        public usuario: string,
        public password: string,
        public role: string,
    ){

    }
}