"use strict" //activo modo estricto

/**
 * Clase de la Vista Pago
 */
export class VistaPago{
    constructor(controlador,inscripciones, correo){
        this.inscripciones=inscripciones
        this.controlador=controlador
        this.correo=correo
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista y genera el código de inscripción
     * Lo manda al controlador para que lo inserte
     */
    async iniciar(){
        console.log(this.correo)
        this.codigo=document.getElementById('codigo')
        this.codigo.textContent='espere...'
        this.codigo_inscripcion=Math.floor(Math.random() * 99999);
        let valores=await this.controlador.sacarCodigos()
        // Guardamos los codigos que están en la base de datos en un set
        this.introducidos=new Set(valores)

        // Comprobamos que si el que se ha generado existe, vuelva a generar otro
        while(this.introducidos.has(this.codigo_inscripcion)){
            this.codigo_inscripcion=Math.floor(Math.random() * 99999);
        }

        // Lo insertamos en la vista
        this.codigo.textContent=this.codigo_inscripcion
        // Introducimos el codigo en el registro de la inscripción
        await this.controlador.insertarInscripciones(this.inscripciones, this.codigo_inscripcion, this.correo)
        
    }
}