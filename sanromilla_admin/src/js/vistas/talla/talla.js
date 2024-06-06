"use strict"; // Activo modo estricto

/**
 * Clase Cambio de Talla de Admin
 */
export class Talla {

    precioCamiseta;
    tallasCamisetas = [];
    precioTotal = 0;

    constructor(controlador) {
        this.controlador = controlador;
        this.totalImporteActualizado = 0;
        window.setTimeout(this.iniciar.bind(this), 500);
    }

    /**
     * Método que inicia la vista
     */
    async iniciar() {
        this.div = document.getElementById('talla');

        this.btnBuscar = document.getElementById('buscar');
        this.btnBuscar.onclick = this.buscarInscripciones.bind(this);

        this.btnConfirmar = document.getElementById('confirmar');
        this.btnConfirmar.onclick = this.confirmarCambios.bind(this);

        this.btnVolver = document.getElementById('volver');
        this.btnVolver.onclick = this.volverAtras.bind(this);

        var codigoBuscar = document.getElementById('codigoBuscar');
        codigoBuscar.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                this.buscarInscripciones();
            }
        }.bind(this));

        this.montarNav();
    }

    /**
     * Método que busca las inscripciones
     * @returns {Promise<void>}
     */
    async buscarInscripciones() {
        let inputBuscar = $('#codigoBuscar').val();

        this.datos = await this.controlador.getInscripcionesTalla(inputBuscar);

        if (this.datos.data.length != 0) {
            this.introDatos(this.datos.data);
        } else {
            // Mostrar mensaje si no se encuentran inscripciones
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr");
            var inscripcion = document.createElement("td");
            inscripcion.colSpan = 3;
            inscripcion.textContent = 'No existe ninguna inscripción con ese código.';
            fila.appendChild(inscripcion);
            var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
            tbody.appendChild(fila);
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
        }
    }

    async confirmarCambios() {
        var tabla = document.getElementById("tabla-datos");
        var selects = tabla.querySelectorAll('select');
        var datos = [];

        for (var i = 0; i < selects.length; i++) {
            var select = selects[i];
            var id_talla = select.value;
            var idInscripcion = select.getAttribute("id");

            datos.push({
                id_talla: id_talla,
                idInscripcion: idInscripcion
            });
        }

        var resultado = await this.controlador.setCambios(datos);
        if (resultado.data >= 1) {
            Swal.fire({
                title: '¡Tallas cambiadas!',
                text: 'Se han registrado correctamente los cambios.',
                icon: 'success',
                confirmButtonText: 'Vale!'
            });
            this.limpiarFormulario();
        } else {
            Swal.fire({
                title: 'Error en el cambio',
                text: 'Ha ocurrido un error al cambiar las tallas.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            });
        }
    }

    introDatos(datos) {
        var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
        $('#tabla-datos > tbody').empty();

        const promise = this.controlador.getTallasCamisetas();

        promise.then(response => {
            const tallasCamisetas = response.data;
            const tallasUnicas = [...new Set(tallasCamisetas.map(talla => ({ id_talla: talla.id_talla, talla: talla.talla })))];

            for (let dato of datos) {
                var fila = document.createElement("tr");
                var inscripcion = document.createElement("td");
                inscripcion.textContent = dato.codigo_inscripcion;
                fila.appendChild(inscripcion);

                var camiseta = document.createElement("td");
                var selectCamiseta = document.createElement("select");
                selectCamiseta.setAttribute("id", dato.id_inscripcion);
                selectCamiseta.classList.add("text-center");

                tallasUnicas.forEach(talla => {
                    const option = document.createElement('option');
                    option.value = talla.id_talla;
                    option.textContent = talla.talla;
                    if (dato.id_talla === talla.id_talla) {
                        option.selected = true;
                    }
                    selectCamiseta.appendChild(option);
                });
                camiseta.appendChild(selectCamiseta);
                fila.appendChild(camiseta);

                var nombre = document.createElement("td");
                nombre.textContent = dato.nombre + ' ' + dato.apellidos;
                fila.appendChild(nombre);

                tbody.appendChild(fila);
            }
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:block !important');
        })
        .catch(error => {
            console.error('Error al obtener tallas de camisetas:', error);
        });
    }

    volverAtras() {
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        $('#codigoBuscar').val('');
        $('#tabla-datos > tbody').empty();
        document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
    }

    montarNav() {
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
        document.getElementById('linkTallas').classList.add('d-none');
        document.getElementById('linkNuevaSanRomilla').classList.remove('d-none');
    }
}
