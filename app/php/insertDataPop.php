<?php
include_once("config.php");
include_once("functions.php");
include_once("imageColor.php");

$moviesArray = [];
$parts = [];

$popMovies = array("The Shawshank Redemption ","The Godfather ","The Godfather: Part II ","The Dark Knight ","Pulp Fiction ","Schindler's List ","12 Angry Men ","The Lord of the Rings: The Return of the King ","Il buono, il brutto, il cattivo ","Fight Club ","The Lord of the Rings: The Fellowship of the Ring ","Star Wars: Episode V - The Empire Strikes Back ","Forrest Gump ","Inception ","One Flew Over the Cuckoo's Nest ","The Lord of the Rings: The Two Towers ","Goodfellas ","The Matrix ","Shichinin no samurai ","Star Wars ","Cidade de Deus ","Se7en ","The Silence of the Lambs ","The Usual Suspects ","It's a Wonderful Life ","La vita è bella ","Léon ","C'era una volta il West ","Sen to Chihiro no kamikakushi ","Saving Private Ryan ","Interstellar ","Casablanca ","American History X ","Psycho ","City Lights ","Raiders of the Lost Ark ","Rear Window ","Intouchables ","Modern Times ","The Green Mile ","Terminator 2: Judgment Day ","Deadpool ","The Pianist ","The Departed ","Whiplash ","Back to the Future ","Memento ","Gladiator ","Apocalypse Now ","Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb ","The Prestige ","Sunset Blvd. ","The Lion King ","Alien ","The Great Dictator ","Das Leben der Anderen ","Nuovo Cinema Paradiso ","Django Unchained ","The Shining ","Paths of Glory ","The Dark Knight Rises ","WALL·E ","Hotaru no haka ","American Beauty ","Aliens ","Mononoke-hime ","Citizen Kane ","Oldeuboi ","North by Northwest ","Vertigo ","Once Upon a Time in America ","Das Boot ","M ","Star Wars: Episode VI - Return of the Jedi ","Witness for the Prosecution ","Le fabuleux destin d'Amélie Poulain ","Reservoir Dogs ","Braveheart ","Requiem for a Dream ","A Clockwork Orange ","Taxi Driver ","Toy Story 3 ","Double Indemnity ","Star Wars: Episode VII - The Force Awakens ","To Kill a Mockingbird ","Lawrence of Arabia ","Eternal Sunshine of the Spotless Mind ","Full Metal Jacket ","Amadeus ","The Sting ","Singin' in the Rain ","Ladri di biciclette ","2001: A Space Odyssey ","Snatch. ","Monty Python and the Holy Grail ","Toy Story ","The Kid ","Inglourious Basterds ","L.A. Confidential ","Rashômon ","Per qualche dollaro in più ","The Apartment ","All About Eve ","Indiana Jones and the Last Crusade ","Jodaeiye Nader az Simin ","Metropolis ","Scarface ","Inside Out ","The Treasure of the Sierra Madre ","Yôjinbô ","Batman Begins ","Some Like It Hot ","The Third Man ","Unforgiven ","3 Idiots ","Jagten ","Up ","Good Will Hunting ","Raging Bull ","Der Untergang ","Die Hard ","Chinatown ","The Great Escape ","Heat ","On the Waterfront ","El laberinto del fauno ","Sunrise: A Song of Two Humans ","Mr. Smith Goes to Washington ","Tonari no Totoro ","The Bridge on the River Kwai ","The Gold Rush ","Ikiru ","Room ","Ran ","Det sjunde inseglet ","Blade Runner ","El secreto de sus ojos ","Lock, Stock and Two Smoking Barrels ","The General ","Smultronstället ","Casino ","The Elephant Man ","Hauru no ugoku shiro ","The Revenant ","Warrior ","The Wolf of Wall Street ","V for Vendetta ","Judgment at Nuremberg ","A Beautiful Mind ","Gran Torino ","The Big Lebowski ","Rebecca ","The Deer Hunter ","Gone with the Wind ","Cool Hand Luke ","Fargo ","How to Train Your Dragon ","Trainspotting ","Incendies ","Dial M for Murder ","The Sixth Sense ","Into the Wild ","Finding Nemo ","It Happened One Night ","The Thing ","No Country for Old Men ","Gone Girl ","Mary and Max ","Mad Max: Fury Road ","Spotlight ","Kill Bill: Vol. 1 ","Rush ","The Maltese Falcon ","Life of Brian ","Hotel Rwanda ","Platoon ","Le salaire de la peur ","There Will Be Blood ","Butch Cassidy and the Sundance Kid ","Network ","Les quatre cents coups ","Stand by Me ","Persona ","12 Years a Slave ","The Princess Bride ","The Grand Budapest Hotel ","In the Name of the Father ","Touch of Evil ","Amores perros ","Shutter Island ","Million Dollar Baby ","Annie Hall ","Ben-Hur ","The Grapes of Wrath ","Relatos salvajes ","Hachi: A Dog's Tale ","Kaze no tani no Naushika ","Stalker ","Drishyam ","Les diaboliques ","Jurassic Park ","Gandhi ","8½ ","The Bourne Ultimatum ","Donnie Darko ","The Martian");

