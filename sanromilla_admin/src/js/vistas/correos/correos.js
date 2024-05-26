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
        // this.saveViewState();

        this.enviarmail = document.getElementById('enviarmail')
        this.enviarmail.onclick = this.enviarCorreo.bind(this)

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
        //document.getElementById('linkMarcas').classList.remove('active');

    }

      /**
     * Método para enviar el correo electrónico
     */
      async enviarCorreo(event) {
        event.preventDefault();

        const subject = document.querySelector('input[name="subject"]').value.trim();
        const message = document.querySelector('textarea[name="message"]').value.trim();

        if (!subject) {
            Swal.fire({
                title: 'Asunto vacío',
                text: 'Por favor, ingrese el asunto del correo.',
                icon: 'warning',
                confirmButtonText: 'Vale!'
            });
            return;
        }

        if (!message) {
            Swal.fire({
                title: 'Mensaje vacío',
                text: 'Por favor, ingrese el mensaje del correo.',
                icon: 'warning',
                confirmButtonText: 'Vale!'
            });
            return;
        }

        const emailData = {
            subject: subject,
            message: message
        };

        try {
            const response = await this.controlador.enviarCorreo(subject, message);
            console.log(subject,message);
            Swal.fire({
                title: 'Correo enviado',
                text: 'El correo se ha enviado correctamente.',
                icon: 'success',
                confirmButtonText: 'Vale!'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el correo.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            });
        }
    }

    /**
     * Guarda la vista antes de recargar
     */
    // saveViewState() {
    //     var bodyHTML = document.body.innerHTML;
    //     localStorage.setItem('lastView', bodyHTML);
    // }

}