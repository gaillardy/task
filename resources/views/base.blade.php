<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <title>@yield('title') / Gestion de tâche</title>
</head>
<body>
    <nav>
        <div class="nav-title"><a href="/">Gestion de Tâche</a></div>
        <a href="https://github.com/gaillardy/task.git" target="_blank" rel="noopener noreferrer" class="github-logo">
            <i class="fab fa-github"></i>
        </a>
    </nav>
    @yield('content')
</body>
</html>