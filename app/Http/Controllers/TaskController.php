<?php

namespace App\Http\Controllers;

class TaskController extends Controller
{
    // liste des tâches
    public function index()
    {
        return view('tasks.index');
    }
}
