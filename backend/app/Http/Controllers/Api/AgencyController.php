<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterAgencyRequest;
use App\Http\Resources\AgencyResource;
use App\Mail\AgencyRegistrationSubmitted;
use App\Models\Agency;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AgencyController extends Controller
{
    public function index()
    {
        return AgencyResource::collection(
            Agency::verified()->withCount('tours')->orderByDesc('rating_avg')->paginate(12)
        );
    }

    public function show(Agency $agency)
    {
        abort_unless($agency->isVerified(), 404);

        return new AgencyResource($agency->loadCount('tours'));
    }

    /**
     * POST /api/agencies/register — business rule #10/#11: every agency and
     * every tour must be approved by Super Admin before going live. This
     * creates the owner account + agency profile + first verification
     * document, all in `pending` status, and emails the admins.
     */
    public function register(RegisterAgencyRequest $request)
    {
        $agency = DB::transaction(function () use ($request) {
            $owner = User::create([
                'name' => $request->validated('owner_name'),
                'email' => $request->validated('owner_email'),
                'password' => $request->validated('owner_password'),
                'phone' => $request->validated('phone'),
                'role' => 'agency',
            ]);

            $agency = Agency::create([
                'user_id' => $owner->id,
                'name' => $request->validated('agency_name'),
                'slug' => Str::slug($request->validated('agency_name')).'-'.Str::random(5),
                'phone' => $request->validated('phone'),
                'email' => $request->validated('owner_email'),
                'office_address' => $request->validated('office_address'),
                'city' => $request->validated('city'),
                'years_experience' => $request->validated('years_experience'),
                'status' => 'pending',
            ]);

            $agency->verifications()->create([
                'document_type' => $request->validated('document_type'),
                'document_path' => $request->validated('document_path'),
                'status' => 'pending',
            ]);

            return $agency;
        });

        foreach (User::where('role', 'admin')->pluck('email') as $adminEmail) {
            Mail::to($adminEmail)->queue(new AgencyRegistrationSubmitted($agency));
        }

        return response()->json([
            'message' => 'Registration submitted. Our team will review your documents within 2-3 business days.',
            'agency' => new AgencyResource($agency),
        ], 201);
    }
}
