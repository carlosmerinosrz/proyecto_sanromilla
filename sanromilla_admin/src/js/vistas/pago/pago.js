"use strict" //activo modo estricto

/**
 * Clase Pago de Admin
 */
export class Pago{

    precioCamiseta;
    tallasCamisetas = [];
    precioTotal = 0;
      
    constructor(controlador){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador 
     */
    async iniciar(controlador){
        this.div=document.getElementById('pago')

        this.btnBuscar = document.getElementById('buscar');
        this.btnBuscar.onclick = this.buscarInscripciones.bind(this);
        // console.log(this.btnBuscar)

        this.btnCancelar = document.getElementById('confirmar');
        this.btnCancelar.onclick = function() {
            location.reload();
        };

        this.btnConfirmar = document.getElementById('confirmar');
        this.btnConfirmar.onclick = this.setDorsal.bind(this);


        // this.btnActualizar = document.getElementById('actualizarPrecio');
        // this.btnActualizar.onclick = this.actualizarPrecio.bind(this);

        var codigoBuscar = document.getElementById('codigoBuscar');
        codigoBuscar.addEventListener('keypress', function(event) {
            if (event.key === 'Enter'){this.buscarInscripciones();}
        }.bind(this));

        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.add('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');

        //Guardar página para recargar
        this.saveViewState();
    }

    /**
     * Método que busca las inscripciones
     * @returns {Promise<void>}
     */
    async buscarInscripciones(){
        let inputBuscar = $('#codigoBuscar').val();

        //Nuevo Carlos, verificamos si el texto introduccido es un codigo de inscripción o un número de teléfono
        let tipoBusqueda;
        if (inputBuscar.length >= 1 && inputBuscar.length <= 8) {
            tipoBusqueda = 'codigo'; 
        } else if (inputBuscar.length === 9 && /^\d+$/.test(inputBuscar)) {
            tipoBusqueda = 'telefono'; 
        } else {
            console.error('No se puede determinar el tipo de búsqueda.');
            return;
        }

        this.datos = await this.controlador.getInscripciones(tipoBusqueda, inputBuscar);

        if (this.datos.data.length != 0) {
            this.introDatos(this.datos.data);
        } else {
            // Mostrar mensaje si no se encuentran inscripciones
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr");
            var inscripcion = document.createElement("td");
            inscripcion.colSpan = 5;
            inscripcion.textContent = 'No hay ninguna inscripción con ese código o dni.';
            fila.appendChild(inscripcion);
            var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
            tbody.appendChild(fila);
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
        }
    }

    async setDorsal(){
        var tabla = document.getElementById("tabla-datos");
        var inputs = tabla.querySelectorAll('input[type="text"]');
        var datos = [];

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var dorsal = input.value;
            var select = input.parentNode.nextElementSibling.querySelector('select'); 
            var id_talla = select.value;

            if(!this.validarDato(dorsal)){
                Swal.fire({
                    title: 'Dorsales incorrectos',
                    text: 'Dorsales máximo 4 números.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                });
                return 0;
            }

            var id = input.getAttribute("id");

            if (dorsal != ''){
                // console.log(id_talla);
                datos.push({id_talla: id_talla, dorsal: dorsal, idInscripcion: id});
            }else{
                Swal.fire({
                    title: 'Dorsales vacíos',
                    text: 'Recuerde rellenar TODOS los dorsales.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                });
                return 0;
            }
        }

        var seteado = await this.controlador.setDorsal(datos);
        // console.log(seteado);
        if (seteado.data >= 1){
            $('#total').text(0+'€');
            Swal.fire({
                title: '¡Dorsales asignados!',
                text: 'Se han registrado correctamente los dorsales.',
                icon: 'success',
                confirmButtonText: 'Vale!'
            });
            this.buscarInscripciones();
        }else{
            Swal.fire({
                title: 'Dorsal Duplicado',
                text: 'Escoge otro dorsal que no este duplicado.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            });
        }
    }

    async buscarInscripciones2(codigo){

        this.datos=await this.controlador.getInscripciones('codigo', codigo)
        // console.log(codigo)
        
        if(this.datos.data.length!=0){
            this.introDatos(this.datos.data)
        }else{
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr")
            var inscripcion = document.createElement("td")
            inscripcion.colSpan =5
            inscripcion.textContent = 'No hay ninguna inscripción con ese código o dni.'
            fila.appendChild(inscripcion)
            var tbody= document.getElementById("tabla-datos").getElementsByTagName("tbody")[0]
            tbody.appendChild(fila)
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
                        selectCamiseta.appendChild(option);
                    });
    
                    camiseta.appendChild(selectCamiseta);
                    fila.appendChild(camiseta);
    
                    var euros = document.createElement("td");
                    euros.textContent = dato.importe + '€';
                    euros.classList.add("importe-inscripcion");
                    euros.dataset.importeBase = dato.importe; // Guardar el importe base como un atributo de datos
                    fila.appendChild(euros);
                    if (dato.estado_pago === 0) {
                        importe += dato.importe;
                    } else {
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
        var totalImporte = 0; // Inicializar el total del importe
    
        this.controlador.getPrecioCamiseta()
        .then(valor => {
            var precioCamiseta = parseFloat(valor);
    
            selects.forEach(select => {
                var selectedOption = select.options[select.selectedIndex];
                if (selectedOption) {
                    var fila = select.closest('tr');
                    var euros = fila.querySelector('.importe-inscripcion');
                    var importeBase = parseFloat(euros.dataset.importeBase); // El importe base de la inscripción
    
                    // Inicializar el precio actual con el importe base
                    var precioActual = importeBase;
    
                    // Verificar si la opción seleccionada no es 'Sin camiseta'
                    if (selectedOption.value !== 'null') {
                        precioActual += precioCamiseta;
                        select.dataset.precioAgregado = true; // Marcar la selección actual como procesada
                    } else {
                        // Si se selecciona 'Sin camiseta', asegurarse de no agregar el precio de la camiseta
                        delete select.dataset.precioAgregado;
                    }
    
                    // Actualizar el precio actual en la interfaz
                    euros.textContent = precioActual.toFixed(2) + '€';
    
                    // Sumar el precio actual al total del importe
                    totalImporte += precioActual;
                }
            });
    
            // Actualizar el precio total en la interfaz
            $('#total').text(totalImporte.toFixed(2) + '€');
        })
        .catch(error => {
            console.error('Error al obtener el precio de la camiseta:', error);
        });
    }
    
    
    
    
    

    // actualizarPrecio() {
    //     var table = document.getElementById('tabla-datos');
    //     var selects = table.querySelectorAll('select');
    //     var count = 0;
    //     var precioCamiseta;
    
    //     this.controlador.getPrecioCamiseta()
    //         .then(valor => {
    //             precioCamiseta = parseFloat(valor);
    
    //             selects.forEach(function(select) {
    //                 var selectedOption = select.options[select.selectedIndex];
    //                 if (selectedOption && selectedOption.value !== 'null') {
    //                     count++;
    //                 }
    //             });
    
    //             var importe = (count * precioCamiseta) + parseFloat(this.precioTotal);
    
    //             $('#total').text(importe + '€');
    //         });
    // }
    
    
    
    activeBtnConfirmar(importe) {
        //console.log('IMPORTE: ' + importe);
        (importe <= 0) ? this.btnConfirmar.classList.add('disabled') : this.btnConfirmar.classList.remove('disabled')
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

}