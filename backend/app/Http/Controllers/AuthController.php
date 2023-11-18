<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\LevelModel;
use App\Models\ScoreModel;
use App\Models\LogActivity;
use App\Http\Resources\HighScore;

class AuthController extends Controller
{

    public function __construct () {
        $this->middleware(['auth:sanctum'], ['except' => ['login', 'registrasi', 'all']]);
    }

    public function registrasi () {
 
        $rules = [
            'email' => ['required', 'email', 'unique:users,email'],
            'name' => ['required', 'min:3', 'max:12'], 
            'password' => ['required', ],

        ];

        $validator = Validator::make(request(['email', 'name', 'password']), $rules );

        if ( $validator->fails() ) {
            return response()->json($validator->messages(), 422);
        }

        $users = User::create([
            'email' => request('email'),
            'name' => request('name'),
            'password' => Hash::make(request('password')),
        ]);

        ScoreModel::create([
            'user_id' => $users->id,
            'level_id' => 1,
            'score' => 0,
            'level' => 1,
        ]);

        return response()->json(['data' => $users]);
    }

    public function login () {
        $rules = [
            'email' => ['required'],
            'password' => ['required'],
        ];

        $validator = Validator::make(request(['email', 'password']), $rules);   

        if ( $validator->fails() ) {
            return response()->json($validator->messages(), 422);
        }        

        if (! Auth::attempt(['email' => request('email'), 'password' => request('password')]) ) {
            return response()->json(['message' => 'Unauthorized']);
        }

        $this->createLog('login');
        return $this->responWithToken(request('email'));
    }

    public function responWithToken ($email) {
        $user = Auth::user();

        return response()->json([
            'token' => $user->createToken($email)->plainTextToken,
        ]);
    }

    public function logout () {
        $this->createLog('logout');

        $token = Auth::user();
        $token->tokens()->where('name', auth()->user()->email)->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me () {
        return response()->json(auth()->user());
    }

    public function yourLevel () {
        $level = ScoreModel::where('user_id', auth()->user()->id)->max('level');
        $data = LevelModel::where('id', $level)->get();
        return response()->json($data);
    }

    public function createScore () {
        ScoreModel::create([
            'user_id' => auth()->user()->id,
            'level_id' => request('level_id'),
            'description' => request('description'),
            'score' => request('score'),
            'level' => request('level')
        ]);

        return response()->json(['bisa']); 
    }

    public function showScore () {
        $historiSaya = ScoreModel::where('user_id', auth()->user()->id)->where('description', '!=' ,null)->latest()->get();
        
        return response()->json($historiSaya);
    }

    public function all () {
        return HighScore::collection(User::with('ScoreModel')->get());
    }

    public function createLog ($ket) {
        $description = 'Anda telah ' . $ket . ' pada';
        date_default_timezone_set('Asia/Jakarta');
        LogActivity::create([
            'user_id' => auth()->user()->id,
            'description' => $description,
            'tanggal' => date('Y-m-d H:i'),
        ]);
    }

    public function showLog () {
        return response()->json(LogActivity::where('user_id', auth()->user()->id)->orderBy('id', 'desc')->get());
    }


}

