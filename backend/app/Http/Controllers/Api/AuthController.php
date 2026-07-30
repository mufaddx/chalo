<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:191', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'], // hashed via the model's 'hashed' cast
            'role' => 'customer',
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('customer-app')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! $user->password || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'These credentials do not match our records.']);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages(['email' => 'This account has been deactivated.']);
        }

        $tokenName = $data['remember'] ?? false ? 'remembered-session' : 'session';

        return response()->json([
            'user' => $user,
            'token' => $user->createToken($tokenName)->plainTextToken,
        ]);
    }

    /**
     * Google Sign-In: exchange a Google ID token (verified client-side or via
     * Google's tokeninfo endpoint upstream) for a Voyagr session. Account is
     * created on first login, matched by google_id thereafter.
     */
    public function loginWithGoogle(Request $request)
    {
        $data = $request->validate([
            'google_id' => ['required', 'string'],
            'email' => ['required', 'email'],
            'name' => ['required', 'string', 'max:150'],
            'avatar_path' => ['nullable', 'string'],
        ]);

        $user = User::firstOrCreate(
            ['google_id' => $data['google_id']],
            [
                'name' => $data['name'],
                'email' => $data['email'],
                'avatar_path' => $data['avatar_path'] ?? null,
                'role' => 'customer',
                'email_verified_at' => now(),
            ],
        );

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('google-session')->plainTextToken,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent.'])
            : response()->json(['message' => 'Unable to send reset link.'], 422);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
