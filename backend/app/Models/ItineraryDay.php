<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItineraryDay extends Model
{
    use HasFactory;

    protected $fillable = ['tour_id', 'day_number', 'title', 'description', 'meals', 'stay_name'];

    protected function casts(): array
    {
        return ['meals' => 'array'];
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
