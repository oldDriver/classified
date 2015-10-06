<?php
return [
    'user1' => [
        'username' => 'admin',
        'email' => 'admin@sandbox.local',
        'auth_key' => strtr(substr(base64_encode(rand(1000, 50000)), 0, 32), '+/', '_-'),
        'password_hash' => password_hash('admin', PASSWORD_DEFAULT, ['cost' => 13]),
    ],
    'user2' => [
        'username' => 'user',
        'email' => 'user@sandbox.local',
        'auth_key' => 'dZlXsVnIDgIzFgX4EduAqkEPuphhOh9q',
        'password_hash' => '$2y$13$kkgpvJ8lnjKo8RuoR30ay.RjDf15bMcHIF7Vz1zz/6viYG5xJExU6',
    ],
];