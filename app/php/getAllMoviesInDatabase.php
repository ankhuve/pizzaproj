<?php
include_once("config.php");
include_once("functions.php");

$query = "SELECT * FROM movies";

$result = queryDb($conn, $query);

$movies = [];

if($result){
    //echo( "<br><br>The query returned the following results: <br>" );
    while($row = mysqli_fetch_assoc($result)) {
    	$movies[] = $row["name"];
        //echo "<br>Imdb-ID: " . $row["imdb_id"]. " - Movie name: " . $row["name"]. " - Year: " . $row["year"];
    }

    echo json_encode($movies);
}
