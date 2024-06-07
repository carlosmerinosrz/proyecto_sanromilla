<?php
session_start();

// Establecer el encabezado de contenido como JSON
header('Content-Type: application/json');

// Inicializar una variable para la respuesta
$response = ['success' => false, 'message' => 'Solicitud no válida para cerrar sesión.'];

// Verificar si la solicitud contiene el token
if (isset($_POST['token']) && $_POST['token'] === true) {
    // Cerrar la sesión y eliminar todas las variables de sesión
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy(); // Destruye la sesión actual.

    // Configurar la respuesta para indicar éxito
    $response = ['success' => true, 'message' => 'Sesión cerrada correctamente.'];
}

// Devolver la respuesta JSON
echo json_encode($response);
?>
