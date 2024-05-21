"use strict"; // Activo modo estricto

/**
 * Clase Vista de Inscripción
 */
export class VistaInicio {

    constructor(controlador) {
        this.controlador = controlador;
        document.addEventListener('DOMContentLoaded', this.iniciar.bind(this));
    }

    /**
     * Método que inicia la vista
     */
    async iniciar() {
        this.datos = await this.controlador.obtenerInformacion();
        console.log(this.datos);
        
        // Assuming this.datos is an array and we want the first item
        if (this.datos.length > 0) {
            const precioCamiseta = this.datos[0].precio_camiseta;
            const spanElements = document.querySelectorAll('.preciocamiseta');
            spanElements.forEach(span => {
                span.innerText = `${precioCamiseta}€`;
            });
        }
    }
}
