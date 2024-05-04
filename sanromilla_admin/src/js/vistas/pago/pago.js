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

        // Verificar si el texto introducido es un código de inscripción o un número de teléfono
        let tipoBusqueda;
        if (inputBuscar.length >= 1 && inputBuscar.length <= 8) {
            tipoBusqueda = 'codigo'; // Si tiene entre 1 y 8 cifras, es un código de inscripción
        } else if (inputBuscar.length === 9 && /^\d+$/.test(inputBuscar)) {
            tipoBusqueda = 'telefono'; // Si tiene 9 cifras y es numérico, es un número de teléfono
        } else {
            // Si no cumple ninguna de las condiciones anteriores, no se puede determinar el tipo de búsqueda
            console.error('No se puede determinar el tipo de búsqueda.');
            return;
        }

        // Realizar la búsqueda utilizando el tipo determinado automáticamente
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
                datos.push({ dorsal: dorsal, idInscripcion: id });
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
                title: 'Error en la petición',
                text: 'Algo no ha ido bien.',
                icon: 'error',
                confirmButtonText: 'Vale!'
            });
        }
    }

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


    introDatos(datos){
        console.log(datos);
        let importe=0
        var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0];
        $('#tabla-datos > tbody').empty();

        for(let dato of datos) {
            if(dato.nombre == null){
                var thead = document.getElementById("tabla-datos").getElementsByTagName("thead")[0];
                $('#tabla-datos > thead').empty();
                var filaEncabezado = document.createElement("tr");
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
                thead.appendChild(filaEncabezado);
            }else{
                var thead = document.getElementById("tabla-datos").getElementsByTagName("thead")[0];
                $('#tabla-datos > thead').empty();
                var fila = document.createElement('tr');
                var celdaInscripcion = document.createElement('th');
                celdaInscripcion.style.width = '15%';
                celdaInscripcion.textContent = 'Inscripción';
                var celdaNombre = document.createElement('th');
                celdaNombre.style.width = '50%';
                celdaNombre.textContent = 'Nombre';
                var celdaDorsal = document.createElement('th');
                celdaDorsal.style.width = '15%';
                celdaDorsal.textContent = 'Dorsal';
                var celdaCamiseta = document.createElement('th');
                celdaCamiseta.style.width = '10%';
                celdaCamiseta.textContent = 'Camiseta';
                var celdaImporte = document.createElement('th');
                celdaImporte.style.width = '10%';
                celdaImporte.textContent = 'Importe';
                fila.appendChild(celdaInscripcion);
                fila.appendChild(celdaNombre);
                fila.appendChild(celdaDorsal);
                fila.appendChild(celdaCamiseta);
                fila.appendChild(celdaImporte);
                thead.appendChild(fila);
            }
        }

        for(let dato of datos)  {
            console.log(dato);
            if(dato.nombre == null){
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
            }else{
                var fila = document.createElement("tr");
                var inscripcion = document.createElement("td");
                inscripcion.textContent = dato.codigo_inscripcion;
                fila.appendChild(inscripcion)
                var nombre = document.createElement("td")
                nombre.textContent = dato.nombre + ' ' + dato.apellidos
                fila.appendChild(nombre)
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
                var camiseta = document.createElement("td")
                var inputCamiseta = document.createElement("input")
                inputCamiseta.setAttribute("type", "checkbox")
                inputCamiseta.setAttribute("id", dato.id_inscripcion)
                inputCamiseta.classList.add("text-center")
                inputCamiseta.onclick = this.actualizarPrecio.bind(this);
                camiseta.appendChild(inputCamiseta)
                fila.appendChild(camiseta)
                var euros = document.createElement("td")
                euros.textContent = dato.importe + '€'
                fila.appendChild(euros)
                if(dato.estado_pago === 0){
                    importe+=dato.importe
                }else{
                    fila.style.backgroundColor = 'lightgreen';
                }
                tbody.appendChild(fila)
            }
        }
        document.getElementsByClassName('card')[0].setAttribute('style', 'display:block !important');
        this.precioTotal = importe;
        this.activeBtnConfirmar(importe);
        $('#total').text(this.precioTotal+'€')
    }

    activeBtnConfirmar(importe) {
        (importe <= 0) ? this.btnConfirmar.classList.add('disabled') : this.btnConfirmar.classList.remove('disabled')
    }

    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

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