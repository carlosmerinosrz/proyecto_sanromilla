<?php 
require_once('modelos/modeloinscripciones.php');
/**
 * Clase Controlador de Inscripciones
 */
class inscripcionesController{
    private $modelo;
    function __construct(){
        $this->modelo=new ModeloInscripciones();
    }

    /**
     * Método que pide al modelo los códigos ya guardados en la bbdd
     */
    public function getCodigos(){
        $datos= $this->modelo->getCodigos();
        $datos=$datos->fetch_all($resulttype = MYSQLI_ASSOC);
        $array=[];
        // print_r($datos);
        for($i=0; $i<sizeof($datos); $i++){
            // echo '<br>';
            $array[]=$datos[$i]['codigo_inscripcion'];
        }
        // print_r($array) ;
        header('Content-type: application/json; charset=uft-8');
        // // print_r ($datos);
        $cosas= json_encode($array);
        echo $cosas;
    }

    /**
     * Método que inserta el codigo en la bbdd
     */
    public function insertarInscripciones(){
        $inscripciones = $_GET['inscripciones'];
        $codigo = $_GET['codigo'];
        $correo = $_GET['correo'];
    
        // Fetch current date range from the database
        $fechasInscripcion = $this->modelo->getFechasInscripcion();
        $fechas = $fechasInscripcion->fetch_all($resulttype = MYSQLI_ASSOC);
        $fecha_actual = new DateTime($fechas[0]['fecha_actual']);
        $inicio_inscripcion = new DateTime($fechas[0]['inicio_inscripcion']);
        $fin_inscripcion = new DateTime($fechas[0]['fin_inscripcion']);
    
        // Check if the current date is within the range
        if ($this->isFechaWithinRange($fecha_actual, $inicio_inscripcion, $fin_inscripcion)) {
            $datos = $this->modelo->insertarInscripciones($inscripciones, $codigo, $correo);
            $to      = $correo;
            $subject = 'Código de inscripción San Romilla';
            $message = $message = '

            <html>
                <head>
                    <title>San Romilla</title>
                </head>
                <body>
                    <h1>GRACIAS POR APUNTARTE A LA SAN ROMILLA</h1>
                    <h3>Aquí tienes tu código de inscripción. Presentalo en portería para pagar tu dorsal y camiseta.</h3>
                    <h1><b>'.$codigo.'</b></h1>
                    <h3>Recuerda que el dorsal y la camiseta debes recogerla en portería antes de la carrera.</h3>
                </body>
            </html>
            ';

            $headers = "MIME-Version: 1.0" . "\r\n";

            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= 'From: San Romilla <escueladeportivaguadalupe@evg.es>';    
            $headers .= 'Reply-To: escueladeportivaguadalupe@evg.es' . "\r\n";  
            $headers .= 'X-Mailer: PHP/' . phpversion();
            mail($to, $subject, $message, $headers);

            if ($datos == 1) {
                echo $datos;
            } else {
                echo 0;
            }
        } else {
            echo "Fecha actual fuera del rango permitido.";
        }
    }
    
    private function isFechaWithinRange($fecha_actual, $inicio_inscripcion, $fin_inscripcion) {
        return $fecha_actual >= $inicio_inscripcion && $fecha_actual <= $fin_inscripcion;
    }
    
    /**
     * Método que obtiene las fechas de inscripción de la base de datos
     */
    public function getFechasInscripcion(){
        $datos = $this->modelo->getFechasInscripcion();
        $datos = $datos->fetch_all($resulttype = MYSQLI_ASSOC);
        header('Content-type: application/json; charset=utf-8');
        $cosas = json_encode($datos);
        echo $cosas;
    }
    
    
}

?>


