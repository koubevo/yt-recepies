<?php
$data = $_GET['data'];
$data = ',' . $data . " ]";


$file = 'foods.json';
$backupFile = 'backup.json';
$currentFoods = file_get_contents($file);
$backup = $currentFoods;
$currentFoods = substr($currentFoods, 0, -2);

$newFoods = $currentFoods . $data;
$foodsDecoded = json_decode($newFoods, true);


$newFoods = json_encode($foodsDecoded, JSON_PRETTY_PRINT);
if ($newFoods != null && $newFoods != "NULL" && $newFoods != "null" && $newFoods != "") {
    file_put_contents($backupFile, $backup);
    file_put_contents($file, $newFoods);
    echo 'vlozeno';
} else {
    echo 'nevlozeno';
}
