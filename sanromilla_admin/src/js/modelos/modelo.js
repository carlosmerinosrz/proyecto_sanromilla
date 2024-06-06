"use strict" //activo modo estricto

/**
 * Clase Modelo de Administración
 */
export class Modelo{
    constructor(){
        this.base_url='./php/index.php/'
    }

    /**
     * Método par aretornar las inscripciones según el código.
     * @param tipoBusqueda
     * @param codigo
     * @returns array
     */
    async getInscripciones(tipoBusqueda, codigo){
        return new Promise(resolve => {
            $.get(this.base_url + 'inscripciones/'+'getInscripciones', {
                tipoBusqueda: tipoBusqueda,
                codigo:codigo,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

        /**
     * Método par modificar talla de las camisetas.
     * @param codigo
     * @returns array
     */
    async getInscripcionesTalla(codigo){
        return new Promise(resolve => {
            $.get(this.base_url + 'inscripciones/'+'getInscripcionesTalla', {
                codigo:codigo,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async setCambios(datos) {
        return new Promise(resolve => {
            $.ajax({
                url: this.base_url + 'inscripciones/setCambios',
                type: 'POST',
                data: { datos: JSON.stringify(datos) },
                success: function(data) {
                    resolve({ data });
                }
            });
        });
    }
    

    async getCategoriasFotos(){
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
     * Método para obtener la información de la carrera
     * @param tipoBusqueda
     * @param codigo
     * @returns {Promise<unknown>}
     */
    async getInformacion(){
        return new Promise(resolve => {
            $.get(this.base_url + 'informacion/'+'getInformacion', (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método para obtener el precio de la camiseta
     * @returns {Promise<unknown>}
     */
    async getPrecioCamiseta(){
        return new Promise(resolve => {
            $.get(this.base_url + 'informacion/'+'getPrecioCamiseta', (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async getTallasCamisetas(){
        return new Promise(resolve => {
            $.get(this.base_url + 'tallas/'+'getTallasCamisetas', (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método para setear el dorsal
     * @param datos
     * @returns {Promise<unknown>}
     */
    async setDorsal(datos) {
      
        return new Promise(resolve => {
            $.ajax({
                url: this.base_url + 'inscripciones/asignarDorsal',
                type: 'POST',
                data: { datos: JSON.stringify(datos) },
                success: function(data) {
                    resolve({ data });
                }
            });
        });
    }

    /**
     * Método para modificar la información de la carrera.
     * @param datos
     * @returns {Promise<unknown>}
     */
    async modificarInfo(datos) {
        return new Promise(resolve => {
            $.ajax({
                url: this.base_url + 'informacion/modificarInfo',
                type: 'POST',
                //data: { datos: JSON.stringify(datos) },
                data: { datos: datos },
                success: function(data) {
                    resolve({ data });
                }
            });
        });
    }

    /**
     * Método para modificar el cartel.
     * @param datos
     * @returns {Promise<unknown>}
     */
    async modArchivos(datos) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}informacion/modificarArchivos`,
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }

    /*
     * Método para realizar el login, se manda el token y se comprueba el email que está en el payload
     * @param token string con el token
     * @returns {Promise<unknown>}
     */
    async doLogin(token) {
        return new Promise(resolve => {
            $.post({
                url: `${this.base_url}login/comprobarUsuario`,
                data: {token: token},
                success: (data) => {
                    resolve(data);
                },
                error: (error) => {
                    console.log('Error en la solicitud:', error.responseText);
                    resolve(error);
                }
            });
        });
    }

    /**
     * Método que envía al servidor las imágenes en un FormData
     * @param FD FormData con los datos de las imágenes
     * @param categoria id de la categoría
     * @returns {Promise<*>}
     */
    async subirFotos(FD, categoria) {
        try {
            FD.append("categoria", categoria)
            const response = await $.ajax({
                url: `${this.base_url}fotos/subirFotos`,
                type: 'POST',
                data: FD,
                processData: false,
                contentType: false,
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }

    /**
     * Devuelve todas las fotos de una categoría
     * @param categoria id de la categoría
     * @returns {Promise<unknown>}
     */
    async traerFotos(categoria){
        return new Promise(resolve => {
            $.get(this.base_url + 'fotos/'+'getFotos', {
                categoria: categoria,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Elimina las fotos seleccionadas
     * @param seleccionadas array numérico con os id de las fotos a eliminar
     * @returns {Promise<void>}
     */
    async eliminarFotos(seleccionadas, categoria) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}fotos/eliminarFotosSeleccionadas`,
                type: 'POST',
                data: JSON.stringify({ seleccionadas, categoria }),
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }

    /**
     * Elimina todas las fotos de una categoría
     * @param categoria id de la categoría
     * @returns {Promise<unknown>}
     */
    async eliminarAllFotos(categoria) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}fotos/eliminarAllFotos`,
                type: 'POST',
                data: JSON.stringify({ categoria }),
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }

    /**
     *
     * @returns {Promise<any>}
     */
    async getUsuarios() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.base_url}usuarios/getUsuarios`,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    resolve(data);
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Método para eliminar usuario
     * @param categoria
     * @returns {Promise<*>}
     */
    async eliminarUsuario(id) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}usuarios/eliminarUsuario`,
                type: 'POST',
                data: JSON.stringify({ id }),
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }

    /**
     * Método que pide todos los roles
     * @returns array de roles
     */
    async getRoles(){
        return new Promise(resolve => {
            $.get(this.base_url + 'roles/'+'getRoles', {
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método que manda a la bbdd un nuevo usuario
     * @param {string} nombre 
     * @param {string} correo 
     * @param {int} rol 
     */
    async newUsuario(nombre, correo, rol){
        return new Promise(resolve => {
            $.get(this.base_url + 'usuarios/'+'newUsuario', {
                nombre:nombre,
                correo:correo,
                rol:rol
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    /**
     * Método que manda a la bbdd una modificación usuario
     * @param {string} nombre 
     * @param {string} correo 
     * @param {int} rol 
     */
    async updateUsuario(id,nombre, correo, rol){
        return new Promise(resolve => {
            $.get(this.base_url + 'usuarios/'+'updateUsuario', {
                id:id,
                nombre:nombre,
                correo:correo,
                rol:rol
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async getCategorias() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.base_url}categorias/getCategorias`,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    resolve(data);
                },
                error: function(xhr, status, error) {
                    reject(error);
                }
            });
        });
    }

    async newCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido){
        // console.log(precio);
        // console.log(nombre);
        return new Promise(resolve => {
            $.get(this.base_url + 'categorias/'+'newCategorias', {
                nombre:nombre,
                descripcion:descripcion,
                edad:edad,
                precio:precio,
                distancia:distancia,
                recorrido:recorrido,
                hora:hora,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async updateCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido, id){
        return new Promise(resolve => {
            $.get(this.base_url + 'categorias/'+'updateCategorias', {
                nombre:nombre,
                descripcion:descripcion,
                edad:edad,
                precio:precio,
                distancia:distancia,
                recorrido:recorrido,
                hora:hora,
                id: id,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async validarNameCategoria(nombre){
        return new Promise(resolve => {
            $.get(this.base_url + 'categorias/'+'validarNameCategoria', {
                nombre:nombre,
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async eliminarCategoria(id) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}categorias/eliminarCategoria`,
                type: 'POST',
                data: JSON.stringify({ id }),
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }
    
    async searchInscripciones(input, tipoBusqueda) {
        try {
            const response = await $.ajax({
                url: `${this.base_url}inscripciones/searchInscripciones`,
                type: 'POST',
                data: JSON.stringify({ input: input, tipoBusqueda: tipoBusqueda }),
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.error('Error en la solicitud:', error.responseText);
            return error;
        }
    }
    
    async eliminarSanRomilla() {
        try {
            const response = await $.ajax({
                url: `${this.base_url}inscripciones/eliminarSanRomilla`,
                type: 'POST',
                contentType: 'application/json',
            });
            return response;
        } catch (error) {
            console.log('Error en la solicitud:', error.responseText);
            return error;
        }
    }
    
    /**
     * Método para enviar el correo electrónico
     * @param {string} subject - El asunto del correo
     * @param {string} message - El mensaje del correo
     * @returns {Promise<*>}
     */
    async enviarCorreo(subject, message) {
        return new Promise(resolve => {
            $.post(this.base_url + 'correos/enviarCorreo', {
                subject: subject,
                message: message
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async enviarDatosCarrera(raceData) {
        return new Promise(resolve => {
            $.post(this.base_url + 'marcas/enviarDatosCarrera', {
                raceData: raceData
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }

    async comprobarCategoria(id_categoria) {
        return new Promise(resolve => {
            $.post(this.base_url + 'marcas/comprobarCategoria', {
                id_categoria: id_categoria
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }
 
    async exportarExcel(id_categoria) {
        return new Promise(resolve => {
            $.post(this.base_url + 'marcas/exportarExcel', {
                id_categoria: id_categoria
            }, (data) => {
                resolve({
                    data
                });
            });
        });
    }
}