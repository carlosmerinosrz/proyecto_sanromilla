<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Inscripciones
 */
class ModeloInscripciones{
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
        $this->conexion = new mysqli($this->servidor,  $this->usuario,  $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }


    /**
     * Método que asigna un dorsal a una participación
     * Si la modificación va bien devuelve 1
     * Si la modificación va mal devuelve -1
     * Si no se envían todos los datos devuelve 0
     */
    public function asignarDorsal($datos) {
        if ($datos) {
            $this->conectar();
    
            try {
                foreach ($datos as $dato) {
                    // Extraer los datos del objeto actual
                    $dorsal = $dato->dorsal;
                    $id_inscripcion = $dato->idInscripcion;
                    $id_talla = $dato->id_talla;
                    $importe = $dato->importe;

                    // Preparar la consulta SQL según si id_talla es null o no
                    if ($id_talla === 'null') {
                        $upd = $this->conexion->prepare("UPDATE inscripciones SET dorsal = ?, estado_pago = 1, id_talla = null, importe = ? WHERE id_inscripcion = ?");
                        $upd->bind_param('iii', $dorsal, $importe, $id_inscripcion);
                    } else {
                        //print_r('entra en no es null');
                        $upd = $this->conexion->prepare("UPDATE inscripciones SET dorsal = ?, estado_pago = 1, id_talla = ?, importe = ? WHERE id_inscripcion = ?");
                        $upd->bind_param('iiii', $dorsal, $id_talla, $importe, $id_inscripcion);
                    }
    
                    // Ejecutar la consulta
                    $upd->execute();
                    $upd->close();
                }
                return 1; // Operación exitosa
            } catch (Exception $e) {
                return $e->getMessage(); // Devuelve el mensaje de error
            }
        } else {
            return 0; // No se proporcionaron datos
        }
    }
    

    /**
     * Método que busca según el filtro de inscripciones
     */
    public function filtroInscripciones(){
        if(isset($_POST['codigo']) || isset($_POST['dni'])){

        }
        else{
            return 0;
        }
    }

    /**
     * Método que obtiene las inscripciones según el tipo de búsqueda
     */
    function getInscripciones(){
        if (isset($_GET['codigo']) && isset($_GET['tipoBusqueda'])){
            $argumento=$_GET['codigo'];
            $tipoBusqueda=$_GET['tipoBusqueda'];
            $this->conectar();

            if($tipoBusqueda == 'codigo'){
                $resultado= $this->conexion->prepare("SELECT * FROM inscripciones i WHERE i.codigo_inscripcion = ? AND i.estado_pago = 0;");
                $resultado->bind_param('s', $argumento);
                $resultado->execute();
                $datos = $resultado->get_result();
                $array=$datos->fetch_all(MYSQLI_ASSOC);
                return $array;
            }

            // Nuevo Carlos, permitir la búsqueda mediante teléfono
            if($tipoBusqueda == 'telefono'){
                $resultado= $this->conexion->prepare("SELECT MIN(id_inscripcion) as id_inscripcion, codigo_inscripcion, MIN(fecha_inscripcion) as fecha_inscripcion FROM inscripciones WHERE telefono = ? AND estado_pago = 0 GROUP BY codigo_inscripcion;");
                $resultado->bind_param('s', $argumento);
                $resultado->execute();
                $datos = $resultado->get_result();
                $array=$datos->fetch_all(MYSQLI_ASSOC);
                return $array;
            }

            if($tipoBusqueda == 'all'){
                $resultado= $this->conexion->prepare("SELECT * FROM inscripciones ORDER BY apellidos;");
//                $resultado->bind_param('s', $argumento);
                $resultado->execute();
                $datos = $resultado->get_result();
                $array=$datos->fetch_all(MYSQLI_ASSOC);
                $resultado->close();
                return $array;
            }

        }else{
            return -1;
        }

    }

    function searchInscripciones($input, $tipoBusqueda) {
        $this->conectar();
    
        $datos = 0;
        if ($tipoBusqueda === 'telefono') {
            $query = "SELECT telefono FROM inscripciones WHERE telefono = ? AND estado_pago = 1";
        } else {
            $query = "SELECT codigo_inscripcion FROM inscripciones WHERE codigo_inscripcion = ?";
        }
        $consulta = $this->conexion->prepare($query);
        $consulta->bind_param("s", $input);
        $consulta->execute();
    
        $resultado = $consulta->get_result();
    
        if ($resultado->num_rows > 0) {
            $datos = 1;
        }
    
        $consulta->close();
        $this->conexion->close();
    
        return $datos;
    }
    
    function eliminarSanRomilla() {
        $this->conectar();
    
        $datos = 0;
    
        // Eliminar todas las filas de la tabla inscripciones
        $queryDelete = "DELETE FROM inscripciones";
    
        // Reiniciar el contador de AUTO_INCREMENT
        $queryResetAutoIncrement = "ALTER TABLE inscripciones AUTO_INCREMENT = 1";
    
        try {
            // Iniciar la transacción
            $this->conexion->begin_transaction();
    
            // Ejecutar la eliminación de datos
            $consultaDelete = $this->conexion->prepare($queryDelete);
            $consultaDelete->execute();
            $consultaDelete->close();
    
            // Ejecutar el reinicio del AUTO_INCREMENT
            $consultaResetAutoIncrement = $this->conexion->prepare($queryResetAutoIncrement);
            $consultaResetAutoIncrement->execute();
            $consultaResetAutoIncrement->close();
    
            // Confirmar la transacción
            $this->conexion->commit();
            $datos = 1;
        } catch (Exception $e) {
            // Revertir la transacción en caso de error
            $this->conexion->rollback();
            error_log("Error al eliminar San Romilla: " . $e->getMessage());
        }
    
        $this->conexion->close();
    
        return $datos;
    }
    

}

