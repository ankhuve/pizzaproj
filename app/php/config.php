<?php
$hostname = 'mysql17.citynetwork.se';
$username = '102625-ki68218';
$password = 'erikluktarkorv';
$database = '102625-ivis';

$conn = mysqli_connect($hostname, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected to the database.";