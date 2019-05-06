<?php
    require_once 'login.php';

    $conn = new mysqli($hn, $user, $passwd, $db);

    $playerName = mysqli_real_escape_string($conn, $_POST['name']);
    $time = $_POST['time'];
    $score = $_POST['score'];

    
    if ($conn->connect_error){
        die('<p>Error in connecting to MySQL!</p>');
    }

   
    $insertScoreQ = "INSERT INTO players (name, time, score) VALUES ('$playerName', $time, $score);";
    

    $insertScoreR = $conn->query($insertScoreQ);

    echo "Score logged!";


?>