<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'completed' => $this->faker->boolean(20),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
            'description' => $this->faker->optional(0.5)->paragraph(3),
        ];
    }
}
