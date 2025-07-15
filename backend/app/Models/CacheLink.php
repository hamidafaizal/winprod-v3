<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CacheLink extends Model
{
    use HasFactory;

    protected $table = 'cache_links';

    protected $fillable = [
        'product_link',
    ];
}
