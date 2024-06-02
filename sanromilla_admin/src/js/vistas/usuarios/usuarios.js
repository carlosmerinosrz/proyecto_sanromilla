"use strict" //activo modo estricto

/**
 * Clase Usuarios
 */
export class Usuarios {

    constructor(controlador) {
        this.controlador = controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar() {
        this.usuarios = [];
        this.getUsuarios();

        this.montarNav()

        //Guardar página para recargar
        this.saveViewState();

        document.getElementById('btn-crear-usuario').addEventListener('click', (event) =>
            this.crearUsuario()
        );
    }

    /**
     * Método para traer un listado de usuarios y roles
     * @returns {Promise<void>}
     */
    async getUsuarios(){
        document.getElementById('tbody-usuarios').innerHTML = '';

        this.usuarios = await this.controlador.getUsuarios();
        // console.log(this.usuarios)
        this.usuarios.forEach((usuario) => {
            // Crea una nueva fila en la tabla
            const fila = document.createElement('tr');


            const nombre = document.createElement('td');
            nombre.textContent = usuario.nombre;

            const correo = document.createElement('td');
            const correoCompleto = usuario.correo;
            correo.textContent = correoCompleto.length > 50 ? correoCompleto.substring(0, 35) + '...' : correoCompleto;
            correo.setAttribute('title', correoCompleto);

            const roles = document.createElement('td');
            roles.textContent = usuario.roles;

            const acciones = document.createElement('td');


            const iconoEditar = document.createElement('i');
            iconoEditar.className = 'fa-solid fa-pencil iconos-acciones';
            iconoEditar.classList.add('pointer');
            iconoEditar.setAttribute('id', `editar-${usuario.id_colaborador}`);
            iconoEditar.addEventListener('click', () => {
                this.editarUsuario(usuario)
            });

            const iconoEliminar = document.createElement('i');
            iconoEliminar.className = 'fa-solid fa-trash-can iconos-acciones';
            iconoEliminar.setAttribute('id', `eliminar-${usuario.id_colaborador}`);
            iconoEliminar.classList.add('pointer');
            iconoEliminar.addEventListener('click', () => {
                this.eliminarUsuario(usuario.id_colaborador, usuario.nombre)
            });

            acciones.appendChild(iconoEditar);
            acciones.appendChild(iconoEliminar);

            // Agrega las celdas a la fila
            fila.appendChild(nombre);
            fila.appendChild(correo);
            fila.appendChild(roles);
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
    eliminarUsuario(id, nombre){
        Swal.fire({
            title: '¿Está seguro?',
            text: "El colaborador " + nombre
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
                    await this.controlador.eliminarUsuario(id);
                    Swal.fire(
                        '¡Eliminado!',
                        'El colaborador ' + nombre
                        + ' ha sido eliminado',
                        'success'
                    );
                    this.getUsuarios();
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar al colaborador. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    /**
     * Método para modificar un usuario
     * @param {array} usuario 
     */
    async editarUsuario(usuario){
        console.log(usuario)
        $('#app-container').empty()
    
        let contenedor=document.createElement('div')
        contenedor.classList.add('container')
        $('#app-container').append(contenedor)
    
        let formulario=document.createElement('div')
        formulario.classList.add('text-center')
        let h1=document.createElement('h1')
        contenedor.append(h1)
        contenedor.append(formulario)
        h1.textContent='Modificar Usuario'
        h1.classList.add('text-center', 'mt-5')
    
        let label1=document.createElement('label')
        label1.classList.add('form-label','mt-4')
        label1.textContent='Nombre'
        formulario.append(label1)
    
        let input1=document.createElement('input')
        input1.classList.add('form-control','mt-4')
        input1.style.type='text'
        input1.id='nombreUsuario'
        formulario.append(input1)
    
        let label2=document.createElement('label')
        label2.classList.add('form-label','mt-4')
        label2.textContent='Correo'
        formulario.append(label2)
    
        let input2=document.createElement('input')
        input2.classList.add('form-control','mt-4')
        input2.style.type='text'
        input2.id='correoUsuario'
        formulario.append(input2)
    
        let label3=document.createElement('label')
        label3.classList.add('form-label','mt-4')
        label3.textContent='Roles'
        formulario.append(label3)
    
        let rolesContainer = document.createElement('div');
        rolesContainer.classList.add('mt-2');
        formulario.append(rolesContainer);
    
        let html = '';
        let respuesta = await this.controlador.getRoles();
        if(respuesta.data.length != 0){
            console.log(respuesta.data);
            for(let item of respuesta.data){
                // console.log('*******');
                // console.log(item);
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'rol_' + item.id_rol;
                checkbox.value = item.nombre;
                checkbox.name = 'roles';
                if(usuario.roles.includes(item.nombre)){
                    checkbox.checked = true;
                }
                let label = document.createElement('label');
                label.htmlFor = 'rol_' + item.id_rol;
                label.textContent = item.nombre;
                rolesContainer.append(checkbox);
                rolesContainer.append(label);
                rolesContainer.append(document.createElement('br'));
            }
        } else {
            html += `<option>No hay roles</option>`;
        }
    
        input1.value = usuario.nombre;
        input2.value = usuario.correo;
    
        let enviar=document.createElement('button');
        enviar.classList.add('btn', 'btn-success', 'mt-5');
        enviar.textContent='Enviar';
        enviar.onclick = this.enviarModificado.bind(this, usuario);
        formulario.append(enviar);
    }
    

    /**
     * Método de crear un Usuario
     */
    async crearUsuario() {
        $('#app-container').empty();
    
        let contenedor = document.createElement('div');
        contenedor.classList.add('container');
        $('#app-container').append(contenedor);
    
        let formulario = document.createElement('div');
        formulario.classList.add('text-center');
        let h1 = document.createElement('h1');
        contenedor.append(h1);
        contenedor.append(formulario);
        h1.textContent = 'Nuevo Usuario';
        h1.classList.add('text-center', 'mt-5');
    
        let label1 = document.createElement('label');
        label1.classList.add('form-label', 'mt-4');
        label1.textContent = 'Nombre';
        formulario.append(label1);
    
        let input1 = document.createElement('input');
        input1.classList.add('form-control', 'mt-4');
        input1.style.type = 'text';
        input1.id = 'nombreUsuario';
        formulario.append(input1);
    
        let label2 = document.createElement('label');
        label2.classList.add('form-label', 'mt-4');
        label2.textContent = 'Correo';
        formulario.append(label2);
    
        let input2 = document.createElement('input');
        input2.classList.add('form-control', 'mt-4');
        input2.style.type = 'text';
        input2.id = 'correoUsuario';
        formulario.append(input2);
    
        let label3 = document.createElement('label');
        label3.classList.add('form-label', 'mt-4');
        label3.textContent = 'Roles';
        formulario.append(label3);
    
        let respuesta = await this.controlador.getRoles();
        if (respuesta.data.length != 0) {
            console.log(respuesta.data);
            for (let item of respuesta.data) {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = item.id_rol;
                checkbox.id = 'rol_' + item.id_rol; // Usamos un ID único para cada checkbox
                checkbox.name = 'user_new_roles';
                let label = document.createElement('label');
                label.textContent = item.nombre;
                label.htmlFor = checkbox.id;
                formulario.append(checkbox);
                formulario.append(label);
                formulario.append(document.createElement('br')); // Salto de línea para separar los checkboxes
            }
        } else {
            let noRolesLabel = document.createElement('label');
            noRolesLabel.textContent = 'No hay roles disponibles';
            formulario.append(noRolesLabel);
        }
    
        let enviar = document.createElement('button');
        enviar.classList.add('btn', 'btn-success', 'mt-5');
        enviar.textContent = 'Enviar';
        enviar.onclick = this.enviarNuevo.bind(this);
        formulario.append(enviar);
    }
    

    /**
     * Método que monta el nav
     */
    montarNav(){
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.add('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.remove('active');
    }

    /**
     * Método que guarda un nuevo usuario
     */
    async enviarNuevo() {
        let nombre = $('#nombreUsuario').val();
        let correo = $('#correoUsuario').val();
        let rolesSeleccionados = [];
        $("input[name='user_new_roles']:checked").each(function () {
            rolesSeleccionados.push($(this).attr('id').split('_')[1]);
        });
    
        if (nombre == '') {
            Swal.fire({
                title: 'Nombre vacío',
                text: 'Recuerde rellenar el nombre.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else if (correo == '') {
            Swal.fire({
                title: 'Correo vacío',
                text: 'Recuerde rellenar el correo.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else {
            if (this.validarCorreoElectronico(correo)) {
                let respuesta = await this.controlador.newUsuario(nombre, correo, rolesSeleccionados);
                if (respuesta.data > 0) {
                    Swal.fire({
                        title: 'Usuario guardado',
                        text: 'Se ha guardado el usuario con éxito.',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                    this.controlador.mostrarUsuarios();
                } else {
                    Swal.fire({
                        title: 'Ups.. ha habido algún error',
                        text: 'Contacta con algún administrador.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Correo no válido',
                    text: 'Compruebe y vuelva a enviar.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    }
    

    /**
     * Método que coge los datos para modificar un usuario y lo manda al controlador
     */
    async enviarModificado(usuario){
        let nombre = $('#nombreUsuario').val();
        let correo = $('#correoUsuario').val();
        let rolesSeleccionados = [];
        $("input[name='roles']:checked").each(function () {
            rolesSeleccionados.push($(this).attr('id').split('_')[1]);
        });
    
        if(nombre === ''){
            Swal.fire({
                title: 'Nombre vacío',
                text: 'Recuerde rellenar el nombre.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else if(correo === ''){
            Swal.fire({
                title: 'Correo vacío',
                text: 'Recuerde rellenar el correo.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        } else {
            if(this.validarCorreoElectronico(correo)){
                let respuesta = await this.controlador.updateUsuario(usuario.id_colaborador, nombre, correo, rolesSeleccionados);
                if(respuesta.data > 0){
                    Swal.fire({
                        title: 'Usuario modificado',
                        text: 'Se ha guardado el usuario con éxito.',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                    this.controlador.mostrarUsuarios();
                } else {
                    Swal.fire({
                        title: 'Ups.. ha habido algún error',
                        text: 'Contacta con algún administrador.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Correo no válido',
                    text: 'Compruebe y vuelva a enviar.',
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