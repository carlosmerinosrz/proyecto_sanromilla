<?php
require_once('config/configdb.php');

/**
 * Clase Modelo del login
 */
class ModeloLogin
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
     * Método para comprobar el usuario
     */
    public function comprobarUsuario($email) {
        $this->conectar();

        $resultado = $this->conexion->prepare("SELECT * FROM colaboradores t1 WHERE t1.correo = ?;");
        $resultado->bind_param('s', $email);
        $resultado->execute();

        // Obtener el resultado de la consulta
        $resultados = $resultado->get_result();

        // Verificar si se encontró un usuario
        if ($resultados->num_rows > 0) {
            // Obtener el primer resultado como un array asociativo
            $usuario = $resultados->fetch_assoc();

            return $usuario;

        } else {
            // Cerrar la conexión y liberar los recursos
            $resultado->close();
            $this->conexion->close();

            // Devolver null si no se encontró un usuario
            return null;
        }
    }

    /**
     * Método para coger los roles de la base de datos
     */
    public function getRoles($idColaborador) {
        $this->conectar();

        $resultado = $this->conexion->prepare("SELECT t1.id_rol, t1.nombre
                                                FROM roles t1
                                                INNER JOIN roles_colaboradores t2 ON t1.id_rol = t2.id_rol
                                                WHERE t2.id_colaborador = ?;");
        $resultado->bind_param('i', $idColaborador);
        $resultado->execute();

        // Obtener el resultado de la consulta
        $resultados = $resultado->get_result();


        // Verificar si el colaborador tiene roles asociados
        if ($resultados->num_rows > 0) {
            // Array para almacenar los roles
            $roles = [];

            // Recorrer los resultados y agregarlos al array de roles
            while ($fila = $resultados->fetch_assoc()) {
                $roles[] = $fila;
            }

            // Retornar el array de roles
            return $roles;

        } else {
            // Cerrar la conexión y liberar los recursos
            $resultado->close();
            $this->conexion->close();

            // Devolver null si no tiene roles asociados
            return null;
        }
    }
}