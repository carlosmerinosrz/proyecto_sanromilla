<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $to = $_POST["recipient"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Additional headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: Your Name <your@example.com>' . "\r\n";

    // Send email
    $mailSent = mail($to, $subject, $message, $headers);

    // Check if the email was sent successfully
    if ($mailSent) {
        echo "Email sent successfully!";
    } else {
        echo "Failed to send email!";
    }
}
?>
