"use strict" //activo modo estricto
/**
 * Clase Carrera
 */
export class Carrera {

    constructor(controlador){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar(controlador){
        this.div=document.getElementById('carrera')
        this.activeNavbar();
        this.getInformacion();

        this.btnModificar = document.getElementById('modificar');
        this.btnModificar.onclick = await this.modificarInfo.bind(this);
        this.btnModificar.addEventListener('keypress', function(event) {
            if (event.key === 'Enter'){this.modificarInfo();}
        }.bind(this));

    }

    /**
     * Método que coge la información general
     */
    async getInformacion(){
        this.datos=await this.controlador.getInformacion()
        this.introDatos(this.datos.data[0]);
    }

    /**
     * Método que setea los dorsales introducidos
     */
    async modificarInfo(){

        var form = document.getElementById("formInfo");
        var inputs = form.querySelectorAll('input');
        var datos = {};

        inputs.forEach(function(input) {
            var id = input.id;
            var value = input.value;
            datos[id] = value;
        });

        var error = this.checkDatos(datos)

        if(error != ''){
            Swal.fire({
                title: 'Algún campo mal',
                text: error,
                icon: 'warning',
                confirmButtonText: 'Vale!'
            })
        } else {
            var inputCartel = document.getElementById('cartel');
            var cartel = inputCartel.files[0];
            var inputReglamento = document.getElementById('reglamento');
            var reglamento = inputReglamento.files[0];

            if (!cartel || !reglamento) {
                Swal.fire({
                    title: 'Error en la petición',
                    text: 'Algo no ha ido bien. (Tanto Cartel como Reglamento han de ser subidos)',
                    icon: 'error',
                    confirmButtonText: 'Vale!'
                });
                return;
            }

            var formData = new FormData();
            formData.append('cartel', cartel);
            formData.append('reglamento', reglamento);

            var modificacionArchivos = await this.controlador.modArchivos(formData);
            console.log('modif: ', modificacionArchivos);

            var modificarDatos = await this.controlador.modificarInfo(datos);
            console.log('modif: ', modificarDatos);

            if (modificarDatos.data >= 1){
                Swal.fire({
                    title: '¡Cambios realizados!',
                    text: 'Se han registrado correctamente los cambios en la base de datos.',
                    icon: 'success',
                    confirmButtonText: 'Vale!'
                })
            } else {
                Swal.fire({
                    title: 'Error en la petición',
                    text: 'Algo no ha ido bien.',
                    icon: 'error',
                    confirmButtonText: 'Vale!'
                })
            }
        }
    }

    /**
     * Método para introducir los datos de la información general de la carrera.
     * @param datos
     */
    introDatos(datos) {
        var fechaInput = document.getElementById('fecha');
        var inicioInscripcionInput = document.getElementById('inicio_inscripcion');
        var finInscripcionInput = document.getElementById('fin_inscripcion');
        var precioCamisetaInput = document.getElementById('precio_camiseta');
        var beneficioCamisetaInput = document.getElementById('beneficio_camiseta');

        var timestamp = datos.fecha;
        var partes = timestamp.split(' ');
        var fecha = partes[0];
        var hora = partes[1];

        var horaInput = document.getElementById('hora');

        fechaInput.value = fecha;
        horaInput.value = hora;
        inicioInscripcionInput.value = datos.inicio_inscripcion;
        finInscripcionInput.value = datos.fin_inscripcion;
        precioCamisetaInput.value = datos.precio_camiseta;
        beneficioCamisetaInput.value = datos.beneficio_camiseta;
    }

    /**
     * Método para comprobar los datos del formulario.
     * @param datos
     * @returns {string} Código de errores.
     */
    checkDatos(datos) {
        var mensaje = '';

        mensaje += this.checkFechaCarrera(datos.fecha)
        mensaje += this.checkFechasInscripcion(datos)
        mensaje += this.checkArchivos(datos)

        return mensaje;
    }

    /**
     * Método que comprueba que la fecha de la carrera no se posterior al día actual.
     * @param fecha
     * @returns {string} Retorna los errores.
     */
    checkFechaCarrera(fecha) {
        var fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        var fechaCarrera = new Date(fecha);

        if (fechaCarrera < fechaActual) { return 'La fecha de la carrera tiene que ser posterior a la actual. '}
        return '';
    }

    /**
     * Método para comprobar las fechas de inscripción, que la inicial no sea superior a la final ni que sea
     * inferior o igual a la fecha de la carrera.
     * @param datos
     */
    checkFechasInscripcion(datos) {
        var fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        var fechaCarrera = new Date(datos.fecha);
        var fechaInicio = new Date(datos.inicio_inscripcion);
        var fechaFin = new Date(datos.fin_inscripcion);

        if (fechaInicio < fechaFin) {
            return '';
        } else {
            return 'Fecha inicio de inscripción tiene que ser anterior a la fecha de fin de inscripción. ';
        }
    }

    /**
     * Método para comprobar las extensiones de los archivos
     * @returns {string} Retorna los errores
     */
    checkArchivos() {
        var form = document.getElementById('formInfo');
        var cartelInput = form.querySelector('#cartel');
        var reglamentoInput = form.querySelector('#reglamento');

        function isImageFile(file) {
            var validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            var fileExtension = file.name.split('.').pop().toLowerCase();

            return validExtensions.includes(fileExtension);
        }

        function isPdf(file) {
            var validExtensions = ['pdf'];
            var fileExtension = file.name.split('.').pop().toLowerCase();

            return validExtensions.includes(fileExtension);
        }

        for (var i = 0; i < cartelInput.files.length; i++) {
            if (!isImageFile(cartelInput.files[i])) {
                return 'El archivo del campo cartel no es una imagen válida';
            }
        }

        for (var j = 0; j < reglamentoInput.files.length; j++) {
            if (!isPdf(reglamentoInput.files[j])) {
                return 'El archivo del campo reglamento no es una documento válido';
            }
        }
        return "";
    }

    /**
     * Para mostrar el item del navbar activo
     */

    activeNavbar(){
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.add('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.remove('active');
    }

}
