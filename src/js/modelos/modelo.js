"use strict" //activo modo estricto

/**
 * Clase Modelo quee realiza llamadas ajax al servidor
 */
export class Modelo{
    constructor(){
        this.base_url='./php/index.php/'
    }

    /**
     * Método que pide las categorías de la bbdd
     * @returns array
     */
    async getCategorias(){
        return new Promise(resolve => {
            $.get(this.base_url + 'categorias/'+'getCategorias', {
                
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método que pide los códigos de la bbdd
     * @returns array
     */
    async getCodigos(){
        return new Promise(resolve => {
            $.get(this.base_url + 'inscripciones/'+'getCodigos', {
                
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * método que guarda las inscripciones en la bbdd
     * @param {int} id 
     * @param {string} codigo 
     * @param {string} correo 
     * @returns array
     */
    async insertarInscripciones(inscripciones,codigo, correo){
        return new Promise(resolve => {
            $.get(this.base_url + 'inscripciones/'+'insertarInscripciones', {
                inscripciones:inscripciones,
                codigo:codigo,
                correo:correo
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método que pide las fotos a la bbdd
     * @returns array
     */
    async getFotos(){
        return new Promise(resolve => {$.get(this.base_url + 'imagenes/'+'getFotos', {
            }, (data) => {
                resolve({
                    data});});});}

    /**
     * Método que pide las fechas de inscripción de la bbdd
     * @returns {Promise<Array>} Dates array
     */
    async getFechasInscripcion() {
        return new Promise(resolve => {
            $.get(this.base_url + 'inscripciones/' + 'getFechasInscripcion', {
                
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método que pide el cartel y el precio de la camiseta de la bbdd
     * @returns {Promise<Array>} Dates array
     */
    async getInformacion() {
        return new Promise(resolve => {
            $.get(this.base_url + 'informacion/' + 'getInformacion', {
                
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

        /**
     * Método que pide el reglamento de la bbdd
     * @returns {Promise<Array>} Reglamento array
     */
        async getReglamento() {
            return new Promise(resolve => {
                console.log("pitopitogorgorito")
                $.get(this.base_url + 'informacion/' + 'getReglamento', {

                }, (data) => {
                    resolve({
                        data
                    });
                });
            });
        }

}