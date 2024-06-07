<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Usuarios
 */
class ModeloUsuarios
{
    private $servidor;
    private $usuario;
    private $contrasenia;
    private $bd;
    private $conexion;

    function __construct()
    {
        $this->servidor = constant('SERVIDOR');
        $this->usuario = constant('USUARIO');
        $this->contrasenia = constant('CONTRASENIA');
        $this->bd = constant('BD');

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['token'])) {
            header('Location: ../../../');
            exit;
        }
    }

    /**
     * Iniciar conexión con la base de datos.
     */
    private function conectar()
    {
        $this->conexion = new mysqli($this->servidor, $this->usuario, $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }

    /**
     * Método para sacar todos los usuarios
     */
    public function getUsuarios(){
        $this->conectar();
        $datos = array();

        $consulta = $this->conexion->query("SELECT t1.*, GROUP_CONCAT(t3.nombre SEPARATOR ', ') AS roles
                                        FROM colaboradores t1
                                        INNER JOIN roles_colaboradores t2 ON t1.id_colaborador = t2.id_colaborador
                                        INNER JOIN roles t3 ON t2.id_rol = t3.id_rol
                                        GROUP BY t1.id_colaborador");

        while ($fila = $consulta->fetch_assoc()) {
            $datos[] = $fila;
        }

        $consulta->close();
        $this->conexion->close();

        return $datos;
    }

    /**
     * Método para eliminar un usuario y sus roles
     */
    public function eliminarUsuario($id){
        $this->conectar();

        $consultaDelete = $this->conexion->prepare("DELETE FROM roles_colaboradores WHERE id_colaborador = ?");
        $consulta = $this->conexion->prepare("DELETE FROM colaboradores WHERE id_colaborador = ?");

        try {
            $consultaDelete->bind_param("i", $id);
            $consultaDelete->execute();
            $consulta->bind_param("i", $id);
            $consulta->execute();

        } catch (Exception $e) {
            echo 'Error al eliminar imágenes: ' . $e->getMessage();
        }

        $consulta->close();
        $consultaDelete->close();
        $this->conexion->close();

    }

    /**
     * Método que añade un nuevo usuario
     * DEevuelvee 1 si va bien, -1 y 0 si va mal 
     */
    public function newUsuario(){
        $this->conectar();
        $consultaInsert = $this->conexion->prepare("INSERT INTO colaboradores (nombre,correo) VALUES(?,?)");
        $consultaInsert2 = $this->conexion->prepare("INSERT INTO roles_colaboradores (id_rol,id_colaborador) VALUES(?,?)");
        try {
            $consultaInsert->bind_param("ss", $_GET['nombre'], $_GET['correo']);
            $resultado=$consultaInsert->execute();
            if($resultado){
                $consulta="SELECT id_colaborador FROM colaboradores WHERE correo=?";
                $consultaEmail = $this->conexion->prepare($consulta);
                $consultaEmail->bind_param("s", $_GET['correo']);
                $consultaEmail->execute();
                $resultadoEmail = $consultaEmail->get_result();
                $fila = $resultadoEmail->fetch_assoc();
                $consultaEmail->close();
                echo $fila['id_colaborador'];
    
                foreach ($_GET['rol'] as $rol) {
                    $consultaInsert2->bind_param("ii", $rol, $fila['id_colaborador']);
                    $resultado2=$consultaInsert2->execute();
                    if(!$resultado2) {
                        return 0; // Falló la inserción de roles
                    }
                }
                return 1; // Éxito en la inserción de roles
            }
            else{
                return 0; // Falló la inserción de colaboradores
            }
    
        } catch (Exception $e) {
            return $e; // Captura de excepciones
        } finally {
            $consultaInsert->close();
            $consultaInsert2->close();
            $this->conexion->close();
        }
    }
    

    /**
     * Método que añade un nuevo usuario
     * DEevuelvee 1 si va bien, -1 y 0 si va mal 
     */

    // Nueva Funcion @carlosmerinosrz
    public function updateUsuario() {
        $this->conectar();
    
        $consultaUpdate = null;
        $delete = null;
        $consultaInsert2 = null;
    
        try {
            // Preparar consulta de actualización
            $consultaUpdate = $this->conexion->prepare("UPDATE colaboradores SET `nombre`=?, `correo`=? WHERE id_colaborador=?");
            $consultaUpdate->bind_param("ssi", $_GET['nombre'], $_GET['correo'], $_GET['id']);
            $resultado = $consultaUpdate->execute();
    
            if ($resultado) {
                // Borrar roles anteriores
                $delete = $this->conexion->prepare("DELETE FROM roles_colaboradores WHERE id_colaborador=?");
                $delete->bind_param("i", $_GET['id']);
                $delete->execute();
    
                // Insertar nuevos roles
                $consultaInsert2 = $this->conexion->prepare("INSERT INTO roles_colaboradores (id_rol, id_colaborador) VALUES(?, ?)");
                foreach ($_GET['rol'] as $rol) {
                    $consultaInsert2->bind_param("ii", $rol, $_GET['id']);
                    $consultaInsert2->execute();
                }
    
                return 1;
            } else {
                return 0;
            }
        } catch (Exception $e) {
            // Manejo de excepciones
            return $e->getMessage();
        } finally {
            // Cerrar consultas preparadas y conexión
            if ($consultaUpdate) {
                $consultaUpdate->close();
            }
            if ($delete) {
                $delete->close();
            }
            if ($consultaInsert2) {
                $consultaInsert2->close();
            }
            $this->conexion->close();
        }
    }
    
    

}