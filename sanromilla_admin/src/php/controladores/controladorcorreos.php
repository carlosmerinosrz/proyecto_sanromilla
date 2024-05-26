<?php
require_once('modelos/modelocorreos.php');

class correosController {
    private $modelo;

    function __construct(){
        $this->modelo = new ModeloCorreos();
    }

    public function enviarCorreo(){
        $subject = $_POST['subject']; // Assuming data is sent via POST
        $message = $_POST['message']; // Assuming data is sent via POST
        $correos = $this->modelo->getCorreos();
        
        $successCount = 0;
    
        // Set headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: San Romilla <escueladeportivaguadalupe@evg.es>' . "\r\n";
        $headers .= 'Reply-To: escueladeportivaguadalupe@evg.es' . "\r\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();
    
        while ($row = $correos->fetch_assoc()) {
            $to = $row['email']; // Use 'email' to access the email address
    
            if (mail($to, $subject, $message, $headers)) {
                $successCount++;
            }
        }
    
        echo "Correos enviados correctamente: $successCount";
    }
    
}
