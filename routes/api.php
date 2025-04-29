<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
/**
 * Liste des tâches
 * @group Task
 * method GET
 * @url /api/tasks
 * description : Liste des tâches
 */
Route::get('/tasks', [TaskController::class, 'index']);

/**
 * Créer une tâche
 * @group Task
 * method POST
 * @url /api/tasks
 * description : Créer une tâche
 */
Route::post('/tasks', [TaskController::class, 'store']);
/**
 * Modifier une tâche
 * @group Task
 * method PUT
 * @url /api/tasks/{task}
 * description : Modifier une tâche
 */
Route::put('/tasks/{task}', [TaskController::class, 'update']);
/**
 * Supprimer une tâche
 * @group Task
 * method DELETE
 * @url /api/tasks/{task}
 * description : Supprimer une tâche
 */
Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);