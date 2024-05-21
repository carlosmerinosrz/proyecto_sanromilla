<?php
require_once('modelos/modeloroles.php');

/**
 * Clase Controlador de Roles
 */
class rolesController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloRoles();
    }

    /**
     * Obtiene los roles
     * @return void
     */
    public function getRoles(){
        $roles = $this->modelo->getRoles();

        header('Content-Type: application/json');
        echo json_encode($roles);
    }

}
