<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Información General
 */
class ModeloTallas{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;
    function __construct(){
        $this->servidor = constant('SERVIDOR');
        $this->usuario = constant('USUARIO');
        $this->contrasenia = constant('CONTRASENIA');
        $this->bd = constant('BD');

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['token'])) {
            header('Location: ../../../');
            exit;
        }
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {     
        $this->conexion = new mysqli($this->servidor,  $this->usuario,  $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }


    function getTallasCamisetas(){
        $this->conectar();

        $resultado= $this->conexion->prepare("SELECT * FROM tallas_camisetas");
        $resultado->execute();
        $datos = $resultado->get_result();
        $array=$datos->fetch_all(MYSQLI_ASSOC);
        $resultado->close();
        return $array;
    }
}

?>