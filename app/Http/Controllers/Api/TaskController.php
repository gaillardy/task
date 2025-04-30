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
     * Display a listing of the resource.
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
            'data' => $query->get()->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'completed' => $task->completed,
                    'created_at' => $task->created_at->toISOString()
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
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

    

    public function update(Request $request, Task $task)
{
    $validated = $request->validate([
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
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }
}
