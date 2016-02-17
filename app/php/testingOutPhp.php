<?php
include_once("config.php");
include_once("functions.php");

$query = "SELECT * FROM users";
$getUsers = queryDb($conn, $query);

var_dump($getUsers->fetch_object()->username);

echo utf8_decode("heeeej från php!");