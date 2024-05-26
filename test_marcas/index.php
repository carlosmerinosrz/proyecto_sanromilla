<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test_carrera_san_romilla";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Guardar datos en la base de datos cuando se finaliza la carrera
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["finalize"])) {
    $participants = json_decode($_POST["participants"], true);
    $category = $_POST["category"];

    foreach ($participants as $participant) {
        $stmt = $conn->prepare("INSERT INTO resultados (categoria, participante, tiempo) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $category, $participant["name"], $participant["time"]);
        $stmt->execute();
        $stmt->close();
    }

    // Redireccionar para limpiar los datos POST
    header("Location: " . $_SERVER["PHP_SELF"]);
    exit();
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Marcas</title>
</head>
<body>
    <h1>Gestión de Marcas</h1>
    <label for="categorySelect">Selecciona la categoría:</label>
    <select id="categorySelect">
        <option value="">--Selecciona una categoría--</option>
        <option value="Infantil">Infantil</option>
        <option value="Juvenil">Juvenil</option>
        <option value="Adulto">Adulto</option>
        <option value="Senior">Senior</option>
    </select>
    <button id="startButton" disabled>Comienzo de la carrera</button>
    <button id="arrivalButton" disabled>Llegada del participante</button>
    <button id="finalizeButton" disabled>Finalizar carrera</button>
    <form id="finalizeForm" method="POST" style="display: none;">
        <input type="hidden" name="participants" id="participantsInput">
        <input type="hidden" name="category" id="categoryInput">
        <input type="hidden" name="finalize" value="true">
    </form>
    <table>
        <thead>
            <tr>
                <th>Participante</th>
                <th>Tiempo de Llegada</th>
            </tr>
        </thead>
        <tbody id="timesTableBody">
        </tbody>
    </table>

    <script>
        let startTime;
        let participantCount = 0;
        const participants = [];

        document.getElementById('categorySelect').addEventListener('change', () => {
            const category = document.getElementById('categorySelect').value;
            document.getElementById('startButton').disabled = !category;
        });

        document.getElementById('startButton').addEventListener('click', () => {
            startTime = new Date();
            alert('La carrera ha comenzado a las: ' + startTime.toLocaleTimeString());
            document.getElementById('startButton').disabled = true;
            document.getElementById('categorySelect').disabled = true;
            document.getElementById('arrivalButton').disabled = false;
            document.getElementById('finalizeButton').disabled = false;
        });

        document.getElementById('arrivalButton').addEventListener('click', () => {
            const arrivalTime = new Date();
            const timeDifference = new Date(arrivalTime - startTime);
            const minutes = timeDifference.getUTCMinutes();
            const seconds = timeDifference.getUTCSeconds();

            participantCount++;
            const participantName = `Participante ${participantCount}`;
            const time = `${minutes} minutos ${seconds} segundos`;
            participants.push({ name: participantName, time });

            const tableBody = document.getElementById('timesTableBody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${participantName}</td>
                <td>${time}</td>
            `;
            tableBody.appendChild(newRow);
        });

        document.getElementById('finalizeButton').addEventListener('click', () => {
            if (participants.length > 0) {
                document.getElementById('participantsInput').value = JSON.stringify(participants);
                document.getElementById('categoryInput').value = document.getElementById('categorySelect').value;
                document.getElementById('finalizeForm').submit();
            }
            alert('La carrera ha finalizado.');
            document.getElementById('startButton').disabled = false;
            document.getElementById('categorySelect').disabled = false;
            document.getElementById('arrivalButton').disabled = true;
            document.getElementById('finalizeButton').disabled = true;
            document.getElementById('timesTableBody').innerHTML = '';
            participants.length = 0;
        });
    </script>
</body>
</html>
