<?php

function queryDb($conn, $query){
    if (($result = mysqli_query($conn, $query)) === false) {
        printf("Query failed: %s<br />\n%s", $query, mysqli_error($conn));
        exit();
    }
    return $result;
}

