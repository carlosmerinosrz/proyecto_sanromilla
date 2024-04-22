<?php
use Firebase\JWT\JWT;
require_once('modelos/modelologin.php');
require_once ('config/logingoogle/vendor/autoload.php');
require_once ('config/config.php');

/**
 * Clase Controlador de Login
 */
class LoginController{
    private $modelo;
    public static $clave = "null";
    public static $algoritmo_encriptacion = null;
    public static $iv = '16bits aleatorio';
    //Id de cliente de Google.
    private static $ID_CLIENTE = '465362912048-5jasakkolgeib7hebu2rfbgmflbmb3ot.apps.googleusercontent.com';
    function __construct(){
        $this->modelo=new ModeloLogin();
    }

    /**
     * Método para comprobar el usuario
     */
    public function comprobarUsuario(){

        $token = $_POST["token"];


        $client = new Google_Client(['client_id' => self::$ID_CLIENTE]);
        $payload = $client->verifyIdToken($token);

        if (!$payload) {
            // Invalid ID token
            header('HTTP/1.1 401 Unauthorized');
            die();
        }

        //Primero se consiguen los datos del usuario que trata de iniciar sesión con google
        $usuario = $this->modelo->comprobarUsuario($payload['email']);

        //Si el email está en la bbdd, se sacan sus roles y se devuelve un token nuevo
        if ($usuario !== null){
            $roles = $this->modelo->getRoles($usuario['id_colaborador']);

            $payload = [
                'nombre' => $usuario['nombre'],
                'email' => $usuario['correo'],
                'roles' => $roles
            ];

            $secretKey = bin2hex(random_bytes(32));
            $token = JWT::encode($payload, $secretKey, 'HS256');
            echo $token;
            /*$tokenJson = json_encode($token);
            echo $tokenJson;*/
        }else{
            http_response_code(404);
            echo 'Usuario no permitido';
        }

    }
}
