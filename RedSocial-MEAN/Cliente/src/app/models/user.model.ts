export class User{

    /**
     * Constructor para crear un nuevo usuario
     * @param _id 
     * @param name nombre de usuario
     * @param surname apellidos de usuario
     * @param nick apodo de usuario
     * @param email correo de usuario
     * @param password contraseña de usuario
     * @param role role de usuario
     * @param image avatar de usuario
     */
    constructor(
        public _id:string,
        public name:string,
        public surname:string,
        public nick:string,
        public email:string,
        public password:string,
        public role:string,
        public image:string
    ){}
}