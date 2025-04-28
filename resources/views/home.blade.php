@extends('base')
@section('title','Accueil')
@section('content')
<main class="main-content">
    <h1 class="welcome-title">Bienvenue sur notre API de Gestion de Tâches</h1>
    <p class="welcome-message">
        Une solution puissante pour organiser vos projets et suivre vos tâches efficacement.
        Commencez dès maintenant à optimiser votre productivité.
    </p>
    
    <div class="buttons-container">
        <a href="{{ route('tasks.index') }}" class="btn btn-primary">Voir les tâches</a>
        <a href="https://github.com/gaillardy/task.git" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <i class="fas fa-star"></i> Étoiles Github
        </a>
    </div>
</main>
@endsection