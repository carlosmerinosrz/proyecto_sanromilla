<?php
    /**
     * Archivo php que getionara los controladores del modelo MVC del servidor, será la entrada a las peticiones http
     */

    //Confirmamos que existe una sesión iniciada, sino, seria reenviado de vuelta a la página de juego
    session_start();
    if( true){
        //Obtenemos el array de configuración descrito en config/config.php para así facilitar la gestión
        $config=require_once("config/config.php");
        // $usuario=$_SESSION['nombre'];
        //Leemos el metodo de la petición que recibimos
        // $metodo=$_SERVER['REQUEST_METHOD'];

        //Recogemos los pathparams, en nuestro caso, seran los indicadores de a que controlador deben de dirigirse dicha solicitud
        $pathParams=null;
        if(isset($_SERVER['PATH_INFO'])){//Estos parámetros si existen, estaran recogidos en ese elemento del array $_SERVER
            $pathParams=explode('/',$_SERVER['PATH_INFO']);//Con el siguiente método, estamos conformando un array que parte de $_SERVER['PATH_INFO'] y que
                                                            //y que separamos con / que es como viene en la petición
        }
        
        //Si no viene el nombre del controlador o el método, hay algo mal entonces redirigimos al index html
        if(!isset($pathParams[1]) || !isset($pathParams[2])){
            header('location: ../');

        }
        else{
            //El controlador siempre sera el primero en recibirse, no se pone el 0 por que viene vacío
            $controlador=$pathParams[1];
            $metodo=$pathParams[2];
            $parametrosQuery=null;
            //Función específica para la lectura de parametros query de las peticiones, lee dichos parámetros y los inserta en $paramQuery
            parse_str($_SERVER["QUERY_STRING"],$parametrosQuery);
            require_once($config['path_controladores'].'controlador'.$controlador.'.php');
            $nombreControlador=$controlador.'Controller';
            $control=new $nombreControlador();
            return $control->$metodo();
        }
       
    }else{
        header('location:../');
    }
    
?>