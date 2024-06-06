"use strict"; // Activar modo estricto

/**
 * Clase Marcas
 */
export class Marcas {
    constructor(controlador) {
        this.controlador = controlador;
        window.setTimeout(this.iniciar.bind(this), 500);
    }

    /**
     * Método que inicia la vista
     */
    async iniciar() {
        this.div = document.getElementById('marcas');
        this.activarNavbar();
    
        // Guardar página para recargar
        this.guardarEstadoVista();
    
        try {
            this.categorias = await this.controlador.getCategoriasFotos();
            const selectCategoria = document.getElementById('categorySelect');
            // Select de las categorías
            const defaultOption = document.createElement('option');
            defaultOption.value = "--";
            defaultOption.textContent = "--";
            selectCategoria.appendChild(defaultOption);

            // Iterar sobre las categorías y añadir las opciones correspondientes
            this.categorias.data.forEach((categoria) => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = categoria.nombre;
                selectCategoria.appendChild(option);
            });
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }

        // Inicializar el script adicional
        this.iniciarControlesCarrera();
    }
    
    activarNavbar() {
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('d-none');
        document.getElementById('linkFotos').classList.remove('d-none');
        document.getElementById('linkPagos').classList.remove('d-none');
        document.getElementById('linkCarrera').classList.remove('d-none');
        document.getElementById('linkCategorias').classList.remove('d-none');
        document.getElementById('linkInscripciones').classList.remove('d-none');
        document.getElementById('linkUsuarios').classList.remove('d-none');
        document.getElementById('linkCorreos').classList.remove('d-none');
        document.getElementById('linkMarcas').classList.add('d-none');
        document.getElementById('linkTallas').classList.remove('d-none');
        document.getElementById('linkNuevaSanRomilla').classList.remove('d-none');
    }

    guardarEstadoVista() {
        const bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

    iniciarControlesCarrera() {
        this.startTime = null;
        this.participantCount = 0;
        this.participants = [];
        let distanciaSeleccionada = null;
    
        document.getElementById('categorySelect').addEventListener('change', () => {
            const categoryId = document.getElementById('categorySelect').value;
            const selectedCategory = this.categorias.data.find(cat => cat.id_categoria == categoryId);
            distanciaSeleccionada = selectedCategory ? selectedCategory.distancia : null;
            document.getElementById('startButton').disabled = !categoryId;
        });

        document.getElementById('startButton').addEventListener('click', async () => {
            this.startTime = new Date();
            const id_category = document.getElementById('categorySelect').options[document.getElementById('categorySelect').selectedIndex].value;

            let respuesta = await this.controlador.comprobarCategoria(id_category);

            if (parseInt(respuesta.data) === 1) { // Convertir a número usando parseInt()
                Swal.fire({
                    title: 'ERROR',
                    text: 'La carrera de esta categoría ya ha sido corrida',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    title: 'HA COMENZADO',
                    text: 'La carrera ha comenzado a las: ' + this.startTime.toLocaleTimeString(),
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                document.getElementById('startButton').disabled = true;
                document.getElementById('categorySelect').disabled = true;
                document.getElementById('arrivalButton').disabled = false;
                document.getElementById('finalizeButton').disabled = false;
            }
        });

        document.getElementById('arrivalButton').addEventListener('click', () => {
            const arrivalTime = new Date();
            const tiempoDiferencia = arrivalTime - this.startTime;
            const formattedTime = this.formatTime(tiempoDiferencia);
        

            this.participantCount++;
            const participantName = 'No asignado';
            const dorsal = 'Dorsal no asignado';
            const category = document.getElementById('categorySelect').options[document.getElementById('categorySelect').selectedIndex].text;
            const ritmo = this.calcularRitmo(tiempoDiferencia, distanciaSeleccionada);
    
            this.participants.push({clasificacion: this.participantCount, name: participantName, time: formattedTime, ritmo: ritmo, dorsal: dorsal, category: category });

            const tableBody = document.getElementById('timesTableBody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${this.participantCount}</td>
                <td>${participantName}</td>
                <td>${formattedTime}</td>
                <td>${ritmo}</td>
                <td>${category}</td>
                <td>${dorsal}</td>
            `;
            tableBody.appendChild(newRow);
        });

        document.getElementById('exportMarcas').addEventListener('click', async () => {
            // Mostrar un modal o una alerta con las categorías disponibles
            const { value: selectedCategoryId } = await Swal.fire({
                title: 'Selecciona la categoría a exportar',
                input: 'select',
                inputOptions: (await this.categorias.data).reduce((options, categoria) => {
                    options[categoria.id_categoria] = categoria.nombre;
                    return options;
                }, {}),
                inputPlaceholder: 'Selecciona una categoría',
                showCancelButton: true,
                confirmButtonText: 'Exportar',
                cancelButtonText: 'Cancelar'
            });
        
            if (selectedCategoryId) {
                const respuesta = await this.controlador.comprobarCategoria(selectedCategoryId);
                if (parseInt(respuesta.data) === 0) { // Convertir a número usando parseInt()
                    await Swal.fire({
                        title: 'ERROR',
                        text: 'Aun esa categoría no ha corrido la carrera, Intentalo más tarde',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    const selectedCategory = (await this.categorias.data).find(cat => cat.id_categoria == selectedCategoryId);
                    let fileName = await this.controlador.exportarExcel(selectedCategory.id_categoria);
                    let fileName2 = fileName.data.replace(/['"]/g, '');
                    let fullFilePath = '../assets/clasificacion/' + encodeURIComponent(fileName2);
                    window.open(fullFilePath, '_blank');
                                                               
                }
            }
        });
        

        document.getElementById('finalizeButton').addEventListener('click', this.finalizarCarrera.bind(this));
    }

    async finalizarCarrera() {
        Swal.fire({
            title: '¿Está seguro?',
            text: "La carrera se finalizará",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, lo estoy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const preloader = document.createElement('div');
                    preloader.classList.add('preloader');
                    document.body.appendChild(preloader);
                    // Obtener la categoría seleccionada
                    const selectedCategory = document.getElementById('categorySelect').value;
                    const raceData = {
                        participants: this.participants,
                        category: selectedCategory
                    };
    
                    // Enviar los datos de la carrera al servidor
                    let respuesta = await this.controlador.enviarDatosCarrera(raceData);

                    if (parseInt(respuesta.data) === 96) {
                        document.body.removeChild(preloader);
                        Swal.fire({
                            title: 'Error',
                            text: 'Aun no se ha añadido ningun participante. Inténtelo de nuevo más tarde.',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                   
    
                    

                    if (parseInt(respuesta.data) === 1) {
                        Swal.fire(
                            'Finalizada!',
                            'La carrera ha sido finalizada',
                            'success'
                        );
                            // Resetear botones y tabla
                        document.getElementById('startButton').disabled = false;
                        document.getElementById('categorySelect').disabled = false;
                        document.getElementById('arrivalButton').disabled = true;
                        document.getElementById('finalizeButton').disabled = true;
                        document.getElementById('timesTableBody').innerHTML = '';

                        // Restablecer los valores para una nueva carrera
                        this.participants = [];
                        this.participantCount = 0;

                        document.body.removeChild(preloader);
                    }
                    
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo finalizar la carrera. Inténtelo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            } else {
                // Eliminar preloader en caso de cancelación
                document.body.removeChild(preloader);
            }
        });
    }

    formatTime(milliseconds) {
        const totalSeconds = milliseconds / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    calcularRitmo(tiempoDiferencia, distancia) {
        const totalMinutos = tiempoDiferencia / (1000 * 60); // Convertir milisegundos a minutos
        const ritmo = distancia ? totalMinutos / distancia : 0;
        return ritmo.toFixed(2); // Redondear a 2 decimales
    }
}

