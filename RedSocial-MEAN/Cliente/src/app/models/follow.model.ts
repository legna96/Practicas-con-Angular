export class Follow{

    /**
     * Constructor para crear un nuevo follow
     * @param _id vacio, generado por mongo
     * @param user id usuario que sigue
     * @param followed id usuario que es seguido
     */
    constructor(
        public _id:string,
        public user:string,
        public followed:string
    ){

    }
}