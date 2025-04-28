@extends('base')
@section('title','Accueil')
@section('content')

<div class="container">
    <!-- Header avec toggle theme -->
    <div class="app-header">
        <h1>Todo List</h1>
        <button class="theme-toggle" aria-label="Toggle theme">
            <i class="fas fa-moon"></i>
        </button>
    </div>

    <!-- Formulaire d'ajout de tâche -->
    <form class="add-task-form" id="taskForm">
        <input type="text" class="task-input" id="taskInput" placeholder="Ajouter une nouvelle tâche..." required>
        <select class="priority-select" id="prioritySelect">
            <option value="low">Faible priorité</option>
            <option value="medium" selected>Moyenne priorité</option>
            <option value="high">Haute priorité</option>
            <option value="urgent">Urgent</option>
        </select>
        <button type="submit" class="add-btn">
            <i class="fas fa-plus"></i> Ajouter
        </button>
    </form>

    <!-- Bloc Todo List -->
    <div class="todo-list-container">
        <div class="todo-list-header">
            <h2 class="todo-list-title">Mes Tâches</h2>
            <div class="sort-options">
                <button class="sort-btn active" data-sort="date">
                    <i class="fas fa-calendar-alt"></i> Date
                </button>
                <button class="sort-btn" data-sort="priority">
                    <i class="fas fa-exclamation-circle"></i> Priorité
                </button>
                <button class="sort-btn" data-sort="completed">
                    <i class="fas fa-check-circle"></i> Complétées
                </button>
            </div>
        </div>

        <div class="todo-list" id="todoList">
            <!-- Les tâches seront ajoutées dynamiquement ici -->
        </div>

        <div class="todo-list-footer">
            <div class="tasks-count">
                <span class="completed-count">0</span> sur <span>0</span> tâches complétées
            </div>
            <button class="delete-completed-btn" id="deleteCompletedBtn">
                <i class="fas fa-trash-alt"></i> Supprimer cochées
            </button>
        </div>
    </div>
</div>

<!-- Éditeur de tâche -->
<div class="task-editor" id="taskEditor">
    <div class="editor-container">
        <div class="editor-header">
            <h3 class="editor-title">Modifier la tâche</h3>
            <button class="close-editor" id="closeEditor">&times;</button>
        </div>
        <div class="editor-content">
            <input type="text" class="editor-input" id="editorInput">
            <div class="editor-priority">
                <div class="priority-option selected" data-priority="low">
                    <i class="fas fa-arrow-down"></i> Faible
                </div>
                <div class="priority-option" data-priority="medium">
                    <i class="fas fa-equals"></i> Moyenne
                </div>
                <div class="priority-option" data-priority="high">
                    <i class="fas fa-arrow-up"></i> Haute
                </div>
                <div class="priority-option" data-priority="urgent">
                    <i class="fas fa-exclamation"></i> Urgent
                </div>
            </div>
            <div class="editor-actions">
                <button class="editor-btn cancel-btn" id="cancelEdit">Annuler</button>
                <button class="editor-btn save-btn" id="saveEdit">Enregistrer</button>
            </div>
        </div>
    </div>
</div>
@endsection