"use strict" //activo modo estricto

/**
 * Clase Pago de Admin
 */
export class Pago{

    precioCamiseta;
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
        console.log(this.btnBuscar)

        this.btnCancelar = document.getElementById('confirmar');
        this.btnCancelar.onclick = function() {
            location.reload();
        };

        this.btnConfirmar = document.getElementById('confirmar');
        this.btnConfirmar.onclick = this.setDorsal.bind(this);


        this.btnActualizar = document.getElementById('actualizarPrecio');
        this.btnActualizar.onclick = this.actualizarPrecio.bind(this);

        var codigoBuscar = document.getElementById('codigoBuscar');
        codigoBuscar.addEventListener('keypress', function(event) {
            if (event.key === 'Enter'){this.buscarInscripciones();}
        }.bind(this));

        this.precioCamiseta = await this.controlador.getPrecioCamiseta();

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
        var tipoBusqueda = $('#tipoBusqueda').val();
        // var inputBuscar = ;

        this.datos=await this.controlador.getInscripciones(tipoBusqueda, inputBuscar)
        // console.log(this.datos.data)
        
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

    /**
     * Método que busca las inscripciones
     * @returns {Promise<void>}
     */
    async buscarInscripciones2(codigo){

        this.datos=await this.controlador.getInscripciones('codigo', codigo)
        console.log(codigo)
        
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

    /**
     * Método que setea los dorsales introducidos
     */
    async setDorsal(){

        var tabla = document.getElementById("tabla-datos");
        var inputs = tabla.querySelectorAll('input[type="text"]');
        var datos = [];

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var dorsal = input.value;
            ;

            if(!this.validarDato(dorsal)){
                Swal.fire({
                    title: 'Dorsales incorrectos',
                    text: 'Dorsales máximo 4 números.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                })
                return 0
            }

            var id = input.getAttribute("id");

            if (dorsal != ''){
                datos.push({ dorsal: dorsal, idInscripcion: id });
            }else{
                Swal.fire({
                    title: 'Dorsales vacíos',
                    text: 'Recuerde rellenar TODOS los dorsales.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                })
                return 0;
            }
        }

        var seteado = await this.controlador.setDorsal(datos);
        console.log('qué pasa: ', datos)
        if (seteado.data >= 1){
            $('#total').text(0+'€');
            Swal.fire({
                title: '¡Dorsales asignados!',
                text: 'Se han registrado correctamente los dorsales.',
                icon: 'success',
                confirmButtonText: 'Vale!'
            })
            this.buscarInscripciones();
        }else{
            Swal.fire({
                title: 'Error en la petición',
                text: 'Algo no ha ido bien.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            })
        }
    }

    /**
     * Método para introducir los datos en la tabla
     * @param datos = array de datos
     */
    introDatos(datos){
        let importe=0
        var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0]
        $('#tabla-datos > tbody').empty();

        
        for(let dato of datos) {
            // Recorre el array de inscripciones y agrega las filas a la tabla si es un teléfono la búsqueda
            if(dato.nombre == null){
                var thead = document.getElementById("tabla-datos").getElementsByTagName("thead")[0]
                $('#tabla-datos > thead').empty();
                // var tfoot = document.getElementById("tabla-datos").getElementsByTagName("tfoot")[0]
                // $('#tabla-datos > tfoot').empty();

                // thead
                var filaEncabezado = document.createElement("tr");

                // Crea cada celda del encabezado y agrega su contenido
                var celda1 = document.createElement("th");
                celda1.style.width = "30%";
                celda1.textContent = "Inscripción";
                celda1.classList.add("text-center");
                filaEncabezado.appendChild(celda1);

                var celda2 = document.createElement("th");
                celda2.style.width = "30%";
                celda2.textContent = "Fecha Inscripción";
                celda2.classList.add("text-center");
                filaEncabezado.appendChild(celda2);

                // Agrega la fila de encabezado a la thead
                thead.appendChild(filaEncabezado);
            }else{
                var thead = document.getElementById("tabla-datos").getElementsByTagName("thead")[0]
                $('#tabla-datos > thead').empty();

                var fila = document.createElement('tr');

                // Crear celda para "Inscripción"
                var celdaInscripcion = document.createElement('th');
                celdaInscripcion.style.width = '15%';
                celdaInscripcion.textContent = 'Inscripción';

                // Crear celda para "Nombre"
                var celdaNombre = document.createElement('th');
                celdaNombre.style.width = '50%';
                celdaNombre.textContent = 'Nombre';

                // Crear celda para "Dorsal"
                var celdaDorsal = document.createElement('th');
                celdaDorsal.style.width = '15%';
                celdaDorsal.textContent = 'Dorsal';

                // Crear celda para "Camiseta"
                var celdaCamiseta = document.createElement('th');
                celdaCamiseta.style.width = '10%';
                celdaCamiseta.textContent = 'Camiseta';

                // Crear celda para "Importe"
                var celdaImporte = document.createElement('th');
                celdaImporte.style.width = '10%';
                celdaImporte.textContent = 'Importe';

                // Agregar celdas a la fila
                fila.appendChild(celdaInscripcion);
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaDorsal);
                fila.appendChild(celdaCamiseta);
                fila.appendChild(celdaImporte);

                // Agregar fila al encabezado
                thead.appendChild(fila);

            }
        }

        // Recorre el array de inscripciones y agrega las filas a la tabla
        for(let dato of datos)  {
            if(dato.nombre == null){
                console.log('holaa')
                console.log(this)
                var fila = document.createElement('tr');

                var inscripcion = document.createElement('td');

                var enlace = document.createElement("p");
                enlace.textContent = dato.codigo_inscripcion;
                enlace.onclick = this.buscarInscripciones2.bind(this, dato.codigo_inscripcion)
                inscripcion.appendChild(enlace);
                fila.appendChild(inscripcion);

                var fechaInscripcion = document.createElement('td');
                fechaInscripcion.textContent = dato.fecha_inscripcion;
                fila.appendChild(fechaInscripcion);

                tbody.appendChild(fila);
            }else{
                // Crea una nueva fila <tr>
                var fila = document.createElement("tr")

                // Agrega las celdas <td> con los datos correspondientes

                // td nºinscripción
                var inscripcion = document.createElement("td")
                inscripcion.textContent = dato.codigo_inscripcion;
                fila.appendChild(inscripcion)

                // td nombre
                var nombre = document.createElement("td")
                nombre.textContent = dato.nombre + ' ' + dato.apellidos
                fila.appendChild(nombre)

                // td dorsal
                var dorsal = document.createElement("td")
                if(dato.dorsal === null){
                    var inputDorsal = document.createElement("input")
                    inputDorsal.setAttribute("type", "text")
                    var id = dato.id_inscripcion
                    inputDorsal.setAttribute("id", id)
                    inputDorsal.setAttribute("placeholder", "nº dorsal")
                    inputDorsal.classList.add("text-center")
                    dorsal.appendChild(inputDorsal)
                    fila.appendChild(dorsal)
                }else{
                    dorsal.textContent = dato.dorsal
                    fila.appendChild(dorsal)
                }

                // td camiseta
                var camiseta = document.createElement("td")
                // camiseta.textContent = (dato.talla_camiseta == null) ? '-' : dato.talla_camiseta

                var inputCamiseta = document.createElement("input")
                inputCamiseta.setAttribute("type", "checkbox")
                inputCamiseta.setAttribute("id", dato.id_inscripcion)
                inputCamiseta.classList.add("text-center")
                camiseta.appendChild(inputCamiseta)
                fila.appendChild(camiseta)

                // td euros
                var euros = document.createElement("td")
                euros.textContent = dato.importe + '€'
                fila.appendChild(euros)

                //funcion para calcular el importe total
                if(dato.estado_pago === 0){
                    importe+=dato.importe
                }else{
                    fila.style.backgroundColor = 'lightgreen';
                }
                tbody.appendChild(fila)

            }

        }
        document.getElementsByClassName('card')[0].setAttribute('style', 'display:block !important');

        this.precioTotal = importe

        this.activeBtnConfirmar(importe);

        $('#total').text(this.precioTotal+'€')
    }

    /**
     * Método para activar el botón confirmar.
     * @param importe
     */
    activeBtnConfirmar(importe) {
        (importe <= 0) ? this.btnConfirmar.classList.add('disabled') : this.btnConfirmar.classList.remove('disabled')
    }

    /**
     * Método que guarda la vista
     */

    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

    /**
     * Método que actualiza el precio total.
     * @returns {number}
     */
    actualizarPrecio() {
        var table = document.getElementById('tabla-datos');
        var checkboxes = table.querySelectorAll('input[type="checkbox"]');
        var count = 0;

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                count++;
            }
        }

        var importe = (count * this.precioCamiseta) + this.precioTotal;

        $('#total').text(importe+'€');
        return 0;
    }

    /**
     * Método para validar el dorsal.
     * @param dato
     * @returns {boolean}
     */
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