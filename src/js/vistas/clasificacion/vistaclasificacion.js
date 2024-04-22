"use strict" //activo modo estricto
/**
 * Clase Vista de Clasificación
 */
export class VistaClasificacion{
    constructor(controlador){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 250)
    }

    /**
     * Método que inicia la vista 
     */
    async iniciar(){
        this.clasificaciones= await this.controlador.getClasificacion()
        if(this.clasificaciones.length>0){
            console.log('hay cosiiis')
        }
        else{
            console.log('no hay')
            let div=document.getElementsByClassName('container')[0]
            console.log(div)
            let h6=document.createElement('h4')
            h6.classList.add('mt-4')
            h6.id='fotosNada'
            h6.textContent='Ups... aún no hay clasificación disponible. Pero ¡no te preocupes! Después de la carrera podrás ver en qué posición has quedado.'
            div.appendChild(h6)
            let divFoto=document.createElement('div')
            divFoto.id='divFotoNada'
            div.appendChild(divFoto)
        }
    }
}