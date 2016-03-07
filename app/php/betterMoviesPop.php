<?php
include_once("config.php");
include_once("functions.php");
include_once("imageColor.php");

$query = "SELECT * FROM moviesPop";

$result = queryDb($conn, $query);

$moviesArray = [];

if($result){
    while($row = mysqli_fetch_assoc($result)) {
          $movieObject = [$row["name"],$row["year"],$row["color"],$row["rating"]];
          $moviesArray[] = $movieObject;
    }
}

echo json_encode($moviesArray);