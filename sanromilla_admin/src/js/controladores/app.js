"use strict" //activo modo estricto
import {Router}  from './router.js'
import {Modelo}  from '../modelos/modelo.js'
import { Home } from '../vistas/home/home.js'
import { Pago } from '../vistas/pago/pago.js'
import { Carrera } from '../vistas/carrera/carrera.js'
import {Inicio} from "../vistas/inicio/inicio.js"
import {Inscripciones} from "../vistas/inscripciones/inscripciones.js"
import { Fotos } from "../vistas/fotos/fotos.js"
import { EliminarFotos } from "../vistas/eliminarfotos/eliminarfotos.js"
import { Usuarios } from "../vistas/usuarios/usuarios.js"
import { Correos } from "../vistas/correos/correos.js"
import { Categorias } from "../vistas/categorias/categorias.js"
import { Marcas } from "../vistas/marcas/marcas.js"

/**
 * Clase Controlador que maneja todas las vistas de Administración
 */
export class Controlador{

    constructor() {
        this.controlador = this.controlador;
		$(document).ready(this.iniciar.bind(this))
        this.router=new Router;
        this.modelo=new Modelo;
        window.addEventListener('load', this.restoreLastView);
        //Ejecutamos el mostrarInicio para que muestre la vista del inicio
        this.mostrarInicio()
	}

    /**
     * Método que inicia la web y añede los métodos a los botones 
     */
    iniciar(){
        let titulo= document.getElementById('sanromillaTitulo')
        titulo.onclick=this.mostrarInicio.bind(this)

        // captura botones nav
        let home= document.getElementById('linkHome')
        home.onclick=this.mostrarHome.bind(this)
        let inscripciones= document.getElementById('linkInscripciones')
        inscripciones.onclick=this.mostrarInscripciones.bind(this)
        let pagos= document.getElementById('linkPagos')
        pagos.onclick=this.mostrarPagos.bind(this)
        let carrera= document.getElementById('linkCarrera')
        carrera.onclick=this.mostrarCarrera.bind(this)
        let cerrarSesion = document.getElementById('logout-nav')
        cerrarSesion.onclick = this.doLogout.bind(this)
        let fotos = document.getElementById('linkFotos')
        fotos.onclick = this.mostrarFotos.bind(this)
        let usuarios = document.getElementById('linkUsuarios')
        usuarios.onclick = this.mostrarUsuarios.bind(this)
        let correos = document.getElementById('linkCorreos')
        correos.onclick = this.mostrarCorreos.bind(this)
        let categorias = document.getElementById('linkCategorias')
        categorias.onclick = this.mostrarCategorias.bind(this)
        let marcas = document.getElementById('linkMarcas')
        marcas.onclick = this.mostrarMarcas.bind(this)
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
        this.router.cargar("inicio")
        this.vistaInicio = new Inicio(this)
        this.ocultarMenu()
    }

    /**
     * Método que muestra la vista Home
     */
    mostrarHome(){
        this.ocultarMenu()
        this.router.cargar("home")
        this.vistaHome = new Home(this)
    }

    /**
     * Método que carga la vista de Inscripciones
     */
    mostrarInscripciones(){
        this.ocultarMenu()
        this.router.cargar("inscripciones")
        this.vistaPago = new Inscripciones(this)
    }

    /**
     * Método que carga la vista de pagos
     */
    mostrarPagos(){
        this.ocultarMenu()
        this.router.cargar("pago")
        this.vistaPago = new Pago(this)
    }

    /**
     * Método que carga la vista de información de la carrera
     */
    mostrarCarrera(){
        this.ocultarMenu()
        this.router.cargar("carrera")
        this.vistaCarrera = new Carrera(this)
    }

    /**
     * Método que carga la vista de fotos
     */
    mostrarFotos(){
        this.ocultarMenu()
        this.router.cargar("fotos")
        this.vistaFotos = new Fotos(this)
    }

    /**
     * Método que carga la vista para eliminar fotos
     */
    mostrarEliminarFotos(){
        this.ocultarMenu()
        this.router.cargar("eliminarfotos")
        this.vistaEliminarFotos = new EliminarFotos(this)
    }

    /**
     * Método para cargar la vista de roles y usuarios
     */
    mostrarUsuarios(){
        this.ocultarMenu()
        this.router.cargar("usuarios")
        this.visitarUsuarios = new Usuarios(this)
    }

    mostrarCorreos(){
        this.ocultarMenu()
        this.router.cargar("correos")
        this.visitarUsuarios = new Correos(this)

    }


    /**
     * Método para cerrar la sesión
     */
    doLogout(){
        sessionStorage.clear();
        localStorage.clear();
        window.location.reload();
        this.mostrarInicio();
    }

    /**
     * Método que llama al modelo para obtener las inscripciones
     * @param {int} codigo 
     * @returns aray
     */
    async getInscripciones(tipoBusqueda, codigo){
        let datos = await this.modelo.getInscripciones(tipoBusqueda, codigo)
        return datos;
    }

    /**
     * Método para obtener el precio de la camiseta.
     * @returns {Promise<*>}
     */
    async getPrecioCamiseta(){
        let precio = await this.modelo.getPrecioCamiseta()
        return precio.data[0]['precio_camiseta'];
    }

    /**
     * Método para obtener la información de la carrera.
     * @returns {Promise<unknown>}
     */
    async getInformacion(){
        let datos = await this.modelo.getInformacion()
        return datos;
    }