//$popMovies = array("The Lord of the Rings: The Fellowship of the Ring","Trainspotting","The Dark Knight Rises","Toy Story","The Lion King","The Shawshank Redemption","The Godfather","The Godfather: Part II","The Dark Knight","Pulp Fiction","Schindler's List","12 Angry Men", "Titanic");

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

foreach ($popMovies as $item) {
    $fixedItem = str_replace(" ", "+", $item);
    //$json_data = file_get_contents('http://www.omdbapi.com/?s='.$fixedItem.'&type=movie');
    $json_data = file_get_contents('http://www.omdbapi.com/?t='.$fixedItem.'&y=&plot=short&r=json');
    $allMovies = json_decode( $json_data );
    //var_dump($allMovies);
    $movies = $allMovies->Title;
    $year = $allMovies->Year;
    $imdbID = $allMovies->imdbID;
    $rating = $allMovies->imdbRating;
    $poster = $allMovies->Poster;
    $genre = $allMovies->Genre;
    $plot = $allMovies->Plot;
    $actors = $allMovies->Actors;
    $directedBy = $allMovies->Director;

    $json_data_theme_song = file_get_contents('https://www.googleapis.com/freebase/v1/mqlread?query=[{"type":"/film/film","name":"'.$fixedItem.'","featured_song":[],"gross_revenue":[]}]&key=AIzaSyCFvHOOiVNFilGS1xmd8Jwtr_eJCNr6bG4');
    $allMoviesThemeSong = json_decode( $json_data_theme_song );

    $result = $allMoviesThemeSong->result;
    $featuredSongArr = $result[0]->featured_song;

    //var_dump($featuredSongArr);
    //echo "<br />";

    $featuredSong = $featuredSongArr[0];

    if(strlen($featuredSong)>0) {
        $themeSong = $featuredSong;

        if(strpos($poster, 'http') !== false) {
            $posterColor = imageColor::averageResize(imagecreatefromjpeg($poster));
            $red = $posterColor["red"];
            $green = $posterColor["green"];
            $blue = $posterColor["blue"];
            $rgb = "rgb(" . $red . "," . $green . "," . $blue . ")";
        } else {
            $rgb = "rgb(0,0,0)";
        }

        $spotifyURL = 'https://api.spotify.com/v1/search?q='.urlencode($movies.' '.$themeSong).'&type=track';
        $items = spotify($spotifyURL);
        //var_dump($items);
        
        if(empty($items)) {
            $spotifyURL = 'https://api.spotify.com/v1/search?q='.urlencode($themeSong).'&type=track';
            $items = spotify($spotifyURL);

        }

        $previewURL = $items[0]->preview_url;

        echo $movies . "<br />";
        echo $imdbID . "<br />";
        echo $year . "<br />";
        echo $rating . "<br />";
        echo $poster . "<br />";
        echo $rgb . "<br />";
        echo $themeSong . "<br />";
        echo $genre . "<br />";
        echo $plot . "<br />";
        echo $previewURL . "<br />";
        echo $actors . "<br />";
        echo $directedBy . "<br />";
        echo "<br />";

        $parts[] = '("' . $movies . '","' . $imdbID . '",' . $year . ',"' . $rgb . '",' . $rating . ', "' . $themeSong . '", "' . $poster . '","' . $genre . '","' . $plot . '","' . $previewURL . '","' . $actors . '","' . $directedBy .'")';

        //$query = "INSERT INTO moviesPop (name, imdbID, year, color, rating, themeSong, poster, genre, plot) VALUES ('$movies', '$imdbID', '$year','$rgb','$rating','$themeSong','$poster','$genre','$plot')";

        //mysqli_query($conn, $query);

    } 
    //$movieObject = [$movies, $imdbID, $year, $rgb, $rating, $themeSong, $genre, $plot];
    //$moviesArray[] = $movieObject;
}


// create the sql query
$sql = "INSERT INTO moviesPop (name, imdbID, year, color, rating, themeSong, poster, genre, plot, preview, actors, directedBy) ";
$sql .= "VALUES " . implode(", ", $parts);

//var_dump($sql);

// //execute the query, tell us how it went
// if (mysqli_query($conn, $sql)) {
//     echo "New records created successfully";
// } else {
//     echo "Error: " . $sql . "<br>" . mysqli_error($conn);
// }

//echo json_encode($moviesArray);

?>