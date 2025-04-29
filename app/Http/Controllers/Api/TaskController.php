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
    public function index()
    {
        $tasks = Task::orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'data' => $tasks->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'completed' => $task->completed,
                    'created_at' => $task->created_at->toISOString(),
                    'updated_at' => $task->updated_at->toISOString()
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
        $validated = $request->validated();
        $validated['completed'] = $request->has('completed') ? $request->input('completed') : $task->completed;
        $validated['priority'] = $request->input('priority', $task->priority);
        $task->update($validated);

        return $task;
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
