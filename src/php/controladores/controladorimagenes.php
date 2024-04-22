<?php 
require_once('modelos/modeloimagenes.php');

/**
 * Clase Controlador de Imágenes
 */
class imagenesController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloImagenes();
    }

    /**
    *Método que pide todas las categorías de la bbdd al modelo
    */
    public function getFotos(){
        $datos= $this->modelo->getFotos();
        header('Content-type: application/json; charset=uft-8');
        $cosas= json_encode($datos);
        echo $cosas;
    }
}

?>