    /**
     * Método que setea el dorsal.
     * @param datos
     * @returns {Promise<unknown>}
     */
    async setDorsal(datos){
        let seteado = await this.modelo.setDorsal(datos)
        return seteado;
    }

    /**
     * Método que setea la información nueva
     * @param datos
     * @returns {Promise<unknown>}
     */
    async modificarInfo(datos){
        let modif = await this.modelo.modificarInfo(datos)
        return modif;
    }

    /**
     * Método que modifica los archivos
     * @param {array} datos 
     * @returns array
     */
    async modArchivos(datos){
        console.log('datosen app: ', datos)
        let modif = await this.modelo.modArchivos(datos)
        return modif;
    }
  
    /*
     * Método que llama al modelo y recibe las categorias de la bbdd
     * @returns array de categorias
     */
    async getCategorias(){
        // console.log('***')
        let datos = await this.modelo.getCategorias()
        return datos;
    }

    async getCategoriasFotos(){
        // console.log('***')
        let datos = await this.modelo.getCategoriasFotos()
        return datos;
    }

    /**
     * Método para realizar el login comprobando usuario en la bbdd
     * @param token
     * @returns {Promise<void>}
     */
    async loginGoogle(credenciales){
        return await this.modelo.doLogin(credenciales)
    }


    /**
     * Recupera la última vista de al recargar
     */
    restoreLastView = () => {
        var lastViewHTML = localStorage.getItem('lastView');
        if (lastViewHTML) {
            document.body.innerHTML = lastViewHTML;
            this.iniciar();
        }
    }

    /**
     * Subida de fotos al servidor
     * @param FD FormData con las imágenes
     * @param categoria id de la categoría elegida
     * @returns {Promise<*|undefined>}
     */
    async subirFotos(FD, categoria){
        return await this.modelo.subirFotos(FD, categoria)
    }

    /**
     * Trae fotos de la base de datos dependiendo de la categoría seleccionada
     * @param categoria
     * @returns {Promise<*>}
     */
    async traerFotos(categoria){
        let datos = await this.modelo.traerFotos(categoria)
        return datos.data
    }

    /**
     * Método para eliminar las fotos seleccionadas de una categoría
     * @param seleccionadas
     * @param categoria
     * @returns {Promise<void>}
     */
    async eliminarFotos(seleccionadas, categoria){
        await this.modelo.eliminarFotos(seleccionadas, categoria);
    }

    /**
     * Método para eliminar todas las fotos de una categoría
     * @param categoria
     * @returns {Promise<void>}
     */
    async eliminarAllFotos(categoria){
        this.data = await this.modelo.eliminarAllFotos(categoria);
    }

    /**
     * Método para traer lista de usuarios
     */
    async getUsuarios(){
        this.data = await this.modelo.getUsuarios();
        return this.data;
    }

    /**
     * Método para eliminar usuario
     * @param id
     * @returns {Promise<void>}
     */
    async eliminarUsuario(id){
        this.data = await this.modelo.eliminarUsuario(id)
    }

    /**
     * Método que llama al modelo para pedir los roles de la bbdd
     * @returns array de roles
     */
    async getRoles(){
        let datos = await this.modelo.getRoles()
        return datos;
    }

    /**
     * Método que llama al modelo para guardar un usuario
     * @param {string} nombre 
     * @param {string} correo 
     * @param {int} rol 
     * @returns array
     */
    async newUsuario(nombre, correo, rol){
        let datos = await this.modelo.newUsuario(nombre, correo, rol)
        return datos;
    }

    /**
     * Método que llama al modelo para modificar un usuario
     * @param {string} nombre 
     * @param {string} correo 
     * @param {int} rol 
     * @returns array
     */
    async updateUsuario(id,nombre,correo,rol){
        let datos = await this.modelo.updateUsuario(id,nombre, correo, rol)
        return datos;
    }

    // Nuevo @carlosmerinosrz

    async mostrarCategorias(){
        this.ocultarMenu()
        this.router.cargar("categorias")
        this.vistaCategorias = new Categorias(this)
    }

    async mostrarMarcas(){
        this.ocultarMenu()
        this.router.cargar("marcas")
        this.vistaMarcas = new Marcas(this)
    }

    async getCategorias(){
        this.data = await this.modelo.getCategorias();
        return this.data;
    }

    async newCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido){
        let datos = await this.modelo.newCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido)
        return datos;
    }

    async updateCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido, id){
        let datos = await this.modelo.updateCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido, id)
        return datos;
    }


    async validarNameCategoria(nombre){
        this.data = await this.modelo.validarNameCategoria(nombre);
        return this.data;
    }

    async eliminarCategoria(id){
        this.data = await this.modelo.eliminarCategoria(id);
        return this.data;
    }

    async getTallasCamisetas(){
        let datos = await this.modelo.getTallasCamisetas()
        return datos;
    }

        /**
     * Método para enviar los datos del correo al modelo
     * @param {string} subject - El asunto del correo
     * @param {string} message - El mensaje del correo
     * @returns {Promise<Object>} - Los datos recibidos del modelo
     */
        async enviarCorreo(subject, message) {
            console.log("11"+subject,message)
            let datos = await this.modelo.enviarCorreo(subject, message);
            return datos;
        }

}
const app= new Controlador()