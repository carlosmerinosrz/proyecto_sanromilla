<?php 
require_once('modelos/modeloinformacion.php');

/**
 * Clase Controlador de Inscripciones
 */
class InformacionController {
    private $modelo;

    function __construct() {
        $this->modelo = new ModeloInformacion();
    }

    /**
     * Método que obtiene el precio de la camiseta y el cartel del modelo.
     */
    public function getInformacion() {
        $datos = $this->modelo->getInformacion();
        // Since $datos is already an array, no need to call fetch_all()
        header('Content-type: application/json; charset=utf-8');
        $cosas = json_encode($datos);
        echo $cosas;
    }

    /**
     * Método que obtiene el reglamento modelo.
     */
    public function getReglamento() {
        $datos = $this->modelo->getReglamento();
        header('Content-type: application/json; charset=utf-8');
        $cosas = json_encode($datos);
        echo $cosas;
    }


}

?>
