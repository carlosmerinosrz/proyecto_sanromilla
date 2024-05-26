<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Usuarios
 */
class ModeloCorreo
{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;

    function __construct()
    {
        $this->servidor = constant('SERVIDOR');
        $this->usuario = constant('USUARIO');
        $this->contrasenia = constant('CONTRASENIA');
        $this->bd = constant('BD');
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {
        $this->conexion = new mysqli($this->servidor, $this->usuario, $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }


    /**
     * Método para sacar todos los correos únicos
     */
    public function getCorreos(){
        $this->conectar();
        $correos = array();

        $consulta = $this->conexion->query("SELECT DISTINCT email FROM inscripciones");

        while ($fila = $consulta->fetch_assoc()) {
            $correos[] = $fila['email'];
        }

        $consulta->close();
        $this->conexion->close();

        return $correos;
    }

}