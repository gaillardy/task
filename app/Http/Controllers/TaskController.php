<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return view('tasks.index');
    }

    public function create()
    {
        return view('tasks.create');
    }

    public function store(Request $request)
    {
        // Validate and store the task
        // Redirect to the task list
    }

    

    public function edit($id)
    {
        return view('tasks.edit', compact('id'));
    }

    public function update(Request $request, $id)
    {
        // Validate and update the task
        // Redirect to the task list
    }

    public function destroy($id)
    {
        // Delete the task
        // Redirect to the task list
    }
}
