<?php
include_once("config.php");
include_once("functions.php");
include_once("imageColor.php");

$moviesArray = [];
$parts = [];



$search = $_GET["search"];
//$search = "batman";

// get first page with results so we can see how many results we got
$json_data = file_get_contents('http://www.omdbapi.com/?s=' . $search . '&type=movie&page=1');
$popMovies = json_decode( $json_data );
$totalResults = $popMovies->totalResults; // total number of results
$numPages = ceil($totalResults/10); // the number of pages with results (10 per page via omdb)
// create one big array with all the pages' movies
for($i = 2; $i <= $numPages; $i++){
    $json_data = json_decode(file_get_contents('http://www.omdbapi.com/?s=' . $search .'&type=movie&page=' . $i));
    $movies = $json_data->Search;
    for($k = 0; $k < count($movies); $k++){
        array_push($popMovies->Search, $movies[$k]); // push every movie into the big array
    }
}

//function for getting previews of songs from spotify

function spotify($spotifyURL) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $spotifyURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:x.x.x) Gecko/20041107 Firefox/x.x");
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $json = curl_exec($ch);
    $json = json_decode($json);
    curl_close($ch);

    $tracks = $json->tracks;

    $items = $tracks->items;

    return $items;
}

//loops the popMovies array and finds the different attributes for every movie in the array

foreach ($popMovies->Search as $item) {
    //Make the title usable in the api URL    
    $item1 = str_replace(" ", "+", $item->Title);
    $fixedItem = str_replace("&", "and", $item1);
    //Gets the info on the film from OMDB
    $json_data = file_get_contents('http://www.omdbapi.com/?t='.$fixedItem.'&type=movie&y=&plot=short&r=json');
    
    
    //decodes the data from the api
    $allMovies = json_decode( $json_data );
    
    //checks if there is a response from the api
    if ($allMovies->Response != "False"){
    
    //Creates variables from the attributes and stip them from ' and "
    $rating = ( float ) $allMovies->imdbRating;
        $votez = str_replace(",", "", $allMovies->imdbVotes);
    $votes = (int) $votez;
        
    //Make sure we don not get any unwanted movies
        
        if (($rating > 6.9 && $votes > 10000) OR $votes>50000){
            
    $moviez = $allMovies->Title;
    $movies = str_replace("'", "", $moviez);
    //$movies = mysql_real_escape_string($allMovies->Title);
    $year = $allMovies->Year;
    $imdbID = $allMovies->imdbID;
    
    $poster = $allMovies->Poster;
    $genre = $allMovies->Genre;
        
    $plet = $allMovies->Plot;
    $plut = str_replace("'", "", $plet);
    $plot = str_replace('"', '', $plut);
    //$plot = mysql_real_escape_string($allMovies->Plot);
    $actorz = $allMovies->Actors;
    $actors = str_replace("'", "", $actorz);
    //$actors = mysql_real_escape_string($allMovies->Actors);
    $directedByz = $allMovies->Director;
    $directedBy = str_replace("'", "", $directedByz);
    //$directedBy = mysql_real_escape_string($allMovies->Director);
    
            
    //checks if there is a poster for that movie and extracts the color mean value
        if(strpos($poster, 'http') !== false) {
            $posterColor = imageColor::averageResize(imagecreatefromjpeg($poster));
            $red =$posterColor["red"];
            $green = $posterColor["green"];
            $blue = $posterColor["blue"];
            $rgb = "rgb(" . $red . "," . $green . "," . $blue . ")";
        } else {
            $rgb = "rgb(9,137,5)";
        }
        
            
            $themeSong = "";
            $previewURL = "";
        
    //Gets themesong from api with the use of the movie title
    $json_data_theme_song = file_get_contents('https://www.googleapis.com/freebase/v1/mqlread?query=[{"type":"/film/film","name":"'.$fixedItem.'","featured_song":[],"gross_revenue":[]}]&key=AIzaSyCFvHOOiVNFilGS1xmd8Jwtr_eJCNr6bG4');
    $allMoviesThemeSong = json_decode( $json_data_theme_song );

    $previewURL = "";
    $result = $allMoviesThemeSong->result;
            
    //if a themesong exists it will be used otherwise it will just return an empty string
    if(count($result)>0){
    $featuredSongArr = $result[0]->featured_song;
    
        $featuredSong ="";
    
        if(count($featuredSongArr)>0) {
    $featuredSong = $featuredSongArr[0];
        }
    
    

        $themeSong = "";

    if(strlen($featuredSong)>0) {
        $themeThong = $featuredSong;
        $themeSong = str_replace("'", "", $themeThong);


        $spotifyURL = 'https://api.spotify.com/v1/search?q='.urlencode($movies.' '.$themeSong).'&type=track';
        $items = spotify($spotifyURL);
        //var_dump($items);
        
        if(empty($items)) {
            $spotifyURL = 'https://api.spotify.com/v1/search?q='.urlencode($themeSong).'&type=track';
            $items = spotify($spotifyURL);

        }

        $previewURL = $items[0]->preview_url;

       

       
        
    }
        echo $movies . "<br />";
        echo $votes. "<br />";
        echo $imdbID . "<br />";
        echo $year . "<br />";
        echo $rating . "<br />";
//        echo $poster . "<br />";
//        echo $rgb . "<br />";
//        echo $themeSong . "<br />";
//        echo $genre . "<br />";
//        echo $plot . "<br />";
//        echo $previewURL . "<br />";
//        echo $actors . "<br />";
//        echo $directedBy . "<br />";
//        echo "<br />";

    } 
    
    //adds all attribute variables to an array for future use in SQL query
    
     $parts[] = "('" . $movies . "','" . $imdbID . "'," . $year . ",'" . $rgb . "'," . $rating . ",'" . $themeSong .  "','" . $poster .  "','" . $genre .  "','" . $plot .  "','" . $previewURL .  "','" . $actors .  "','" . $directedBy . "')";
    
    
          
    }
}
    
}



// create the sql query
$sql = "INSERT IGNORE INTO moviesFinal (name, imdbID, year, color, rating, themeSong, poster, genre, plot, preview, actors, directedBy) ";
$sql .= "VALUES " . implode(", ", $parts);


 //execute the query, tell us how it went
 if (mysqli_query($conn, $sql)) {
     echo "New records created successfully";
 } else {
     echo "Error: " . $sql . "<br>" . mysqli_error($conn);
 }


?>