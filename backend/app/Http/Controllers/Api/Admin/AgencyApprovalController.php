<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AgencyResource;
use App\Models\Agency;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class AgencyApprovalController extends Controller
{
    public function __construct(private readonly ActivityLogger $activityLogger)
    {
    }

    public function index(Request $request)
    {
        $agencies = Agency::with(['verifications', 'owner'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15);

        return AgencyResource::collection($agencies);
    }

    public function approve(Request $request, Agency $agency)
    {
        $this->authorize('approve', $agency);

        $agency->update(['status' => 'verified', 'verified_at' => now(), 'rejection_reason' => null]);
        $agency->verifications()->where('status', 'pending')->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $this->activityLogger->log('agency.approved', $agency, description: "Approved {$agency->name}");

        return new AgencyResource($agency);
    }

    public function reject(Request $request, Agency $agency)
    {
        $this->authorize('approve', $agency);

        $data = $request->validate(['reason' => ['required', 'string', 'max:255']]);

        $agency->update(['status' => 'rejected', 'rejection_reason' => $data['reason']]);
        $agency->verifications()->where('status', 'pending')->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'remarks' => $data['reason'],
        ]);

        $this->activityLogger->log('agency.rejected', $agency, description: $data['reason']);

        return new AgencyResource($agency);
    }

    public function suspend(Request $request, Agency $agency)
    {
        $this->authorize('suspend', $agency);

        $data = $request->validate(['reason' => ['required', 'string', 'max:255']]);
        $agency->update(['status' => 'suspended', 'rejection_reason' => $data['reason']]);

        $this->activityLogger->log('agency.suspended', $agency, description: $data['reason']);

        return new AgencyResource($agency);
    }
}
