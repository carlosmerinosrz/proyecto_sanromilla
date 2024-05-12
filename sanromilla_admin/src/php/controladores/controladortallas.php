<?php 
require_once('modelos/modelotallas.php');
/**
 * Clase Controlador de Categorías
 */
class tallasController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloTallas();
    }

    /**
    *Método que pide todas las categorías de la bbdd al modelo
    */
    public function getTallasCamisetas(){
        $datos= $this->modelo->getTallasCamisetas();
        header('Content-type: application/json; charset=uft-8');
        $cosas= json_encode($datos);
        echo $cosas;
    }
}

?>