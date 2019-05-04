<?php
	require_once 'login.php';
	
$username = trim($_POST['user']);
$password = trim($_POST['pass']);

$conn = new mysqli($hn, $user, $passwd, $db);
if ($conn->conect_error)
  die('<p>Error in connecting to MySQL!</p>');

$query = "SELECT * FROM players WHERE username = '$username' AND password = '$password';";
$result = $conn->query($query);
if ($result && $result ->num_rows == 1)
	echo("<p> You are now signed in! Enjoy Shape Escape! </p>");
else die("<p>Your username and/or password is incorrect. </p>");

$result->close();
$conn->close();
?>