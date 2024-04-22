<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de roles
 */
class ModeloRoles{
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
     * Método para coger todos los roles
     */
    public function getRoles(){
        $this->conectar();
        $datos = array();

        $consulta = $this->conexion->query("SELECT * FROM roles");

        while ($fila = $consulta->fetch_assoc()) {
            $datos[] = $fila;
        }

        $consulta->close();
        $this->conexion->close();

        return $datos;
    }

}