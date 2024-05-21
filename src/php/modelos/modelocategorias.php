<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Categorías
 */
class ModeloCategorias{
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
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {     
        $this->conexion = new mysqli($this->servidor,  $this->usuario,  $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }

    /**
     * Método que llama a la base de datos y saca todas las categorias
     */
    function getCategorias(){
        $this->conectar();
        $consulta='SELECT * FROM categorias';
        $respuesta=$this->conexion->query($consulta);
        $this->conexion->close();
        return $respuesta;

    }

}

?>