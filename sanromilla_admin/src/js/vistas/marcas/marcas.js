"use strict"; // Activo modo estricto

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
        this.activeNavbar();

        // Guardar página para recargar
        this.saveViewState();

        this.categorias = await this.controlador.getCategoriasFotos();
        console.log(this.categorias);

        // Select de las categorías
        const selectCategoria = document.getElementById('categorySelect');
        this.categorias.data.forEach((categoria) => {
            const option = document.createElement('option');
            option.value = categoria.id_categoria;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
        });

        // Inicializar el script adicional
        this.initRaceControls();
    }

    activeNavbar() {
        document.getElementById('navTop').classList.remove('d-none');
        document.getElementById('linkHome').classList.remove('active');
        document.getElementById('linkFotos').classList.remove('active');
        document.getElementById('linkPagos').classList.remove('active');
        document.getElementById('linkCarrera').classList.remove('active');
        document.getElementById('linkCategorias').classList.remove('active');
        document.getElementById('linkInscripciones').classList.remove('active');
        document.getElementById('linkUsuarios').classList.remove('active');
        document.getElementById('linkCorreos').classList.remove('active');
        document.getElementById('linkMarcas').classList.add('active');
    }

    saveViewState() {
        var bodyHTML = document.body.innerHTML;
        localStorage.setItem('lastView', bodyHTML);
    }

    initRaceControls() {
        this.startTime = null;
        this.participantCount = 0;
        this.participants = [];

        document.getElementById('categorySelect').addEventListener('change', () => {
            const category = document.getElementById('categorySelect').value;
            document.getElementById('startButton').disabled = !category;
        });

        document.getElementById('startButton').addEventListener('click', () => {
            this.startTime = new Date();
            alert('La carrera ha comenzado a las: ' + this.startTime.toLocaleTimeString());
            document.getElementById('startButton').disabled = true;
            document.getElementById('categorySelect').disabled = true;
            document.getElementById('arrivalButton').disabled = false;
            document.getElementById('finalizeButton').disabled = false;
        });

        document.getElementById('arrivalButton').addEventListener('click', () => {
            const arrivalTime = new Date();
            const timeDifference = new Date(arrivalTime - this.startTime);
            const hours = String(timeDifference.getUTCHours()).padStart(2, '0');
            const minutes = String(timeDifference.getUTCMinutes()).padStart(2, '0');
            const seconds = String(timeDifference.getUTCSeconds()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}:${seconds}`;

            this.participantCount++;
            const participantName = `Participante ${this.participantCount}`;
            this.participants.push({ name: participantName, time: formattedTime });

            const tableBody = document.getElementById('timesTableBody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${participantName}</td>
                <td>${formattedTime}</td>
            `;
            tableBody.appendChild(newRow);
        });

        document.getElementById('finalizeButton').addEventListener('click', this.finalizeRace.bind(this));
    }

    async finalizeRace() {

        // Obtener la categoría seleccionada
        const selectedCategory = document.getElementById('categorySelect').value;
        const raceData = {
            participants: this.participants,
            category: selectedCategory
        };

        //let respuesta = await this.controlador.enviarDatosCarrera(raceData);

        alert('La carrera ha finalizado.');

        document.getElementById('startButton').disabled = false;
        document.getElementById('categorySelect').disabled = false;
        document.getElementById('arrivalButton').disabled = true;
        document.getElementById('finalizeButton').disabled = true;
        document.getElementById('timesTableBody').innerHTML = '';

        // Restablecer los valores para una nueva carrera
        this.participants = [];
        this.participantCount = 0;
    }
}
