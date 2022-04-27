<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../vendor/autoload.php';

$nombre = $email = $telefono = $mensaje = $producto = $response = '';
$_POST = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = test_input($_POST['form-nombre'], "Nombre");
    $email = test_input($_POST['form-email'], "Email");
    $telefono = test_input($_POST['form-telefono'], "Teléfono");
    $mensaje = test_input($_POST['form-mensaje'], "Mensaje");
    $producto = test_input($_POST['form-producto']);
}

function test_input($data, $label = '', $required = true) {
    if($required && empty($data)) {
        //throw new Exception('Valor requerido');
        $mensaje = "Falta un valor requerido";

        if ($label != '') $mensaje .= ": $label";
        $response = array(
            "success" => false,
            "type" => "warning",
            "message" => $mensaje
        );
        echo json_encode($response);
        die();
    }
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'mail.chida.company';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'bernardo@chida.company';                     //SMTP username
    $mail->Password   = 'Racatapulfuf1?';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('bernardo@chida.company', 'Mailer');
    $mail->addAddress('bernardoescoffie@gmail.com', 'Joe User');     //Add a recipient

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'CTA enviado desde ' . $producto;
    $mail->Body    = "<p>Enviado desde el sitio web de $producto</p>

    <p>Nombre: $nombre</p>
    <p>Email: $email</p>
    <p>Teléfono: $telefono</p>
    
    <p>Mensaje: </p>
    " .nl2br($mensaje);
    $mail->AltBody = "Enviado desde el sitio web de $producto

    Nombre: $nombre
    Email: $email
    Teléfono: $telefono
    
    Mensaje: 
    $mensaje
    ";

    $mail->send();

    $response = [];

    $response = array(
        "success" => true,
        "type" => "success",
        "message" => "Su mensaje fue enviado exitosamente"
    );
    
} catch (Exception $e) {
    $response = array(
        "success" => false,
        "type" => "error",
        "message" => "El mensaje no se pudo enviar. Mailer Error: {$mail->ErrorInfo}"
    );
}

header('Content-Type: application/json');
echo json_encode($response);
die();