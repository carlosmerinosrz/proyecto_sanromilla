<?php
require_once('modelos/modelocorreo.php');

/**
 * Clase Controlador de Roles
 */
class correoController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloCorreos();
    }

    /**
     * Obtiene los correos
     * @return void
     */
    public function getCorreos(){
        $roles = $this->modelo->getCorreos();

        header('Content-Type: application/json');
        echo json_encode($roles);
    }

}
