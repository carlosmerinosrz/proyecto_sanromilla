"use strict" //activo modo estricto
import {Router}  from './router.js'
import {Modelo}  from '../modelos/modelo.js'
import { VistaInscripcion } from '../vistas/inscripcion/vistainscripcion.js'
import {VistaPago} from '../vistas/pago/vistapago.js'
import {VistaConfirmacion} from '../vistas/confirmacion/vistaconfirmacion.js'
import { VistaFotos } from '../vistas/fotos/vistafotos.js'
import { VistaClasificacion } from '../vistas/clasificacion/vistaclasificacion.js'
import { VistaInicio } from '../vistas/inicio/vistainicio.js'


/**
 * Clase Controlador que maneja todo lo de la web pública
 */
export class Controlador{

    constructor() {
		$(document).ready(this.iniciar.bind(this))
        this.router=new Router;
        this.modelo=new Modelo;
        //Ejecutamos el mostrarInicio para que muestre la vista del inicio
        this.mostrarInicio()
	}

    /**
     * Método que inicia la web y añede los métodos a los botones 
     */
    iniciar(){

        //Nav
        let boton= document.getElementById('inscripciones')
        boton.onclick=this.mostrarInscripciones.bind(this)
        let inicio= document.getElementById('inicio')
        inicio.onclick=this.mostrarInicio.bind(this)
        let icono= document.getElementById('sanromilla')
        icono.onclick=this.mostrarInicio.bind(this)
        let clasificacion= document.getElementById('clasificacion')
        clasificacion.onclick=this.mostrarClasificacion.bind(this)
        let fotos= document.getElementById('fotos')
        fotos.onclick=this.mostrarFotos.bind(this)
        
    }

    /**
     * Método que oculta el menú
     * Como el menú está hecho con bootstrap, trae por defecto algunas clase como la de show que es la que muestra el desplegable del menu
     * Con este método le quitamos esa tabla cuando hacemos click a alguna opción del menu
     */
    ocultarMenu(){
        let desplegable=$('#collapsibleNavbar')
        desplegable.removeClass('show');
    }

    /**
     * Método que muestra la vista Inicio
     */
    async mostrarInicio(){
        window.scrollTo(0, 0);
        this.router.cargar("inicio")
        this.vistaFotos= new VistaInicio (this)
        //this.ocultarMenu()
    }


    /**
     * Método que muestra la vista Inscripciones
     */
    async mostrarInscripciones(datos){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar("inscripcion")
        const fechas = await this.obtenerFechasInscripcion(); // Get inscription dates
        const fechaActual = new Date(); // Current date
    
        // Check if the current date is between the start and end dates
        const inicioInscripcion = new Date(fechas[0].inicio_inscripcion);
        const finInscripcion = new Date(fechas[0].fin_inscripcion);
        if (fechaActual >= inicioInscripcion && fechaActual <= finInscripcion) {
            this.vistaInscripcion = new VistaInscripcion(this, datos); // If current date is within inscription dates, show inscription view
        } else {
            console.log("wawawawa")
            this.mostrarCerradas(); // If current date is outside inscription dates, show closed view
        }
    }
    


    /**
     * Método que muestra la vista pago
     */
    mostrarPago(inscripciones, correo){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar("pago")
        this.vistaPago=new VistaPago(this,inscripciones,correo)
    }

    /**
     * Método que muestra la vista fotos
     */
    mostrarFotos(){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar("fotos")
        this.vistaFotos= new VistaFotos (this)
    }

    mostrarCerradas(){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar("cerradas")
        this.vistaInscripcion=new VistaInscripcion(this)
    }
    /**
     * Método que muestra la vista clasificacion
     */
    mostrarClasificacion(){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar('clasificacion')
        this.vistaClasificacion= new VistaClasificacion(this)
    }

    /**
     * Método que muestra la vista confirmación
     * @param {array} datos 
     */
    mostrarConfirmacion(datos){
        window.scrollTo(0, 0);
        this.ocultarMenu()
        this.router.cargar("confirmacion")
        this.vistaConfirmacion = new VistaConfirmacion(this, datos)
    }
    
    /**
     * Método que llama al modelo y recibe las categorias de la bbdd
     * @returns array de categorias
     */
    async sacarCategorias(){
        console.log('estoy en aaap')
        let datos = await this.modelo.getCategorias()
        return datos;
    }

    /**
     * Método que llama al modelo y recibe todos los códigos de la bbdd
     * @returns array
     */
    async sacarCodigos(){
        let datos =await this.modelo.getCodigos()
        return datos.data
    }

    /**
     * Método que llama al modelo y recibe todos los datos de la clasificacion
     * @returns array
     */
    async getClasificacion(){
        return []
    }

    /**
     * Método que llama al modelo y recibe todos las fotos de la bbdd
     * @returns array
     */
    async getFotos(){
        let datos =await this.modelo.getFotos()
        return datos.data
    }

    /**
     * Método que inserta el código de inscripción en la bbdd
     * @param {int} id 
     * @param {string} codigo 
     */
    async insertarInscripciones(inscripciones, codigo, correo){
        console.log('CORREO'+ correo)
        let respuesta = await this.modelo.insertarInscripciones(inscripciones, codigo, correo)
        console.log(respuesta.data);
        if(respuesta.data!=1){
            console.log('Ha ocurrido un error')
        }
    }

    /**
 * Método que obtiene las fechas de inicio y fin de inscripción
 * @returns {Promise<Object>} Objeto con las fechas de inicio y fin
 */
    async obtenerFechasInscripcion() {
        try {
            const fechas = await this.modelo.getFechasInscripcion();
            return fechas.data; // Suponiendo que las fechas se devuelven como un objeto con propiedades 'fechaInicio' y 'fechaFin'
        } catch (error) {
            console.error("Error al obtener las fechas de inscripción:", error);
            return null;
        }
    }

        /**
 * Método que obtiene el precio de las camisetas y la foto de la San Romilla
 * @returns {Promise<Object>} Objeto con la foto y el precio.
 */
    async obtenerInformacion() {
        try {
            const informacion = await this.modelo.getInformacion();
            return informacion.data; 
        } catch (error) {
            console.error("Error al obtener la informacion:", error);
            return null;
        }
    }


}
const app= new Controlador()