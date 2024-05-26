"use strict" //activo modo estricto

/**
 * Clase Fotos de Admin
 */
export class Fotos {

    constructor(controlador) {
        this.controlador = controlador
        window.setTimeout(this.iniciar.bind(this), 500)
    }

    /**
     * Método que inicia la vista
     * @param {*} controlador
     */
    async iniciar() {
        this.div = document.getElementById('fotos')
        this.fotosFormData = new FormData;
        this.activeNavbar();
        //Guardar página para recargar
        this.saveViewState();

        //Trae las categorías
        this.categorias = await this.controlador.getCategoriasFotos();
        console.log(this.categorias);

        //Montar select
        this.categorias.data.forEach((categoria) => {
            const option = document.createElement('option');
            option.value = categoria.id_categoria;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
        });

        this.btnIrEliminar = document.getElementById('btnIrEliminar');
        this.btnIrEliminar.onclick = () => this.controlador.mostrarEliminarFotos(this.controlador);

        const dropzone = document.getElementById("dropzone");
        const archivos = document.getElementById("archivos");
        const fotos = document.getElementById("fotos");

        document.getElementById('btnSubirImagenes').addEventListener('click', (event) =>
            subirImagenes(event, this.controlador, this.fotosFormData)
        );


        dropzone.addEventListener("dragover", handleDragOver);
        dropzone.addEventListener("drop", handleDrop);
        archivos.addEventListener("change", (event) =>
            handleFileSelect(event, this.controlador, this.fotosFormData)
        );

        const self = this;

        /**
         * Método para funcionalidad de drag and drop de imágenes para subir
         * @param event
         */
        function handleDragOver(event) {
            event.preventDefault();
            dropzone.classList.add("dragover");
        }

        /**
         * Método para funcionalidad de drag and drop de imágenes para subir
         * @param event
         */
        function handleDrop(event) {
            event.preventDefault();
            dropzone.classList.remove("dragover");
            handleFileSelect(event);
        }

        /**
         * Método para añadir las imágenes a un un FormData y mostrar la vista previa
         * @param event
         */
        const handleFileSelect = (event) => {
            const listado_archivos =
                event.target.id === "archivos" ? archivos.files : event.dataTransfer.files;

            for (let file of listado_archivos) {
                if (isImage(file)) {
                    this.fotosFormData.append("files[]", file);
                    mostrarVistaPrevia(file);
                } else {
                    Swal.fire({
                        title: 'Formato incorrecto',
                        text: 'Solo se pueden subir imágenes.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    });
                }
            }
            console.log(this.fotosFormData);
        }

        /**
         * Tipo de archivos permitidos
         * @param file
         * @returns {boolean}
         */
        const isImage = (file) => {
            const mimeTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/jpg"
                // Agrega aquí otros tipos de archivo de imagen permitidos si es necesario
            ];

            return mimeTypes.includes(file.type);
        }

        /**
         * Método para realizar la subida de imágenes.
         * @param event
         * @returns {null}
         */
        const subirImagenes = (event) => {
            let categoria = document.getElementById('selectCategoria').value
            if (this.fotosFormData.entries().next().done){
                Swal.fire({
                    title: 'No hay imágenes cargadas',
                    text: 'Debe seleccionar como mínimo una imagen.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                });
                return null;
            }

            Swal.fire({
                title: '¿Está seguro?',
                text: "Estas imágenes podrán ser vistas por el resto de usuarios",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, lo estoy'
            }).then((result) => {
                if (result.isConfirmed) {
                    self.controlador.subirFotos(this.fotosFormData, categoria)
                        .then(response => {
                            Swal.fire(
                                '¡Subidas!',
                                'Las imágenes han sido subidas',
                                'success'
                            )
                            this.fotosFormData.delete('files[]');
                            this.fotosFormData.delete('categoria');
                            document.getElementById("vistas-previas").innerHTML = "";
                        })
                        .catch(e => {
                            Swal.fire({
                                title: 'Subida fallida',
                                text: 'Inténtelo de nuevo más tarde.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar'
                            });
                        })
                }
            })


            archivos.value = "";
        }

        /**
         * Método encargado de realizar la vista previa mediante DOM
         * @param file
         */
        function mostrarVistaPrevia(file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const vistaPrevia = document.createElement("img");
                vistaPrevia.style.width = "96px";
                vistaPrevia.style.height = "96px";
                vistaPrevia.style.margin = "8px";
                vistaPrevia.src = event.target.result;
                vistaPrevia.classList.add("vista-previa");

                // Evento click: aumentar el tamaño de la imagen al hacer clic
                vistaPrevia.addEventListener("click", function () {
                    this.style.width = "250px";
                    this.style.height = "250px";
                });

                // Evento mousedown: restaurar el tamaño original al hacer clic fuera de la imagen
                document.addEventListener("mousedown", function (event) {
                    if (!vistaPrevia.contains(event.target)) {
                        vistaPrevia.style.width = "96px";
                        vistaPrevia.style.height = "96px";
                    }
                });

                document.getElementById("vistas-previas").appendChild(vistaPrevia);
            };
            reader.readAsDataURL(file);
        }
    }



    /**
     * Para mostrar el item del navbar activo
     */
    activeNavbar() {
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.add('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.remove('active');
    }

    /**
     * Guarda la vista antes de recargar
     */
    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

}