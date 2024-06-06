"use strict" //activo modo estricto

/**
 * Clase Usuarios
 */
export class Categorias {

    constructor(controlador) {
        this.controlador = controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar() {
        this.categorias = [];
        this.getCategorias();

        this.activeNavbar()

        //Guardar página para recargar
        this.saveViewState();

        document.getElementById('btn-crear-categorias').addEventListener('click', (event) =>
            this.crearCategoria()
        );
    }

    /**
     * Método para traer un listado de usuarios y roles
     * @returns {Promise<void>}
     */
    async getCategorias(){
        document.getElementById('tbody-categorias').innerHTML = '';

        this.categorias = await this.controlador.getCategorias();
        // console.log(this.categorias)
        this.categorias.forEach((categoria) => {
            // Crea una nueva fila en la tabla
            const fila = document.createElement('tr');


            const nombre = document.createElement('td');
            nombre.textContent = categoria.nombre;


            const descripcion = document.createElement('td');
            descripcion.textContent = categoria.descripcion;

            const acciones = document.createElement('td');


            const iconoEditar = document.createElement('i');
            iconoEditar.className = 'fa-solid fa-pencil iconos-acciones';
            iconoEditar.classList.add('pointer');
            iconoEditar.setAttribute('id', `editar-${categoria.id_categoria}`);
            iconoEditar.addEventListener('click', () => {
                this.editarCategoria(categoria)
            });

            const iconoEliminar = document.createElement('i');
            iconoEliminar.className = 'fa-solid fa-trash-can iconos-acciones';
            iconoEliminar.setAttribute('id', `eliminar-${categoria.id_categoria}`);
            iconoEliminar.classList.add('pointer');
            iconoEliminar.addEventListener('click', () => {
                this.eliminarCategoria(categoria.id_categoria, categoria.nombre)
            });

            acciones.appendChild(iconoEditar);
            acciones.appendChild(iconoEliminar);

            // Agrega las celdas a la fila
            fila.appendChild(nombre);
            fila.appendChild(descripcion);
            fila.appendChild(acciones);

            // Agrega la fila a la tabla
            const tbody = document.querySelector('tbody');
            tbody.appendChild(fila);
        });
    }

    /**
     * Método para guardar la vista antes de la recarga
     */
    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

    /**
     * Método para eliminar un usuario
     * @param {int} id 
     * @param {string} nombre 
     */
    eliminarCategoria(id, nombre){
        Swal.fire({
            title: '¿Está seguro?',
            text: "Categoría " + nombre
                + " será eliminado y no podrá ser recuperado",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, lo estoy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.controlador.eliminarCategoria(id);
                    Swal.fire(
                        '¡Eliminado!',
                        'La categoria ' + nombre
                        + ' ha sido eliminado',
                        'success'
                    );
                    this.getCategorias();
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar la categoría. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    /**
     * Método para modificar un usuario
     * @param {array} categoria 
     */
    async editarCategoria(categoria){
        // console.log(categoria)
        $('#app-container').empty()
    
        let contenedor=document.createElement('div')
        contenedor.classList.add('container')
        $('#app-container').append(contenedor)
    
        let formulario=document.createElement('div')
        formulario.classList.add('text-center')
        let h1=document.createElement('h1')
        contenedor.append(h1)
        contenedor.append(formulario)
        h1.textContent='Modificar Categorias'
        h1.classList.add('text-center', 'mt-5')
    
        let label1=document.createElement('label')
        label1.classList.add('form-label','mt-4')
        label1.textContent='Nombre'
        formulario.append(label1)
        
        let input1=document.createElement('input')
        input1.classList.add('form-control','mt-4')
        input1.type='text' 
        input1.id='nombreCategoria'
        formulario.append(input1)
        
        let label2=document.createElement('label')
        label2.classList.add('form-label','mt-4')
        label2.textContent='Descripcion'
        formulario.append(label2)
        
        let input2=document.createElement('input')
        input2.classList.add('form-control','mt-4')
        input2.type='text' 
        input2.id='descripcionCategoria'
        formulario.append(input2)
        
        let label3=document.createElement('label')
        label3.classList.add('form-label','mt-4')
        label3.textContent='Edad'
        formulario.append(label3)
        
        let input3=document.createElement('input')
        input3.classList.add('form-control','mt-4')
        input3.type='number'
        input3.id='edadCategoria'
        formulario.append(input3)
        
        let label4=document.createElement('label')
        label4.classList.add('form-label','mt-4')
        label4.textContent='Precio'
        formulario.append(label4)
        
        let input4=document.createElement('input')
        input4.classList.add('form-control','mt-4')
        input4.type='text' 
        input4.id='precioCategoria'
        formulario.append(input4)
        
        let label5=document.createElement('label')
        label5.classList.add('form-label','mt-4')
        label5.textContent='Distancia'
        formulario.append(label5)
        
        let input5=document.createElement('input')
        input5.classList.add('form-control','mt-4')
        input5.type='text'
        input5.id='distanciaCategoria'
        formulario.append(input5)
        
        let label6=document.createElement('label')
        label6.classList.add('form-label','mt-4')
        label6.textContent='Recorrido'
        formulario.append(label6)
        
        let input6=document.createElement('input')
        input6.classList.add('form-control','mt-4')
        input6.type='text' 
        input6.id='recorridoCategoria'
        formulario.append(input6)
        
        let label7=document.createElement('label')
        label7.classList.add('form-label','mt-4')
        label7.textContent='Hora'
        formulario.append(label7)
        
        let input7=document.createElement('input')
        input7.classList.add('form-control','mt-4')
        input7.type='time' 
        input7.id='horaCategoria'
        formulario.append(input7)
        

    
        input1.value = categoria.nombre;
        input2.value = categoria.descripcion;
        input3.value = categoria.edad;
        input4.value = categoria.precio;
        input5.value = categoria.distancia;
        input6.value = categoria.recorrido;
        input7.value = categoria.hora;
    
        let enviar=document.createElement('button');
        enviar.classList.add('btn', 'btn-success', 'mt-5');
        enviar.textContent='Enviar';
        enviar.onclick = this.enviarModificado.bind(this, categoria);
        formulario.append(enviar);
    }
    

    /**
     * Método de crear un Usuario
     */
    async crearCategoria() {
        $('#app-container').empty();

        let contenedor = document.createElement('div');
        contenedor.classList.add('container');
        $('#app-container').append(contenedor);

        let formulario = document.createElement('div');
        formulario.classList.add('text-center');
        let h1 = document.createElement('h1');
        contenedor.append(h1);
        contenedor.append(formulario);
        h1.textContent = 'Nueva Categoría';
        h1.classList.add('text-center', 'mt-5');

        let label1 = document.createElement('label');
        label1.classList.add('form-label', 'mt-4');
        label1.textContent = 'Nombre';
        formulario.append(label1);

        let input1 = document.createElement('input');
        input1.classList.add('form-control', 'mt-4');
        input1.type = 'text';
        input1.id = 'nombreCategoria'; 
        formulario.append(input1);

        let label2 = document.createElement('label');
        label2.classList.add('form-label', 'mt-4');
        label2.textContent = 'Descripcion';
        formulario.append(label2);

        let input2 = document.createElement('input');
        input2.classList.add('form-control', 'mt-4');
        input2.type = 'text';
        input2.id = 'descripcionCategoria'; 
        formulario.append(input2);

        let label3 = document.createElement('label');
        label3.classList.add('form-label', 'mt-4');
        label3.textContent = 'Edad';
        formulario.append(label3);

        let input3 = document.createElement('input');
        input3.classList.add('form-control', 'mt-4');
        input3.type = 'number';
        input3.id = 'edadCategoria'; 
        formulario.append(input3);

        let label4=document.createElement('label')
        label4.classList.add('form-label','mt-4')
        label4.textContent='Precio'
        formulario.append(label4)
        
        let input4=document.createElement('input')
        input4.classList.add('form-control','mt-4')
        input4.type='text' 
        input4.id='precioCategoria'
        formulario.append(input4)
        
        let label5=document.createElement('label')
        label5.classList.add('form-label','mt-4')
        label5.textContent='Distancia'
        formulario.append(label5)
        
        let input5=document.createElement('input')
        input5.classList.add('form-control','mt-4')
        input5.type='text'
        input5.id='distanciaCategoria'
        formulario.append(input5)
        
        let label6=document.createElement('label')
        label6.classList.add('form-label','mt-4')
        label6.textContent='Recorrido'
        formulario.append(label6)
        
        let input6=document.createElement('input')
        input6.classList.add('form-control','mt-4')
        input6.type='text' 
        input6.id='recorridoCategoria'
        formulario.append(input6)

        let label7 = document.createElement('label');
        label7.classList.add('form-label', 'mt-4');
        label7.textContent = 'Hora';
        formulario.append(label7);

        let input7 = document.createElement('input');
        input7.classList.add('form-control', 'mt-4');
        input7.type = 'time';
        input7.id = 'horaCategoria'; 
        formulario.append(input7);

        let enviar = document.createElement('button');
        enviar.classList.add('btn', 'btn-success', 'mt-5');
        enviar.textContent = 'Enviar';
        enviar.onclick = this.enviarNuevo.bind(this);
        formulario.append(enviar);
    }

    

    /**
     * Método que monta el nav
     */
    activeNavbar() {
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('d-none');
        document.getElementById('linkFotos').classList.remove('d-none');
        document.getElementById('linkPagos').classList.remove('d-none');
        document.getElementById('linkCarrera').classList.remove('d-none');
        document.getElementById('linkCategorias').classList.add('d-none');
        document.getElementById('linkInscripciones').classList.remove('d-none');
        document.getElementById('linkUsuarios').classList.remove('d-none');
        document.getElementById('linkCorreos').classList.remove('d-none');
        document.getElementById('linkMarcas').classList.remove('d-none');
        document.getElementById('linkTallas').classList.remove('d-none');
        document.getElementById('linkNuevaSanRomilla').classList.remove('d-none');
    }

    /**
     * Método que guarda un nuevo usuario
     */
    async enviarNuevo() {
        let nombre = $('#nombreCategoria').val();
        let descripcion = $('#descripcionCategoria').val();
        let edad = $('#edadCategoria').val();
        let hora = $('#horaCategoria').val();
        let precio = $('#precioCategoria').val();
        let distancia = $('#distanciaCategoria').val();
        let recorrido = $('#recorridoCategoria').val();
    
        if (nombre === '') {
            Swal.fire({
                title: 'Nombre vacío',
                text: 'Recuerde rellenar el nombre.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }else{
            let validacion = await this.validarNombreCategoria(nombre);
            if(validacion === '0'){
                if (edad === '') {
                    Swal.fire({
                        title: 'Edad vacía',
                        text: 'Recuerde rellenar la edad.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else if (precio === '') {
                    Swal.fire({
                        title: 'Precio vacío',
                        text: 'Recuerde rellenar el precio.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else if (distancia === '') {
                    Swal.fire({
                        title: 'Distancia vacía',
                        text: 'Recuerde rellenar la distancia.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    let respuesta = await this.controlador.newCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido);
                    if (respuesta.data > 0) {
                        Swal.fire({
                            title: 'Categoría guardada',
                            text: 'Se ha guardado la categoría con éxito.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                        this.controlador.mostrarCategorias();
                    } else {
                        Swal.fire({
                            title: 'Ups.. ha habido algún error',
                            text: 'Contacta con algún administrador.',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                }
            }else{
                Swal.fire({
                    title: 'Nombre Duplicado',
                    text: 'Recuerde no poner el mismo nombre que otra categoría',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    }

    async validarNombreCategoria(nombre) {
        let respuesta = await this.controlador.validarNameCategoria(nombre);
        return respuesta.data;
    }
    
    

    /**
     * Método que coge los datos para modificar un usuario y lo manda al controlador
     */
    async enviarModificado(categoria){
        let nombre = $('#nombreCategoria').val();
        let descripcion = $('#descripcionCategoria').val();
        let edad = $('#edadCategoria').val();
        let hora = $('#horaCategoria').val();
        let precio = $('#precioCategoria').val();
        let distancia = $('#distanciaCategoria').val();
        let recorrido = $('#recorridoCategoria').val();
    
        if (nombre === '') {
            Swal.fire({
                title: 'Nombre vacío',
                text: 'Recuerde rellenar el nombre.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }else{
            let validacion = await this.validarNombreCategoria(nombre);
            if(validacion === '0'){
                if (edad === '') {
                    Swal.fire({
                        title: 'Edad vacía',
                        text: 'Recuerde rellenar la edad.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else if (precio === '') {
                    Swal.fire({
                        title: 'Precio vacío',
                        text: 'Recuerde rellenar el precio.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else if (distancia === '') {
                    Swal.fire({
                        title: 'Distancia vacía',
                        text: 'Recuerde rellenar la distancia.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                } else {
                    let respuesta = await this.controlador.updateCategorias(nombre, descripcion, edad, hora, precio, distancia, recorrido, categoria.id_categoria);
                    if (respuesta.data > 0) {
                        Swal.fire({
                            title: 'Categoría guardada',
                            text: 'Se ha guardado la categoría con éxito.',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });
                        this.controlador.mostrarCategorias();
                    } else {
                        Swal.fire({
                            title: 'Ups.. ha habido algún error',
                            text: 'Contacta con algún administrador.',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                }
            }else{
                Swal.fire({
                    title: 'Nombre Duplicado',
                    text: 'Recuerde no poner el mismo nombre que otra categoría',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
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
}