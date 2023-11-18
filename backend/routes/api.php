<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group([
	'middleware' => 'api',
	'prefix' => 'auth',
], function ($router) {
	Route::post('/register', [AuthController::class, 'registrasi']);
	Route::post('/login', [AuthController::class, 'login']);
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::post('/me', [AuthController::class, 'me']);
	Route::post('/yourLevel', [AuthController::class, 'yourLevel']);
	Route::post('/createScore', [AuthController::class, 'createScore']);
	Route::post('/showScore', [AuthController::class, 'showScore']);
	Route::post('/allScore', [AuthController::class, 'all']);
	Route::post('/showLog', [AuthController::class, 'showLog']);

});