<?php
require_once('config/configdb.php');

/**
 * Clase Mode de Inscripciones
 */
class ModeloInscripciones{
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
     * Método que llama a la base de datos y saca todas los códigos
     */
    function getCodigos(){
        $this->conectar();
        $consulta='SELECT codigo_inscripcion FROM inscripciones';
        $respuesta=$this->conexion->query($consulta);
        $this->conexion->close();
        return $respuesta;

    
    }

    //-----------------------------SERGIO
    function getFechasInscripcion(){
        $this->conectar();
        $consulta = 'SELECT CURDATE() AS fecha_actual, inicio_inscripcion, fin_inscripcion FROM informacion';
        $respuesta = $this->conexion->query($consulta);
        $this->conexion->close();
        return $respuesta;
    }

    /**
     * Método que inserta el código de inscripción en un registro
     */
    function insertarInscripciones($inscripciones, $codigo, $correo){
        if(empty($inscripciones)){
            return false;
        }

        $this->conectar();

        try{
            $consultaGetIdCategoria = $this->mysqli->prepare("SELECT id_categoria FROM categorias WHERE nombre = ? ");

            $consultaInsertInscripcion = $this->mysqli->prepare("INSERT INTO `inscripciones`( `nombre`, `apellidos`, `genero`,
                                                                             `fecha_nacimiento`, `dni`, `email`, `telefono`, `info_adicional`,
                                                                             `codigo_inscripcion`, `importe`, 
                                                                             `id_categoria`)
                                                                VALUES (?,?,?,?,?,?,?,?,?,?,?);");
            foreach($inscripciones as $item){
                //Miramos de qué genero es
                $genero='M';
                if($item['genero']==1){
                    $genero='F';
                }


                //Calculamos el total a pagar
                $importe=intval($item['precioDorsal']);
                

                $adicional = !empty($item['infoAdicional']) ? $item['infoAdicional'] : NULL;

                //buscamos la categoria
                $consultaGetIdCategoria->bind_param("s", $item['categoria']);
                $consultaGetIdCategoria->execute();

                $resultado = $consultaGetIdCategoria->get_result();
                $id = $resultado->fetch_all(MYSQLI_ASSOC);
                $idCategoria = $id[0]['id_categoria'];

                $consultaInsertInscripcion->bind_param("sssssssisii", $item["nombre"], $item["apellidos"], $genero,
                    $item["fechaNac"], $item["dni"], $correo, $item["telefono"], $adicional,
                    $codigo, $importe, $idCategoria);
                $consultaInsertInscripcion->execute();

                $consultaInsertInscripcion->reset();
                $consultaGetIdCategoria->reset();

            }

            $this->mysqli->close();
            

            return true;
        }catch(Exception $e){
            print_r($e);
        }
    }

    

}

?>



