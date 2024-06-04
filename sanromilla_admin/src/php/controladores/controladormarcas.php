<?php
require_once('modelos/modelomarcas.php');

/**
 * Clase Controlador de Marcas
 */
class MarcasController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloMarcas();
    }

    /**
     * Enviar datos de la carrera
     * @return void
     */
    public function enviarDatosCarrera(){
        $raceData = $_POST['raceData'];
        $respuesta = $this->modelo->enviarDatosCarrera($raceData);
        echo $respuesta;
    }

    public function comprobarCategoria(){
        $id_categoria = $_POST['id_categoria'];
        $respuesta = $this->modelo->comprobarCategoria($id_categoria);
        echo json_encode($respuesta);
    }
    
    public function exportarExcel(){
        $id_categoria = $_POST['id_categoria'];
        $respuesta = $this->modelo->exportarExcel($id_categoria);
        echo json_encode($respuesta);
    }
}

