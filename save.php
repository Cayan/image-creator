<?php

// This is probably unsafe

$img = $_POST['data'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

$filePath = 'files';
$fileName = date('Ymdhis') . hash('sha1', $fileData) . '.png';

if (!is_dir($filePath)) {
    mkdir($filePath);
    if (!is_dir($filePath)) {
        die('Could not create a folder to save the image.');
    }
}

file_put_contents($filePath . DIRECTORY_SEPARATOR . $fileName, $fileData);
