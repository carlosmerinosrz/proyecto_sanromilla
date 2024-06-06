"use strict" //activo modo estricto
/**
 * Clase nuevasanromilla
 */
export class Nuevasanromilla {
      
    constructor(controlador){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador 
     */
    async iniciar(controlador){
        this.div = document.getElementById('nuevasanromilla');
        this.activeNavbar();
    
        // Guardar página para recargar
        this.saveViewState();
    
        this.newSanRomilla = document.getElementById('newSanRomilla');
        this.newSanRomilla.addEventListener('click', () => {
            this.eliminarSanRomilla();
        });
    }
    
    async eliminarSanRomilla(){
        Swal.fire({
            title: '¿Está seguro?',
            text: "Todos los datos de la San Romilla serán eliminados y no podrán ser recuperados",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, lo estoy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.controlador.eliminarSanRomilla();
                    Swal.fire(
                        '¡Eliminado!',
                        'Las inscripciones se han eliminado correctamente',
                        'success'
                    );
                    this.buscarInscripciones();
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar todas las inscripciones. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    activeNavbar(){
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.remove('active');
        document.getElementById('linkTallas').classList.remove('d-none');
        document.getElementById('linkNuevaSanRomilla').classList.add('d-none');
    }

    /**
     * Método que guarda la vista
     */
    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }
}