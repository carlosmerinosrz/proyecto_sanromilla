<?php

    /**
    *Fichero de configuración, lo usaremos para movernos entre los distintos archivos con el patrón MVC,
    *estos datos dan la información de localización de archivos y se cumplimenta con la petición http recibida
    */
    return array(
        'debug' => true,
        'test' => true,
		'path_controladores' => './controladores/',
		'path_vistas' => './vistas/',
		'path_modelos' => './modelos/',
		'path_html' => './vistas/',
        'algoritmo_encriptacion' => 'aes-256-ctr',
        'clave_encriptacion' => 'Clave de encriptación',
    );

?>