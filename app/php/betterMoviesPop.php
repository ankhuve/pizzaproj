<?php
include_once("config.php");
include_once("functions.php");
include_once("imageColor.php");

//$query = "SELECT * FROM moviesPop";
 $query = "SELECT * FROM moviesFinal";
// $query = "SELECT * FROM Testhest";

$result = queryDb($conn, $query);

$moviesArray = [];

if($result){
    while($row = mysqli_fetch_assoc($result)) {
          $movieObject = [$row["name"],$row["year"],$row["color"],$row["rating"],$row["imdbID"],$row["themeSong"],$row["poster"],$row["genre"],$row["plot"], $row["preview"], $row["actors"], $row["directedBy"], $row["votes"]];
          $moviesArray[] = $movieObject;
    }
}

echo json_encode($moviesArray);