<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        return TaskRessources::collection(Task::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validated();
        $validated['completed'] = $request->has('completed') ? $request->input('completed') : false;

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    

    public function update(Request $request, Task $task)
    {
        $validated = $request->validated();
        $validated['completed'] = $request->has('completed') ? $request->input('completed') : false;

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
