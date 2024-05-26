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

    public function newCategorias(){
        $respuesta = $this->modelo->newCategorias();
        echo $respuesta;
    }

    public function updateCategorias(){
        $respuesta = $this->modelo->updateCategorias();
        echo $respuesta;
    }

    public function validarNameCategoria(){
        $respuesta = $this->modelo->validarNameCategoria();
        echo $respuesta;
    }

    public function eliminarCategoria(){
        $datos = json_decode(file_get_contents('php://input'), true);
        print_r($datos);
        if ($datos !== null) {
            $id = $datos['id'];
            $this->modelo->eliminarCategoria($id);

            // Enviar una respuesta exitosa al cliente
            http_response_code(200);
        } else {
            // Enviar una respuesta de error al cliente
            http_response_code(400);
        }
    }
    
}

?>