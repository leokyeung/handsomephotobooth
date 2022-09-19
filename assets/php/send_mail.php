<?php

// Email address that you want the form to be submitted to.

$recieve_mails_at = "leo@handsomephotobooth.com";

$homePage = "/";
   
if (!isset($_REQUEST['email'])) {
   header( "Location: $homePage" );
}

   // Form Fields
   $firstname = $_REQUEST['firstname'];
   $lastname = $_REQUEST['lastname'];
   $email = $_REQUEST['email'];
   $subject = $_REQUEST['subject'];
   $message = $_REQUEST['message'];
   $headers = 'From: '.$email."\r\n" .
        'Reply-To: '.$email."\r\n" .
        'X-Mailer: PHP/' . phpversion();

   $msg = 
   "First Name: " . $firstname . "\r\n" . 
   "Last Name: " . $lastname . "\r\n" . 
   "Email: " . $email . "\r\n" . 
   "Subject: " . $subject . "\r\n" .
   "Message: " . $message ;


   // Send mail
   $send_email = mail( "$recieve_mails_at", "Contact Form", $msg, $headers);

   echo ($send_email) ? 'success' : 'error';

?>