<?php
include_once("config.php");
include_once("functions.php");


// get first page with results so we can see how many results we got
$json_data = file_get_contents('http://www.omdbapi.com/?s=Batman&type=movie&page=1');
$allMovies = json_decode( $json_data );
$totalResults = $allMovies->totalResults; // total number of results

$numPages = ceil($totalResults/10); // the number of pages with results (10 per page via omdb)


// create one big array with all the pages' movies
for($i = 2; $i <= $numPages; $i++){
    $json_data = json_decode(file_get_contents('http://www.omdbapi.com/?s=Batman&type=movie&page=' . $i));
    $movies = $json_data->Search;

    for($k = 0; $k < count($movies); $k++){
        array_push($allMovies->Search, $movies[$k]); // push every movie into the big array
    }
}


// create an array with all movies' attributes to build efficient sql query
$parts = [];
foreach( $allMovies->Search as $one ){
    $title = $one->Title;
    $year = $one->Year;
    $imdb = $one->imdbID;

    $parts[] = '("' . $title . '", "' . $imdb . '", ' . $year . ')';
}

// create the sql query
$sql = "INSERT INTO movies (name, imdb_id, year) ";
$sql .= "VALUES " . implode(", ", $parts);


// execute the query, tell us how it went
if (mysqli_query($conn, $sql)) {
    echo "New records created successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}