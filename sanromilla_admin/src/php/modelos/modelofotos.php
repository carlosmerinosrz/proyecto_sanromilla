<?php
require_once('config/configdb.php');

/**
 * Clase Modelo de Fotos
 */
class ModeloFotos
{
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
    private function conectar(){
        $this->conexion = new mysqli($this->servidor, $this->usuario, $this->contrasenia, $this->bd);
        $this->conexion->set_charset("utf8");
    }

    /**
     * Método para subir las fotos a la base de datos
     */
    public function subirFotos($archivos, $categoria)
    {
        $this->conectar();

        if (
            isset($categoria) && !empty($categoria)
            && isset($archivos) && !empty($archivos)
        ) {
            $consulta = $this->conexion->prepare("INSERT INTO imagenes (url, id_categoria)
                                              VALUES (?, ?);");

            $consultaCategoria = $this->conexion->prepare("SELECT nombre FROM categorias WHERE id_categoria = ?");

            try {
                $consultaCategoria->bind_param("i", $categoria);
                $consultaCategoria->execute();

                $nombreCategoria = mysqli_stmt_get_result($consultaCategoria);
                $nombreCategoria = strtolower(mysqli_fetch_assoc($nombreCategoria)['nombre']);
                $table = array(
                    'á'=>'a','é'=>'e','í'=>'i', 'ó'=>'o','ú'=>'u','Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U'
                );
                $nombreCategoria = strtr($nombreCategoria, $table);
                $nombreCategoria = strtolower($nombreCategoria);

                foreach ($archivos['tmp_name'] as $indice => $tmp_name) {
                    $nombre_archivo = $archivos['name'][$indice];
                    $extension = pathinfo($nombre_archivo, PATHINFO_EXTENSION);


                    // Verificar si el archivo es una imagen válida
                    $mimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
                    $fileMimeType = mime_content_type($tmp_name);

                    if (!in_array($fileMimeType, $mimeTypes)) {
                        throw new Exception("Error: El archivo '{$nombre_archivo}' no es una imagen válida.");
                    }

                    $fecha_actual = date('Ymd_His');
                    $nombre_real = pathinfo($nombre_archivo, PATHINFO_FILENAME);
                    $nombre_final = "{$nombre_real}_{$fecha_actual}.{$extension}";
                    $ruta_destino = "/home/user2daw/public_html/22/sanromilla/admin/assets/images/categorias/" . $nombreCategoria . "/" . $nombre_final;

                    $subir = move_uploaded_file($tmp_name, $ruta_destino);

                    $consulta->bind_param("si", $nombre_final, $categoria);
                    $consulta->execute();
                }

                $consulta->close();
                return true;
            } catch (Exception $e) {
                echo 'Error al subir imágenes: ' . $e->getMessage();
            }
        }
    }

    /**
     * Método para sacar las fotos de la base de datos
     */
    public function getFotos($categoria)
    {
        $this->conectar();

        $datos = array(); // Inicializa $datos como un array vacío

        if (isset($categoria)) {
            $consulta = $this->conexion->prepare("SELECT * FROM imagenes WHERE id_categoria = ?");
            $consulta->bind_param("i", $categoria);
            $consulta->execute();

            $resultado = $consulta->get_result();
            $datos=$resultado->fetch_all( $resulttype = MYSQLI_ASSOC);

            $consulta->close();
            $this->conexion->close();
        } else {
            echo "error";
        }

        return $datos; // Devuelve los datos como resultado de la función
    }

    /**
     * Método para eliminar las fotos seleccionadas
     */
    public function eliminarFotosSeleccionadas($seleccionadas, $categoria)
    {
        $this->conectar();

        $consultaCategoria = $this->conexion->prepare("SELECT nombre FROM categorias WHERE id_categoria = ?");
        $consultaDelete = $this->conexion->prepare("DELETE FROM imagenes WHERE id_imagenes = ?");
        $consulta = $this->conexion->prepare("SELECT url FROM imagenes WHERE id_imagenes = ?");

        try{
            foreach ($seleccionadas as $idFoto) {
                $consultaCategoria->bind_param("i", $categoria);
                $consultaCategoria->execute();

                $nombreCategoria = mysqli_stmt_get_result($consultaCategoria);
                $nombreCategoria = strtolower(mysqli_fetch_assoc($nombreCategoria)['nombre']);
                $table = array(
                    'á'=>'a','é'=>'e','í'=>'i', 'ó'=>'o','ú'=>'u','Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U'
                );
                $nombreCategoria = strtr($nombreCategoria, $table);
                $nombreCategoria = strtolower($nombreCategoria);

                $consulta->bind_param("i", $idFoto);
                $consulta->execute();

                $resultado = $consulta->get_result();
                $fila = $resultado->fetch_assoc();
                $url = $fila['url'];
                $directorio = '/home/user2daw/public_html/22/sanromilla/admin/assets/images/categorias/'.$nombreCategoria.'/';
                //$directorio ='D:\PROGRAMAS\XAMPP\htdocs\sanromilla\sanromilla_admin\src\assets\images\categorias\\'.$nombreCategoria.'\\';
                $rutaAbsoluta = $directorio . $url;

                unlink(realpath($rutaAbsoluta));

                $consultaDelete->bind_param("i", $idFoto);
                $consultaDelete->execute();
            }
        }catch (Exception $e) {
            echo 'Error al eliminar imágenes: ' . $e->getMessage();
        }


        $consulta->close();
        $consultaDelete->close();
        $this->conexion->close();
    }

    /**
     * Método para eliminar las fotos de una categoría de la base de datos
     */
    public function eliminarAllFotos($categoria){
        $this->conectar();


        $consultaCategoria = $this->conexion->prepare("SELECT nombre FROM categorias WHERE id_categoria = ?");
        $consulta = $this->conexion->prepare("DELETE FROM imagenes WHERE id_categoria = ?");



        try {
            $consultaCategoria->bind_param("i", $categoria);
            $consultaCategoria->execute();

            $nombreCategoria = mysqli_stmt_get_result($consultaCategoria);
            $nombreCategoria = strtolower(mysqli_fetch_assoc($nombreCategoria)['nombre']);
            $table = array(
                'á'=>'a','é'=>'e','í'=>'i', 'ó'=>'o','ú'=>'u','Á'=>'A','É'=>'E','Í'=>'I','Ó'=>'O','Ú'=>'U'
            );
            $nombreCategoria = strtr($nombreCategoria, $table);
            $nombreCategoria = strtolower($nombreCategoria);

            $consulta->bind_param("i", $categoria);
            $consulta->execute();

            $directorio = '/home/user2daw/public_html/22/sanromilla/admin/assets/images/categorias/'.$nombreCategoria.'/';
            //$directorio = 'D:\PROGRAMAS\XAMPP\htdocs\sanromilla\sanromilla_admin\src\assets\images\categorias\\' . $nombreCategoria;

            // Verificar si el directorio existe
            if (is_dir($directorio)) {
                // Obtener la lista de archivos en el directorio
                $archivos = glob($directorio . '/*');

                // Eliminar cada archivo de la carpeta
                foreach ($archivos as $archivo) {
                    if (is_file($archivo)) {
                        unlink($archivo);
                    }
                }
            }
        } catch (Exception $e) {
            echo 'Error al eliminar imágenes: ' . $e->getMessage();
        }

        $consulta->close();
        $consultaCategoria->close();
        $this->conexion->close();

    }
}