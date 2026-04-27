<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if (Auth::attempt($validate)) {
            $token = Auth::user()->createToken('auth-token')->plainTextToken;
            return response()->json(['token' => $token], 200);
        }
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);
        $validate['password'] = bcrypt($validate['password']);
        $user = User::create($validate);
        $token = $user->createToken('auth-token')->plainTextToken;
        Auth::login($user);

        return response()->json(['message' => 'User registered successfully', 'token' => $token], 201);
    }
    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}

