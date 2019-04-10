<?php 
require_once 'login.php';

$uName = trim($_POST['uName']);
$passW = trim($_POST['pass']);
$passW2 = trim($_POST['pass2']);

if (empty($uName) || empty($passW) || empty($passW2))
	die('<p>Please fill out all information boxes completely.</p>');

if($passW != $passW2)
	die('<p>Your passwords do not match, please re-enter your passwords.</p>');

$conn = new mysqli($hn, $user, $passwd, $db);
if ($conn->conect_error)
  die('<p>Error in connecting to MySQL!</p>');

$conn = new mysqli($hn, $user, $passwd, $db);
if ($conn->conect_error)
  die('<p>Error in connecting to MySQL!</p>');

$query = "SELECT * FROM players WHERE username='$uName';";
$result = $conn->query($query);

if ($result && $result->num_rows == 1)
	die("<p>'$uName' is already registered!</p>");

$query = "INSERT INTO players(username, password) VALUES('$uName', '$passW');";
$result = $conn->query($query);
if($result)
	echo "<p>Sign-up complete!</p>";
else
	die('<p>I am sorry, there was an error in registration, please try again later...</p>');

$result->close();
$conn->close();
?>