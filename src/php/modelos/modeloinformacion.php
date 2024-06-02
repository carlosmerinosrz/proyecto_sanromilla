<?php
require_once('config/configdb.php');

/**
 * Clase Mode de Inscripciones
 */
class ModeloInformacion{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;
    private $mysqli;
    function __construct(){
        $this->mysqli = new mysqli(SERVIDOR, USUARIO, CONTRASENIA, BD) or die("no hay conexion");
    	$this->mysqli->set_charset('utf8');
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
     * Método que llama a la base de datos y saca tanto el cartel como el precio para la pagina principal
     */
    function getInformacion(){
        $this->conectar();
        $consulta = 'SELECT precio_camiseta, cartel FROM informacion';
        $respuesta = $this->conexion->query($consulta);
        $data = [];
        if ($respuesta->num_rows > 0) {
            while ($row = $respuesta->fetch_assoc()) {
                $data[] = $row;
            }
        }
        $this->conexion->close();
        return $data;
    }

    /**
     * Método que llama a la base de datos y saca el reglamento
     * @return string|null El reglamento, o null si no se encuentra.
     */
    function getReglamento(){
        $this->conectar();
        $consulta = 'SELECT reglamento FROM informacion';
        
        try {
            $respuesta = $this->conexion->query($consulta);
            
            if ($respuesta === false) {
                throw new Exception("Error al ejecutar la consulta: " . $this->conexion->error);
            }
            
            if ($respuesta->num_rows > 0) {
                $row = $respuesta->fetch_assoc();
                $this->conexion->close();
                return $row['reglamento'];
            } else {
                $this->conexion->close();
                return null;
            }
        } catch (Exception $e) {
            error_log("Error en la consulta: " . $e->getMessage());
            $this->conexion->close(); 
            return null;
        }
    }

    

}

?>