<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Agency = 'agency';
    case Admin = 'admin';
}
