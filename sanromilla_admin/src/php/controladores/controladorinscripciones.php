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


    /**
     * Método que asigna un dorsal a una participación
     * Si la modificación va bien devuelve 1
     * Si la modificación va mal devuelve -1
     * Si no se envían todos los datos devuelve 0
     */
    public function asignarDorsal(){

        $datos = json_decode($_POST['datos']);

        $datos= $this->modelo->asignarDorsal($datos);
        if($datos >= 1){
            echo $datos;
            return $datos;
        }
        else if($datos == -1){  //error
            echo $datos;
        }
        else{       //falta algún dato
            echo 0;
            return 0;
        }
    }

    /**
     * Método para filtrar las inscripciones
     */
    public function filtroInscripciones(){
        $datos= $this->modelo->filtroInscripciones();
        if($datos>=1){
            echo $datos;
        }
        else if($datos== -1){  //error
            echo $datos;
        }
        else{       //falta algún dato
            echo 0;
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


}

?>