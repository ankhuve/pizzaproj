<?php

function queryDb($conn, $query){

    if (($result = mysqli_query($conn, $query)) === false) {
        printf("<br>Query failed: %s<br />\n%s", $query, mysqli_error($conn));
        exit();
    }

    if (mysqli_num_rows($result) > 0) {
        return $result;
    } else {
        echo "<br>The query returned no results.";
    }

}

