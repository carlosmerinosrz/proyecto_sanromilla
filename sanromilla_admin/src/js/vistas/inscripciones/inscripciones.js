"use strict" //activo modo estricto
/**
 * Clase Inscripciones
 */
export class Inscripciones {
      
    constructor(controlador){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador 
     */
    async iniciar(controlador){
        this.div=document.getElementById('inscripciones')
        this.activeNavbar();
        this.inscripciones = await this.buscarInscripciones();


        //Guardar página para recargar
        this.saveViewState();
    }

    /**
     * Método que busca las inscripciones
     * @returns {Promise<void>}
     */
    async buscarInscripciones(){

        this.datos=await this.controlador.getInscripciones('all', 1)
        // console.log(this.datos.data)
        
        if(this.datos.data.length!=0){
            this.introDatos(this.datos.data)
        }else{
            $('#tabla-datos > tbody').empty();
            var fila = document.createElement("tr")
            var inscripcion = document.createElement("td")
            inscripcion.colSpan =5
            inscripcion.textContent = 'Ha habido algún error'
            fila.appendChild(inscripcion)
            var tbody= document.getElementById("tabla-datos").getElementsByTagName("tbody")[0]
            tbody.appendChild(fila)
            document.getElementsByClassName('card')[0].setAttribute('style', 'display:none !important');
        }
    }

    /**
     * Método para introducir los datos en la tabla
     * @param datos = array de datos
     */
    introDatos(datos){

        var tbody = document.getElementById("tabla-datos").getElementsByTagName("tbody")[0]
        $('#tabla-datos > tbody').empty();

        var thead = document.getElementById("tabla-datos").getElementsByTagName("thead")[0]
        $('#tabla-datos > thead').empty();

        var fila = document.createElement('tr');

        // Crear celda para "Inscripción"
        var celdaInscripcion = document.createElement('th');
        celdaInscripcion.textContent = 'Inscripción';
        fila.appendChild(celdaInscripcion);

        // Crear celda para "Nombre"
        var celdaNombre = document.createElement('th');
        celdaNombre.textContent = 'Nombre';
        fila.appendChild(celdaNombre);

        // Crear celda para "Dorsal"
        var celdaDorsal = document.createElement('th');
        celdaDorsal.textContent = 'Dorsal';
        fila.appendChild(celdaDorsal);

        // Crear celda para "telefono"
        var telefono = document.createElement('th')
        telefono.textContent = 'Telefono';
        fila.appendChild(telefono);

        // Crear celda para "Camiseta"
        // var celdaCamiseta = document.createElement('th');
        // celdaCamiseta.style.width = '10%';
        // celdaCamiseta.textContent = 'Camiseta';
        // fila.appendChild(celdaCamiseta);

        // Crear celda para "Importe"
        var celdaImporte = document.createElement('th');
        celdaImporte.style.width = '10%';
        celdaImporte.textContent = 'Importe';
        fila.appendChild(celdaImporte);

        // Agregar fila al encabezado
        thead.appendChild(fila);

        datos.forEach(function(dato) {
            //console.log(dato);
            // Crea una nueva fila <tr>
            var fila = document.createElement("tr")

            // Agrega las celdas <td> con los datos correspondientes

            // td nºinscripción
            var inscripcion = document.createElement("td")
            inscripcion.textContent = dato.codigo_inscripcion
            fila.appendChild(inscripcion)

            // td nombre
            var nombre = document.createElement("td")
            nombre.textContent = dato.apellidos +' '+dato.nombre
            fila.appendChild(nombre)

            // td dorsal
            var dorsal = document.createElement("td")
            dorsal.textContent = (dato.dorsal === null) ? '---' : dato.dorsal;
            fila.appendChild(dorsal)

            // td telefono
            var telefono = document.createElement("td")
            telefono.textContent = dato.telefono;
            fila.appendChild(telefono)

            // td camiseta
            // var camiseta = document.createElement("td")
            // // camiseta.textContent = (dato.talla_camiseta == null) ? '-' : dato.talla_camiseta
            //
            // var inputCamiseta = document.createElement("input")
            // inputCamiseta.setAttribute("type", "checkbox")
            // inputCamiseta.setAttribute("id", dato.id_inscripcion)
            // inputCamiseta.classList.add("text-center") 
            // camiseta.appendChild(inputCamiseta)
            // fila.appendChild(camiseta)

            var euros = document.createElement("td")
            euros.textContent = dato.importe + '€'
            fila.appendChild(euros)

            if(dato.estado_pago == 1){fila.style.backgroundColor = 'lightgreen';}

            tbody.appendChild(fila)
        })

    }

    /**
     * Método para mostrar el item del navbar activo
     */
    activeNavbar() {
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.add('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.remove('active');
    }

    /**
     * Método que guarda la vista
     */
    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }
}