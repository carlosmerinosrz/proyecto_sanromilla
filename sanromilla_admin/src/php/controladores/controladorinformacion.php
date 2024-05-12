<?php 
require_once('modelos/modeloinformacion.php');

/**
 * Clase Controlador de Información General
 */
class informacionController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloInformacion();
    }


    /**
     * Método que modifica la información general de la carrera
     */
    public function modificarInfo(){

        $datos = $_POST['datos'];
        $result= $this->modelo->modificarInfo($datos);
        echo $result;
    }

    /**
    * Método para subir el cartel y el reglamento a bbdd.
    */
    public function modificarArchivos(){
            $archivos = $_FILES;
            $this->modelo->modificarArchivos($archivos);
    }

    /**
    * Método para obtener la información general de la carrera.
    */
    public function getInformacion(){
        $datos= $this->modelo->getInformacion();

        header('Content-type: application/json; charset=uft-8');
        $cosas= json_encode($datos);
        echo $cosas;
    }

    /**
        * Método para obtener la el precio de la camiseta.
        */
    public function getPrecioCamiseta(){
        $datos= $this->modelo->getPrecioCamiseta();
        header('Content-type: application/json; charset=uft-8');
        $cosas= json_encode($datos);
        echo $cosas;
    }
}

?>