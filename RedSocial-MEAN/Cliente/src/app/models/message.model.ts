export class Message{

    /**
     * Constructor para crear un nuevo mensaje
     * @param _id debe ir vacio, generado por mongo
     * @param text texto del mensaje
     * @param viewed indica si se ha visto el mensaje
     * @param created_at hora de creacion
     * @param emitter id de quien envia mensaje
     * @param receiver id de quien recibe el mensaje
     */
    constructor(
        public _id:string,
        public text:string,
        public viewed:string,
        public created_at:string,
        public emitter:string,
        public receiver:string
    ){

    }
}