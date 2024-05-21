<?php
require_once('modelos/modelofotos.php');

/**
 * Clase Controlador de Fotos
 */
class fotosController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloFotos();
    }

    /**
     * Inserta nuevas fotos en la base de datos
     * @return void
     */
    public function subirFotos(){
        $archivos = $_FILES['files'];
        $categoria = (int)$_POST['categoria'];

        $this->modelo->subirFotos($archivos, $categoria);
    }

    /**
     * Obtiene las fotos de una categoría
     * @return void
     */
    public function getFotos(){
        $categoria = $_GET['categoria'];

        $datos= $this->modelo->getFotos($categoria);
        header('Content-type: application/json; charset=utf-8');
        echo json_encode($datos);
    }

    /**
     * Elimina las fotos seleccionadas de una categoría
     * @return void
     */
    public function eliminarFotosSeleccionadas(){
        $datos = json_decode(file_get_contents('php://input'), true);


        if ($datos !== null) {
            $seleccionadas = $datos['seleccionadas'];
            $categoria = $datos['categoria'];
            $this->modelo->eliminarFotosSeleccionadas($seleccionadas, $categoria);

            // Enviar una respuesta exitosa al cliente
            http_response_code(200);
        } else {
            // Enviar una respuesta de error al cliente
            http_response_code(400);
        }
    }

    /**
     * Elimina todas las fotos de una categoría
     * @return void
     */
    public function eliminarAllFotos(){
        $datos = json_decode(file_get_contents('php://input'), true);
        var_dump($datos);
        if ($datos !== null) {
            $categoria = $datos['categoria'];
            $this->modelo->eliminarAllFotos($categoria);

            // Enviar una respuesta exitosa al cliente
            http_response_code(200);
        } else {
            // Enviar una respuesta de error al cliente
            http_response_code(400);
        }
    }


}



