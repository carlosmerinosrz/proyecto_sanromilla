<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Imágenes
 */
class ModeloImagenes{
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
     * Método para pedir las fotos a la base de datos
     */
    public function getfotos(){
        $this->conectar();
        $consulta="SELECT * FROM imagenes;";
        $respuesta=$this->conexion->query($consulta);
        $datos=$respuesta->fetch_all( $resulttype = MYSQLI_ASSOC);
        $this->conexion->close();
        return $datos;
    }

}

?>