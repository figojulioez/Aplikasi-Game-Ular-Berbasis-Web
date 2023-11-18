<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\LevelModel;

class ScoreModel extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function User() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function LevelModel() {
        return $this->belongsTo(LevelModel::class, 'level_id');
    }
}
