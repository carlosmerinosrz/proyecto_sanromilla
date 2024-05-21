<?php
$to      = 'lmerinoo02@gmail.com';
$subject = 'Código de inscripción';
$message = $message = '

<html>
    <head>
        <title>Office supplies for March</title>
    </head>
    <body>
        <h1>GRACIAS POR APUNTARTE A LA SAN ROMILLA</h1>
        <h6>Aquí tienes tu código de inscripción. Presentalo en portería para pagar en efectivo, o añadelo en el concepto de tu bizum o transferencia.</h6>
        <h1><b>5234</b></h1>
        <h6>Recuerda que el dorsal y la camiseta debes recogerla en portería o el día de la carrera.</h6>
    </body>
</html>
';

$headers = "MIME-Version: 1.0" . "\r\n";

$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: San Romilla <escueladeportivaguadalupe@evg.es>';    

mail($to, $subject, $message, $headers);
echo 'mail enviado a '.$to;
?>