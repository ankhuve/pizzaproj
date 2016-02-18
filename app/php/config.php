<?php
$hostname = 'xml0.csc.kth.se';
$username = 'eforsbe';
$password = 'eforsbe-xmlpub13';
$database = 'eforsbe';

$conn = mysqli_connect($hostname, $username, $password, $database);

if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
};
?>