<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LevelModel;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        LevelModel::create([
            'name' => 'LEVEL1',
            'link' => 'level1',
            'description' => 'Level ini merupakan level yang paling mudah. Yuk dapatkan 10 point untuk meraih kemenangan.',
            'gambar' => '/img/level1.png',
        ]);

        LevelModel::create([
            'name' => 'LEVEL2',
            'link' => 'level2',
            'description' => 'Level ini kamu akan memiliki bonus nyawa, nyawa akan membantu kamu dalam bermain. Yuk dapatkan 15 point untuk meraih kemenangan.',
            'gambar' => '/img/level2.png',
        ]);

        LevelModel::create([
            'name' => 'LEVEL3',
            'link' => 'level3',
            'description' => 'Level ini kamu akan memiliki rintangan berupa tembok, Apabila kamu menabrak tembok kamu akan kalah. Yuk dapatkan 20 point untuk meraih kemenangan.',
            'gambar' => '/img/level3.png',
        ]);

        LevelModel::create([
            'name' => 'LEVEL4',
            'link' => 'level4',
            'description' => 'Level ini sama seperti level 3 tetapi tembok akan bertambah banyak. Yuk dapatkan 20 point untuk meraih kemenangan.',
            'gambar' => '/img/level4.png',
        ]);

        LevelModel::create([
            'name' => 'LEVEL5',
            'link' => 'level5',
            'description' => 'Level ini sangat susah saya pun tidak yakin kamu bisa memenangkannya. Yuk dapatkan 25 point untuk meraih kemenangan.',
            'gambar' => '/img/level5.png',
        ]);


    }
}
