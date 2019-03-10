<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '/PHPMailer/src/Exception.php';
require '/PHPMailer/src/PHPMailer.php';
require '/PHPMailer/src/SMTP.php';
try {
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->SMPTPAuth();
$mail->SMTPSecure = 'ssl';
$mail->Host = 'smtp.domain.com';
$mail->Port = '993';
$mail->isHTML();
$mail->Username = 'spotstop@onespotstop.com';
$mail->Password = 'Spotstopsfhack2019';
$mail->SetFrom('shotaebikawa@gmail.com');
$mail->Subject = $_POST['name'];
$mail->Body = $_POST['message'];
$mail->AddAddress('shotaebikawa@gmail.com');
$mail->Send();
} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;

}

?>


