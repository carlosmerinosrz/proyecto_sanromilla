"use strict"; // Activo modo estricto

/**
 * Clase Pago de Admin
 */
export class Pago {

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
     * @param {*} controlador 
     */
    async iniciar(controlador) {
        this.div = document.getElementById('pago');

        this.btnBuscar = document.getElementById('buscar');
        this.btnBuscar.onclick = this.buscarInscripciones.bind(this);

        this.btnCancelar = document.getElementById('confirmar');
        this.btnCancelar.onclick = function () {
            location.reload();
        };

        this.btnConfirmar = document.getElementById('confirmar');
        this.btnConfirmar.onclick = this.confirmarDorsales.bind(this);

        var codigoBuscar = document.getElementById('codigoBuscar');
        codigoBuscar.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                this.buscarInscripciones();
            }
        }.bind(this));

        this.activeNavbar();

        // Guardar página para recargar
        this.saveViewState();
    }

    async buscarInscripciones() {
        let inputBuscar = $('#codigoBuscar').val();
    
        // Verificamos si el texto introducido es un código de inscripción o un número de teléfono
        let tipoBusqueda;
        if (inputBuscar.length >= 1 && inputBuscar.length <= 8) {
            tipoBusqueda = 'codigo';
        } else if (inputBuscar.length === 9 && /^\d+$/.test(inputBuscar)) {
            tipoBusqueda = 'telefono';
        } else {
            console.error('No se puede determinar el tipo de búsqueda.');
            return;
        }
        console.log('TIPO DE BUSQUEDA: ' + tipoBusqueda + ' / ' + inputBuscar);
        this.datos = await this.controlador.getInscripciones(tipoBusqueda, inputBuscar);
    
        if (this.datos.data.length != 0) {
            this.introDatos(this.datos.data);
        } else {
            // Mostrar mensaje si no se encuentran inscripciones
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr");
            var inscripcion = document.createElement("td");
            inscripcion.colSpan = 5;
            let result = await this.controlador.searchInscripciones(inputBuscar, tipoBusqueda);
            if (result !== 0) {
                inscripcion.textContent = 'Ya ha sido pagada la inscripción con ese código o número de teléfono.';
            } else {
                inscripcion.textContent = 'No existe ninguna inscripción con ese código o número de teléfono.';
            }
    
            fila.appendChild(inscripcion);
            var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
            tbody.appendChild(fila);
        }
    
        // Check if the search type is "telefono"
        if (tipoBusqueda === 'telefono') {
            console.log("BUSQUEDADA TELEFONO")
            // Add the 'busqtlfn' class to the table
            var table = document.getElementById('tabla-datos');
            table.classList.add('busqtlfn');
    
            // Add the 'busqtlfn' class to all "Inscripción" column cells
            var inscripcionCells = document.querySelectorAll('#tabla-datos tbody td:first-child');
            inscripcionCells.forEach(cell => {
                cell.classList.add('busqtlfn');
            });
    
            // Hide all columns except for the "Inscripción" column
            var thElements = document.querySelectorAll('#tabla-datos th');
            thElements.forEach(th => {
                if (th.textContent !== 'Inscripción') {
                    th.style.display = 'none';
                }
            });
    
            // Hide the table footer
            var tfoot = document.querySelector('#tabla-datos tfoot');
            tfoot.style.display = 'none';
    
            // Show only the "Inscripción" column in the table body
            var tdElements = document.querySelectorAll('#tabla-datos tbody td');
            tdElements.forEach(td => {
                if (td.cellIndex !== 0) {
                    td.style.display = 'none';
                }
            });
    
            // Add 'telefono-button' class to <p> elements in the "Inscripción" column
            var pElements = document.querySelectorAll('#tabla-datos tbody tr td:first-child p');
            pElements.forEach(p => {
                p.classList.add('telefono-button');
            });
    
            // Center the table
            var table = document.getElementById('tabla-datos');
            table.style.margin = 'auto';
    
            // Set the column width to 100%
            var thElement = document.querySelector('#tabla-datos th');
            thElement.style.width = '100%';
        } else {
            // Remove styles applied for telefono search
            var table = document.getElementById('tabla-datos');
            table.classList.remove('busqtlfn');
    
            var inscripcionCells = document.querySelectorAll('#tabla-datos tbody td:first-child');
            inscripcionCells.forEach(cell => {
                cell.classList.remove('busqtlfn');
            });
    
            var thElements = document.querySelectorAll('#tabla-datos th');
            thElements.forEach(th => {
                th.style.display = ''; // reset to default
            });
    
            var tfoot = document.querySelector('#tabla-datos tfoot');
            tfoot.style.display = ''; // reset to default
    
            var tdElements = document.querySelectorAll('#tabla-datos tbody td');
            tdElements.forEach(td => {
                td.style.display = ''; // reset to default
            });
    
            var pElements = document.querySelectorAll('#tabla-datos tbody tr td:first-child p');
            pElements.forEach(p => {
                p.classList.remove('telefono-button');
            });
    
            var table = document.getElementById('tabla-datos');
            table.style.margin = ''; // reset to default
    
            var thElement = document.querySelector('#tabla-datos th');
            thElement.style.width = ''; // reset to default
        }
    
        document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
    }
    
    
    
    
    
    

    async confirmarDorsales() {
        var tabla = document.getElementById("tabla-datos");
        var inputs = tabla.querySelectorAll('input[type="text"]');
        var datos = [];

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var dorsal = input.value;
            var select = input.parentNode.nextElementSibling.querySelector('select');
            var id_talla = select.value;

            if (!this.validarDato(dorsal) && dorsal !== '') {
                Swal.fire({
                    title: 'Dorsales incorrectos',
                    text: 'Dorsales máximo 4 números.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                });
                return 0;
            }

            var id = input.getAttribute("id");

            if (dorsal != '') {
                datos.push({
                    id_talla: id_talla,
                    dorsal: dorsal,
                    idInscripcion: id,
                    importe: this.obtenerImporteInscripcion(id) // Obtener el importe de cada inscripción
                });
            }
        }

        // Si no se han rellenado todas las inscripciones, mostrar un mensaje de confirmación
        if (datos.length < inputs.length) {
            Swal.fire({
                title: 'No has rellenado todas las inscripciones',
                text: '¿Estás seguro de continuar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.setDorsal(datos);
                }
            });
        } else {
            this.setDorsal(datos);
        }
    }

    async setDorsal(datos) {
        if (datos.length === 0) {
            Swal.fire({
                title: 'Dorsales vacíos',
                text: 'Recuerde rellenar al menos un dorsal.',
                icon: 'warning',
                confirmButtonText: 'Vale!'
            });
            return 0;
        }

        var seteado = await this.controlador.setDorsal(datos);

        if (seteado.data >= 1) {
            $('#total').text(0 + '€');
            Swal.fire({
                title: '¡Dorsales asignados!',
                text: 'Se han registrado correctamente los dorsales.',
                icon: 'success',
                confirmButtonText: 'Vale!'
            });
            this.buscarInscripciones();
        } else {
            Swal.fire({
                title: 'Dorsal Duplicado',
                text: 'Escoge otro dorsal que no esté duplicado.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            });
        }
    }

    async buscarInscripciones2(codigo) {
        this.datos = await this.controlador.getInscripciones('codigo', codigo);
        console.log('HOLA');
        var inscripcionColumn = document.querySelector('#tabla-datos th:first-child');
        inscripcionColumn.style.width = '15%';
        // Remove the class from the "Inscripción" column text to revert styling
        var tdElements = document.querySelectorAll('#tabla-datos tbody td');
        tdElements.forEach(td => {
            if (td.classList.contains('telefono-button')) {
                td.classList.remove('telefono-button');
            }
        });
        if (this.datos.data.length != 0) {
            this.introDatos(this.datos.data);
        } else {
            console.log("WANANAINONAINO")
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr");
            var inscripcion = document.createElement("td");
            inscripcion.colSpan = 5;
            inscripcion.textContent = 'No hay ninguna inscripción con ese código o número de teléfono..';
            fila.appendChild(inscripcion);
            var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
            tbody.appendChild(fila);
            
            // Hide all columns except for the "Inscripción" column
            var thElements = document.querySelectorAll('#tabla-datos th');
            thElements.forEach(th => {
                if (th.textContent !== 'Inscripción') {
                    th.style.display = 'none';
                }
            });
            
            // Hide the table footer
            var tfoot = document.querySelector('#tabla-datos tfoot');
            tfoot.style.display = 'none';
            
            // Show only the "Inscripción" column in the table body
            var tdElements = document.querySelectorAll('#tabla-datos tbody td');
            tdElements.forEach(td => {
                if (td.cellIndex !== 0) {
                    td.style.display = 'none';
                }
            });
    
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
        }
    }
    
    
    


    introDatos(datos) {
        let importe = 0;
        var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
        $('#tabla-datos > tbody').empty();

        const promise = this.controlador.getTallasCamisetas();

        promise.then(response => {
            const tallasCamisetas = response.data;
            const tallasUnicas = [...new Set(tallasCamisetas.map(talla => ({ id_talla: talla.id_talla, talla: talla.talla })))];

            for (let dato of datos) {
                if (dato.nombre == null) {
                    var fila = document.createElement('tr');
                    var inscripcion = document.createElement('td');
                    var enlace = document.createElement("p");
                    enlace.textContent = dato.codigo_inscripcion;
                    enlace.onclick = this.buscarInscripciones2.bind(this, dato.codigo_inscripcion);
                    inscripcion.appendChild(enlace);
                    fila.appendChild(inscripcion);
                    var fechaInscripcion = document.createElement('td');
                    fechaInscripcion.textContent = dato.fecha_inscripcion;
                    fila.appendChild(fechaInscripcion);
                    tbody.appendChild(fila);
                } else {
                    var fila = document.createElement("tr");
                    var inscripcion = document.createElement("td");
                    inscripcion.textContent = dato.codigo_inscripcion;
                    fila.appendChild(inscripcion);
                    var nombre = document.createElement("td");
                    nombre.textContent = dato.nombre + ' ' + dato.apellidos;
                    fila.appendChild(nombre);
                    var dorsal = document.createElement("td");
                    if (dato.dorsal === null) {
                        var inputDorsal = document.createElement("input");
                        inputDorsal.setAttribute("type", "text");
                        var id = dato.id_inscripcion;
                        inputDorsal.setAttribute("id", id);
                        inputDorsal.setAttribute("placeholder", "nº dorsal");
                        inputDorsal.classList.add("text-center");
                        dorsal.appendChild(inputDorsal);
                        fila.appendChild(dorsal);
                    } else {
                        dorsal.textContent = dato.dorsal;
                        fila.appendChild(dorsal);
                    }

                    var camiseta = document.createElement("td");
                    var selectCamiseta = document.createElement("select");
                    selectCamiseta.setAttribute("id", dato.id_inscripcion);
                    selectCamiseta.classList.add("text-center");
                    selectCamiseta.addEventListener("change", this.actualizarPrecio.bind(this));

                    const sinCamisetaOption = document.createElement('option');
                    sinCamisetaOption.value = null;
                    sinCamisetaOption.textContent = 'Sin camiseta';
                    selectCamiseta.appendChild(sinCamisetaOption);

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

                    var euros = document.createElement("td");
                    euros.classList.add('importe-inscripcion');
                    euros.dataset.importeBase = dato.importe;
                    var precioBase = parseFloat(dato.importe);
                    var precioCamiseta = dato.id_talla !== null ? parseFloat(this.precioCamiseta) : 0;
                    var precioActual = precioBase + precioCamiseta;
                    euros.textContent = precioActual.toFixed(2) + '€';
                    fila.appendChild(euros);

                    importe += precioActual;

                    if (dato.fecha_inscripcion === null) {
                        fila.style.backgroundColor = 'lightgreen';
                    }
                    tbody.appendChild(fila);
                }
            }
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:block !important');
            this.precioTotal = importe;
            this.activeBtnConfirmar(importe);
            $('#total').text(this.precioTotal + '€');
        })
            .catch(error => {
                console.error('Error al obtener tallas de camisetas:', error);
            });
    }

    actualizarPrecio() {
        var selects = document.querySelectorAll('select');
        var totalImporte = 0;

        this.controlador.getPrecioCamiseta()
            .then(valor => {
                var precioCamiseta = parseFloat(valor);

                selects.forEach(select => {
                    var selectedOption = select.options[select.selectedIndex];
                    if (selectedOption) {
                        var fila = select.closest('tr');
                        var euros = fila.querySelector('.importe-inscripcion');
                        var importeBase = parseFloat(euros.dataset.importeBase);

                        var precioActual = importeBase;

                        if (selectedOption.value !== 'null') {
                            precioActual += precioCamiseta;
                            select.dataset.precioAgregado = true;
                        } else {
                            delete select.dataset.precioAgregado;
                        }

                        euros.textContent = precioActual.toFixed(2) + '€';
                        totalImporte += precioActual;
                    }
                });

                this.totalImporteActualizado = totalImporte;
                $('#total').text(totalImporte.toFixed(2) + '€');
            })
            .catch(error => {
                console.error('Error al obtener el precio de la camiseta:', error);
            });
    }

    activeBtnConfirmar(importe) {
        (importe <= 0) ? this.btnConfirmar.classList.add('disabled') : this.btnConfirmar.classList.remove('disabled');
    }

    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

    validarDato(dato) {
        if (dato.length > 4) {
            return false;
        }
        if (!/^\d+$/.test(dato)) {
            return false;
        }
        return true;
    }

        /**
     * Para mostrar el item del navbar activo
     */
        activeNavbar(){
            document.getElementById('navTop').classList.remove('d-none');
            document.getElementById('linkHome').classList.remove('active');
            document.getElementById('linkFotos').classList.add('active');
            document.getElementById('linkPagos').classList.remove('active');
            document.getElementById('linkCarrera').classList.remove('active');
            document.getElementById('linkCategorias').classList.remove('active');
            document.getElementById('linkInscripciones').classList.remove('active');
            document.getElementById('linkUsuarios').classList.remove('active');
            document.getElementById('linkCorreos').classList.remove('active');
            document.getElementById('linkMarcas').classList.remove('active');
            document.getElementById('linkTallas').classList.remove('d-none');
            document.getElementById('linkNuevaSanRomilla').classList.remove('active');
        }

    // montarNav() {
    //     document.getElementById('navTop').classList.remove('d-none');
    //     document.getElementById('linkHome').classList.remove('d-none');
    //     document.getElementById('linkFotos').classList.remove('d-none');
    //     document.getElementById('linkPagos').classList.remove('d-none');
    //     document.getElementById('linkCarrera').classList.remove('d-none');
    //     document.getElementById('linkCategorias').classList.remove('d-none');
    //     document.getElementById('linkInscripciones').classList.remove('d-none');
    //     document.getElementById('linkUsuarios').classList.remove('d-none');
    //     document.getElementById('linkCorreos').classList.remove('d-none');
    //     document.getElementById('linkMarcas').classList.remove('d-none');
    //     document.getElementById('linkTallas').classList.remove('d-none');
    //     document.getElementById('linkNuevaSanRomilla').classList.remove('d-none');
    // }

    obtenerImporteInscripcion(idInscripcion) {
        const fila = document.getElementById(idInscripcion).closest('tr');
        const importeText = fila.querySelector('.importe-inscripcion').textContent;
        return parseFloat(importeText.replace('€', ''));
    }
}
