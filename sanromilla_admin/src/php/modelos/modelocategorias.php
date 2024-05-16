<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Categorías
 */
class ModeloCategorias{
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
     * Método que llama a la base de datos y saca todas las categorias
     */
    function getCategorias(){
        $this->conectar();
        $consulta='SELECT * FROM categorias';
        $respuesta=$this->conexion->query($consulta);
        $this->conexion->close();
        return $respuesta;

    }

    public function newCategorias(){
        $this->conectar();
        $consulta = $this->conexion->prepare("INSERT INTO categorias (nombre,descripcion, edad, precio, distancia, recorrido, hora) VALUES(?,?,?,?,?,?,?)");
        try {
            $consulta->bind_param("ssiiiss", $_GET['nombre'], $_GET['descripcion'], $_GET['edad'], $_GET['precio'], $_GET['distancia'], $_GET['recorrido'], $_GET['hora']);
            $resultado=$consulta->execute();
            if($resultado){
                return 1; // Éxito en la inserción de roles
            }
            else{
                return 0; // Falló la inserción de colaboradores
            }
    
        } catch (Exception $e) {
            return $e; // Captura de excepciones
        } finally {
            $consulta->close();
            $this->conexion->close();
        }
    }

    public function validarNameCategoria(){
        $this->conectar();
        
        $datos = 0;
        
        if (isset($_GET['nombre'])) {
    
            $consulta = $this->conexion->prepare("SELECT nombre FROM categorias WHERE nombre = ?");
            $consulta->bind_param("s", $_GET['nombre']);
            $consulta->execute();
    
            $resultado = $consulta->get_result();
    
            if ($resultado->num_rows > 0) {
                return 1;
            }
            $consulta->close();
        }
        
        $this->conexion->close();
        
        return $datos;
    }
    
    public function eliminarCategoria($id){
        $this->conectar();

        $consulta = $this->conexion->prepare("DELETE FROM categorias WHERE id_categoria = ?");

        try {
            $consulta->bind_param("i", $id);
            $consulta->execute();

        } catch (Exception $e) {
            echo 'Error al eliminar la categoría: ' . $e->getMessage();
        }

        $consulta->close();
        $this->conexion->close();

    }
    

}

?>