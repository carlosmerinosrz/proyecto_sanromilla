"use strict"; // Activo modo estricto

/**
 * Clase Vista de Inscripción
 */
export class VistaInicio {

    constructor(controlador) {
        this.controlador = controlador;

        // Check if DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.iniciar.bind(this));
        } else {
            this.iniciar();
        }
    }

    /**
     * Método que inicia la vista
     */
    async iniciar() {
        this.datos = await this.controlador.obtenerInformacion();
        console.log(this.datos);
        
        // Assuming this.datos is an array with the first item containing price and image info
        if (this.datos.length > 0) {
            const { precio_camiseta, cartel } = this.datos[0];

            // Update price
            const spanElements = document.querySelectorAll('.preciocamiseta');
            spanElements.forEach(span => {
                span.innerText = `${precio_camiseta}€`;
            });

            // Update image source
            const imgElement = document.getElementById('cartel');
            if (imgElement) {
                imgElement.src = `../sanromilla_admin/src/assets/carrera_archivos/${cartel}`;
            }
        }
    }
}
