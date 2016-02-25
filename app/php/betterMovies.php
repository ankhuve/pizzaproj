<?php
include_once("config.php");
include_once("functions.php");
include_once("imageColor.php");

$query = "SELECT * FROM movies";

$result = queryDb($conn, $query);

$moviesArray = [];


function rgb2hex($red, $green, $blue) {
  $hex = "0x";
  $hex .= str_pad(dechex($red), 2, "0", STR_PAD_LEFT);
  $hex .= str_pad(dechex($green), 2, "0", STR_PAD_LEFT);
  $hex .= str_pad(dechex($blue), 2, "0", STR_PAD_LEFT);

   return $hex; // returns the hex value including the number sign (#)
}

if($result){
    while($row = mysqli_fetch_assoc($result)) {
        
      $json_data = file_get_contents('http://www.omdbapi.com/?i='.$row["imdb_id"]);
      $movies = json_decode( $json_data );
      $poster = $movies->Poster;
      $rating = $movies->imdbRating;
      $runtime = $movies-> Runtime;


      if (strpos($poster, 'http') !== false) {
        $posterColor = imageColor::averageResize(imagecreatefromjpeg($poster));

          $red = $posterColor["red"];
          $green = $posterColor["green"];
          $blue = $posterColor["blue"];

          $rgb = "rgb(" . $red . "," . $green . "," . $blue . ")";

          //$hex = rgb2hex($red, $green, $blue);

          // echo $rgb . ", ";
          // echo $row["name"] . ", ";
          // echo $row["year"] . ", ";
          // echo $rating . ", ";
          // echo $runtime . ", ";
          // echo "<br />";
          $movieObject = [$row["name"],$row["year"], $rgb, $rating, $runtime];
          //$movieObject = {"name":$row["name"],"year": $row["year"],"poster": $rgb,"rating": $rating,"runtime": $runtime};
          $moviesArray[] = $movieObject;
}
  //$movieObject = {"name":$row["name"],"year": $row["year"],"poster": $posterColor,"rating": $rating,"runtime": $runtime};
  //$movies[] = $row["name"];
  //echo "<br>Imdb-ID: " . $row["imdb_id"]. " - Movie name: " . $row["name"]. " - Year: " . $row["year"];
  }

}

echo json_encode($moviesArray);