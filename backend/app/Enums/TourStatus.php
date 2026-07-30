<?php

namespace App\Enums;

enum TourStatus: string
{
    case Draft = 'draft';
    case PendingApproval = 'pending_approval';
    case Published = 'published';
    case Rejected = 'rejected';
    case Closed = 'closed';
}
