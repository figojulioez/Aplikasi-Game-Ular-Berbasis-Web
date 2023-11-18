<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\ScoreModel;

class HighScore extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $level = $this->ScoreModel->max('level');
        $score = ScoreModel::select('score')->where('user_id', $this->id)->sum('score');
        return [
            'nama' => $this->name,
            'level' => ScoreModel::where('user_id', $this->id)->max('level'),
            'score' => $score
        ];
    }
}
