"use strict" //activo modo estricto

/**
 * Clase Fotos de Admin
 */
export class Correos {

    constructor(controlador) {
        this.controlador = controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar() {


        this.montarNav()

        //Guardar página para recargar
        this.saveViewState();

        // document.getElementById('btn-crear-usuario').addEventListener('click', (event) =>
        //     this.crearUsuario()
        // );
    }



    /**
     * Para mostrar el item del navbar activo
     */
    montarNav(){
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.add('active');
        document.getElementById('linkMarcas').classList.remove('active');
    }

    /**
     * Guarda la vista antes de recargar
     */
    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

}