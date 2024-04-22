<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Información General
 */
class ModeloInformacion{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;
    function __construct(){
        $this->servidor = constant('SERVIDOR');
        $this->usuario = constant('USUARIO');
        $this->contrasenia = constant('CONTRASENIA');
        $this->bd = constant('BD');
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {     
        $this->conexion = new mysqli($this->servidor,  $this->usuario,  $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }


    /**
     * Método que modifica la información general de la carrera.
     */
    public function modificarInfo($datos){


        if($datos){
            $this->conectar();
            try{
                $fecha = $datos['fecha'];
                $hora = $datos['hora'];
                $fechaCarrera = date("Y-m-d H:i:s", strtotime("$fecha $hora"));
                $inicio_inscripcion = $datos['inicio_inscripcion'];
                $fin_inscripcion = $datos['fin_inscripcion'];
                $precio_camiseta = $datos['precio_camiseta'];
                $beneficio_camiseta = $datos['beneficio_camiseta'];

                $upd = $this->conexion->prepare("UPDATE informacion SET fecha = ?, inicio_inscripcion = ?, fin_inscripcion = ?, precio_camiseta = ?, beneficio_camiseta = ?");
                $upd->bind_param("sssii", $fechaCarrera, $inicio_inscripcion, $fin_inscripcion, $precio_camiseta, $beneficio_camiseta);
                $upd->execute();
                $upd->close();
                echo 1;
            }
            catch(Exception $e){
                echo -1;
            }  
        }else{
            echo 0;
        }
    }


    /**
    * Método para modificar los archivos
    */
    public function modificarArchivos($arch){

        $this->conectar();

        $cartel = $arch['cartel'];
        $reglamento = $arch['reglamento'];

        var_dump($cartel);
        var_dump($reglamento);

        if (!$this->esPngOJpg($cartel)) {
                return false;
            }
        if (!$this->esPdf($reglamento)) {
                return false;
            }

        $consulta = $this->conexion->prepare("UPDATE informacion SET cartel = ?, reglamento = ?;");

        $nombre_cartel = $cartel['name'];
        $nombre_reglamento = $reglamento['name'];
        $ruta_destino = 'C:\xampp\htdocs\san_romilla\sanromilla\sanromilla_admin\src\assets\carrera_archivos\\'. $nombre_cartel;
        $ruta_destino2 = 'C:\xampp\htdocs\san_romilla\sanromilla\sanromilla_admin\src\assets\carrera_archivos\\'. $nombre_reglamento;
        move_uploaded_file($cartel['tmp_name'], $ruta_destino);
        move_uploaded_file($reglamento['tmp_name'], $ruta_destino2);

        $consulta->bind_param("ss", $nombre_cartel, $nombre_reglamento);
        $consulta->execute();

        $consulta->close();
        return true;
    }

    /**
    * Método para obtener la información general de la carrera
    */
    function getInformacion(){
        $this->conectar();

        $resultado= $this->conexion->prepare("SELECT * FROM informacion");
        $resultado->execute();
        $datos = $resultado->get_result();
        $array=$datos->fetch_all(MYSQLI_ASSOC);
        $resultado->close();
        return $array;
    }

    /**
    * Método para obtener el precio de la camiseta
    */
    function getPrecioCamiseta(){
        $this->conectar();

        $resultado= $this->conexion->prepare("SELECT precio_camiseta FROM informacion");
        $resultado->execute();
        $datos = $resultado->get_result();
        $array=$datos->fetch_all(MYSQLI_ASSOC);
        $resultado->close();
        return $array;
    }

    /* Función para comprobar si la extensión de la imagen es válida o no.
    */
    function esPngOJpg($archivo) {
        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

        if ($extension === 'png' || $extension === 'jpg' || $extension === 'jpeg') {
            return true;
        } else {
            return false;
        }
    }

    /* Función para comprobar si la extensión del archivo es pdf o no.
        */
    function esPdf($archivo) {
        $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

        if ($extension === 'pdf') {
            return true;
        } else {
            return false;
        }
    }

}

?>