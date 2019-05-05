<?php
    require_once('login.php');

    $conn = new mysqli($hn, $user, $passwd, $db);

    $playerName = $conn->real_escape_string($_POST['name']);
    $time = $conn->real_escape_string($_POST['time']);
    $score = $conn->real_escape_string($_POST['score']);

    if ($conn->conect_error){
        die('<p>Error in connecting to MySQL!</p>');
    }

    $insertScoreQ = "INSERT INTO players VALUES ('$playerName', '$time', '$score');";


?>