"use strict" //activo modo estricto

/**
 * Clase Vista de Confirmacion
 */
export class VistaConfirmacion{

    inscripciones = null;
      
    constructor(controlador, datos){
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
        this.inscripciones = datos;
        //this.btnpagar.addEventListener('click', console.log('holi'))
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador 
     */
    async iniciar(controlador){
        this.div=document.getElementById('confirmacion')
        this.btnpagar=document.getElementById('btnPagar')
        this.btnpagar.onclick=this.irPago.bind(this)

        this.btnVolver=document.getElementById('btnVolver')
        this.btnVolver.onclick=this.volverInscripcion.bind(this)
        
        this.cargarDatos()
    }

    /**
     * Méotodo que carga los datos de las inscripciones
     * @returns boolean
     */
    cargarDatos(){

        var grupoInscripciones = document.getElementById('grupoInscripciones')

        var contador = 1;

        this.inscripciones.forEach(function(dato) {

            // elemento div contenedor 
            var div = document.createElement('div');
            div.setAttribute('class', 'rounded bg-warning col-sm-3 m-1 p-3');

            // elemento h4
            var h4 = document.createElement('h4');
            h4.textContent = 'Inscripción ' + contador;
            div.appendChild(h4);

            // párrafos
            var p1 = document.createElement('p');
            p1.textContent = dato.nombre +' '+ dato.apellidos;
            div.appendChild(p1);

            // precio
            var p2 = document.createElement('p');
            p2.textContent = 'Inscripción: ';
            var b1 = document.createElement('b');
            b1.textContent = dato.precioDorsal + '€';
            p2.appendChild(b1);
            div.appendChild(p2);

            
            // Agrega el div al contenedor
            if(dato.nombre != '' && dato.precioDorsal != ''){
                grupoInscripciones.appendChild(div);
                contador++
            }
        });
        this.precioTotal()
        return true;
    }

    /**
     * Método que saca el precio total
     */
    precioTotal(){
        var precioTotal = document.getElementById('precioTotal');
        var total = 0;
        for (let dato of this.inscripciones){
            if(dato.nombre != '' && dato.precioDorsal != ''){
                let dorsal = parseInt(dato.precioDorsal);
                console.log()
                total += dorsal ;
            }
        }
        precioTotal.textContent = total + '€';
    }

    /**
     * Método que llama al controlador para mostrar la vista pago
     */
    irPago(){
        let check=$('#checkLegal')
        let correo=$('#correo').val()
        if(check.is(':checked')){       //si lo legal esta check
            if(correo!=''){     //si esta el correo
                if(this.validarCorreoElectronico(correo)){
                    this.controlador.mostrarPago(this.inscripciones, correo)
                }
                else{
                    Swal.fire({
                        title: 'Correo no válido',
                        text: 'Compruebe y vuelva a enviar.',
                        icon: 'error',
                        confirmButtonText: 'Vale!'
                      })
                }
            }
            else{
                Swal.fire({
                    title: 'Correo vacío',
                    text: 'Recuerde rellenar el correo.',
                    icon: 'warning',
                    confirmButtonText: 'Vale!'
                  })
            }
        }
        else{
            Swal.fire({
                title: 'Avisos Legales',
                text: 'Debe aceptar los avisos legales antes de continuar.',
                icon: 'error',
                confirmButtonText: 'Vale!'
              })
        }
        
    }

    /**
     * Valida si el correo introducido es válido
     * @param correo
     * @returns {boolean}
     */
    validarCorreoElectronico(correo) {
        // Expresión regular para validar el formato de correo electrónico
        const regexCorreo = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

        // Verificar si el correo cumple con el formato válido
        if (!regexCorreo.test(correo)) {
            return false;
        }

        return true;
    }


    /**
     * Método que llama al controlador para mostrar la vista inscripciones
     */
    volverInscripcion(){
        this.controlador.mostrarInscripciones(this.inscripciones)
    }
}