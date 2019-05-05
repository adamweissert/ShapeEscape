<?php

    require_once 'login.php';

    $conn = new mysqli($hn, $user, $passwd, $db);

    if($conn->connect_error){
        die('<p>Error in connecting to MySQL!</p>');
    }
    
    $topScoresQ = "SELECT * FROM players ORDER BY score DESC LIMIT 10;";

    $topScoresR = $conn->query($topScoresQ);

    if($topScoresR){
        $i = 1;
        while($scoreObj = $topScoresR->fetch_object()){
            $name = $scoreObj->name;
            echo "<p>$i. ".$scoreObj->score . "pts - " . strtoupper($name)." (".$scoreObj->time."s)</p>";
            $i++;
        }
    }
    else{
        die("Error getting scores (" . $conn->errno . "): " . $conn->error);
    }

    $topScoresR->close();
    $conn->close();

?>