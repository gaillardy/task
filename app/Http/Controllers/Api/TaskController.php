<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskRessources;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Listing des tâche en utilisan l'API resource
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Task::query();
        TaskRessources::collection($query->get());
        
        // Gestion du tri
        switch ($request->input('sort')) {
            case 'completed':
                $query->orderBy('completed')
                      ->orderByDesc('created_at');
                break;
                
            default: // 'date' par défaut
                $query->orderByDesc('created_at');
        }
        
        return response()->json([
            'data' => $query->get()->map(fn($task) => [
            'id' => $task->id,
            'title' => $task->title,
            'completed' => $task->completed,
            'created_at' => $task->created_at->toISOString()
            ])
        ]);
    }

    /**
     * Creation d'une nouvelle tâche
     * @param \App\Http\Requests\TaskRequest $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function store(TaskRequest $request)
    {
        $validated = $request->validated();
        $task = Task::create($validated);
        
        // Retourne une réponse complète et formatée
        return response()->json([
            'id' => $task->id,
            'title' => $task->title,
            'completed' => false,
            'created_at' => $task->created_at->toISOString(),
        ], 201);
    }

    

    /**
     * Mise à jour d'une tâche 
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Task $task
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'completed' => 'sometimes|boolean'
        ]);

        $task->update([
            'title' => $request->input('title', $task->title),
            'completed' => $request->boolean('completed', $task->completed)
        ]);

        return response()->json($task);
    }

    /**
     * Suppression d'une tâche
     * @param \App\Models\Task $task
     * @return mixed|\Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }
}
