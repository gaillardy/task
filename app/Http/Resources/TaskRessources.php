<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskRessources extends JsonResource
{
    public static $wrap = 'task';
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'description' => $this->resource->description,
            'priority' => $this->resource->priority,
            'completed' => $this->resource->completed,
        ];
    }
}
