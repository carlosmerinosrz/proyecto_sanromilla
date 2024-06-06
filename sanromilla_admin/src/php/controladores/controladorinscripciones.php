<?php 
require_once('modelos/modeloinscripciones.php');

/**
 * Clase Controlador de Inscripciones
 */
class inscripcionesController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloInscripciones();
    }
    
    public function asignarDorsal(){

        $datos = json_decode($_POST['datos']);
        $datos= $this->modelo->asignarDorsal($datos);
        print_r($datos);
        if($datos >= 1){
            // echo $datos;
            return $datos;
        }
        else if($datos == -1){  //error
            // echo $datos;
        }
        else{       //falta algún dato
            // echo 0;
            return 0;
        }
    }

    /**
     * Método para filtrar las inscripciones
     */
    public function filtroInscripciones(){
        $datos= $this->modelo->filtroInscripciones();
        if($datos>=1){
            // echo $datos;
        }
        else if($datos== -1){  //error
            echo $datos;
        }
        else{       //falta algún dato
            // echo 0;
        }
    }

    /**
     * Método que coge todas las inscripciones
     */
    public function getInscripciones(){
        $datos= $this->modelo->getInscripciones();

        header('Content-type: application/json; charset=uft-8');
        // // print_r ($datos);
         $cosas= json_encode($datos);
          echo $cosas;
    }

    public function getInscripcionesTalla(){
        $datos= $this->modelo->getInscripcionesTalla();

        header('Content-type: application/json; charset=uft-8');
        // // print_r ($datos);
         $cosas= json_encode($datos);
          echo $cosas;
    }

    public function setCambios() {
        $datos = $_POST['datos'];
        $result = $this->modelo->setCambios($datos);
        echo json_encode($result);
    }
    


    public function searchInscripciones() {
        $data = json_decode(file_get_contents('php://input'), true);
        $input = $data['input'];
        $tipoBusqueda = $data['tipoBusqueda'];
    
        $datos = $this->modelo->searchInscripciones($input, $tipoBusqueda);
    
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($datos);
    }

    public function eliminarSanRomilla() {
        $datos = $this->modelo->eliminarSanRomilla();

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($datos);
    }
}

?>