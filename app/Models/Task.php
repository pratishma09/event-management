<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'check_in_id',
        'description',
        'completed',
        'manager_status',
        'remarks',
        'date'
    ];

    public function checkIn()
    {
        return $this->belongsTo(CheckIn::class);
    }
}