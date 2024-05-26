"use strict" //activo modo estricto

/**
 * Clase Eliminar Fotos
 */
export class EliminarFotos {

    constructor(controlador) {
        this.controlador = controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar() {
        this.urlcat = 'babyrunner/';
        this.imagenesSeleccionadas = [];

        //Trae las categorías
        this.categorias = await this.controlador.getCategoriasFotos();

        //Función volver a subida de imágenes
        this.btnVolverAtras = document.getElementById('btnVolverAtras');
        this.btnVolverAtras.onclick = () => this.controlador.mostrarFotos(this.controlador);

        //Eliminar todas las imágenes
        document.getElementById('btnEliminarTodas').addEventListener('click', (event) =>
            this.eliminarTodas()
        );

        document.getElementById('btnEliminarSeleccionadas').addEventListener('click', (event) =>
            this.getImagenesSeleccionadas()
        );

        this.categorias.data.forEach((categoria) => {
            const option = document.createElement('option');
            option.value = categoria.id_categoria;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
        });

        document.getElementById('selectCategoria').addEventListener('change', (event) => {
            var selectedOption = event.target.options[event.target.selectedIndex];
            var encabezado = selectedOption.text;
            document.getElementById('encabezado-categoria').innerHTML = encabezado.charAt(0).toUpperCase() + encabezado.slice(1).toLowerCase();
            this.urlcat = encabezado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + '/'
            this.traerFotos();
        });

        this.traerFotos();
    }

    /**
     * Trae las fotos de la base de datos dependiendo de la categoría elegida
     */
    async traerFotos(){

        document.getElementById('image-container').innerHTML = '';
        this.categoria = document.getElementById('selectCategoria').value;
        console.log(this.categoria)
        try {
            const datos = await this.controlador.traerFotos(this.categoria);

            datos.forEach((imagen) => {
                const divImagen = document.createElement('div');
                divImagen.className = 'col-md-2 div-imagen-eliminar';
                divImagen.id = `div-imagen-${imagen.id_imagenes}`

                const img = document.createElement('img');
                img.src = 'assets/images/categorias/' + this.urlcat + imagen.url;
                img.alt = 'Imagen';

                divImagen.appendChild(img);
                document.getElementById('image-container').appendChild(divImagen);

                img.addEventListener('click', () => {
                    const imagenId = imagen.id_imagenes;

                    // Comprobar si la imagen ya está seleccionada
                    const imagenIndex = this.imagenesSeleccionadas.indexOf(imagenId);
                    if (imagenIndex !== -1) {
                        // La imagen ya está seleccionada, deseleccionarla y quitarla del array
                        this.imagenesSeleccionadas.splice(imagenIndex, 1);
                        divImagen.classList.remove('selected');
                    } else {
                        // La imagen no está seleccionada, seleccionarla y agregarla al array
                        this.imagenesSeleccionadas.push(imagenId);
                        divImagen.classList.add('selected');
                    }
                });
            });

        } catch (error) {
            console.error(error);
        }

        // Marcar/Desmarcar imágenes al hacer clic en ellas
        $(document).ready(function() {
            $('.image-container img').click(function() {
                $(this).toggleClass('selected');
            });
        });
    }

    /**
     * Método para controlar las imágenes seleccionadas para una futura eliminación
     * @returns {Promise<null>}
     */
    async getImagenesSeleccionadas() {

        if (this.imagenesSeleccionadas.entries().next().done){
            Swal.fire({
                title: 'Ninguna imagen seleccionada',
                text: 'Debe seleccionar como mínimo una imagen.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
            });
            return null;
        }

        this.categoria = document.getElementById('selectCategoria').value;

        Swal.fire({
            title: '¿Está seguro?',
            text: "Las imágenes seleccionadas serán eliminadas y no podrán ser recuperadas",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, lo estoy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const datos = await this.controlador.eliminarFotos(this.imagenesSeleccionadas, this.categoria)
                    Swal.fire(
                        '¡Eliminadas!',
                        'Las imágenes seleccionadas han sido eliminadas',
                        'success'
                    );
                    this.traerFotos();
                    this.imagenesSeleccionadas = [];
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar las imágenes. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    /**
     * Elimina todas las fotos de la categoría seleccionada
     * @returns {Promise<void>}
     */
    async eliminarTodas(){
        this.categoria = document.getElementById('selectCategoria').value;

        Swal.fire({
            title: '¿Está seguro?',
            text: "Todas las imágenes de la categoría " + document.getElementById('encabezado-categoria').textContent
                + " serán eliminadas y no podrán ser recuperadas",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, lo estoy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await this.controlador.eliminarAllFotos(this.categoria);
                    Swal.fire(
                        '¡Eliminadas!',
                        'Todas las imágenes de la categoría ' + document.getElementById('encabezado-categoria').textContent
                        + ' han sido eliminadas',
                        'success'
                    );
                    this.traerFotos();
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar las imágenes. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });

    }
}