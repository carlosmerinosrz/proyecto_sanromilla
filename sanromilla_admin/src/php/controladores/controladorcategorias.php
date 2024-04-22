<?php 
require_once('modelos/modelocategorias.php');
/**
 * Clase Controlador de Categorías
 */
class categoriasController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloCategorias();
    }

    /**
    *Método que pide todas las categorías de la bbdd al modelo
    */
    public function getCategorias(){
        $datos= $this->modelo->getCategorias();
        $datos=$datos->fetch_all( $resulttype = MYSQLI_ASSOC);
        // print_r($datos) ;
        header('Content-type: application/json; charset=uft-8');
        // print_r ($datos);
         $cosas= json_encode($datos);
         echo $cosas;
    }
}

?>