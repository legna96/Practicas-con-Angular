export class Publication{

    /**
     * Contructor para una nueva publicacion
     * @param _id debe ir vacio, generado por mongo
     * @param text texto de la publicacion
     * @param file archivo para la publicacion
     * @param created_at hora de cracion
     * @param user id del usuario de la publicacion
     */
    constructor(
        public _id:string,
        public text:string,
        public image:string,
        public created_at:string,
        public user:string
    ){}
}