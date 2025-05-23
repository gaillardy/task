<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Task::factory(20)->create();
        
        // Tâches spécifiques pour les tests
        Task::factory()->create([
            'title' => 'Première tâche importante',
            'completed' => false,
        ]);
    }
}
