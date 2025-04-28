 // Variables globales
 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
 let currentEditId = null;
 let currentSort = 'date';

 // DOM Elements
 const taskForm = document.getElementById('taskForm');
 const taskInput = document.getElementById('taskInput');
 const prioritySelect = document.getElementById('prioritySelect');
 const todoList = document.getElementById('todoList');
 const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
 const taskEditor = document.getElementById('taskEditor');
 const editorInput = document.getElementById('editorInput');
 const closeEditor = document.getElementById('closeEditor');
 const cancelEdit = document.getElementById('cancelEdit');
 const saveEdit = document.getElementById('saveEdit');
 const priorityOptions = document.querySelectorAll('.priority-option');
 const themeToggle = document.querySelector('.theme-toggle');
 const sortButtons = document.querySelectorAll('.sort-btn');

 // Initialisation
 function init() {
     renderTasks();
     updateTasksCount();
     setupEventListeners();
 }

 // Configuration des écouteurs d'événements
 function setupEventListeners() {
     taskForm.addEventListener('submit', addTask);
     deleteCompletedBtn.addEventListener('click', deleteCompletedTasks);
     closeEditor.addEventListener('click', closeTaskEditor);
     cancelEdit.addEventListener('click', closeTaskEditor);
     saveEdit.addEventListener('click', saveTaskEdit);
     themeToggle.addEventListener('click', toggleTheme);
     
     sortButtons.forEach(btn => {
         btn.addEventListener('click', () => sortTasks(btn.dataset.sort));
     });

     priorityOptions.forEach(option => {
         option.addEventListener('click', () => {
             priorityOptions.forEach(opt => opt.classList.remove('selected'));
             option.classList.add('selected');
         });
     });
 }

 // Ajouter une tâche
 function addTask(e) {
     e.preventDefault();
     
     if (taskInput.value.trim() === '') return;
     
     const newTask = {
         id: Date.now(),
         content: taskInput.value.trim(),
         completed: false,
         priority: prioritySelect.value,
         date: new Date().toISOString()
     };
     
     tasks.push(newTask);
     saveTasks();
     renderTasks();
     taskInput.value = '';
     prioritySelect.value = 'medium';
 }

 // Supprimer une tâche
 function deleteTask(id) {
     tasks = tasks.filter(task => task.id !== id);
     saveTasks();
     renderTasks();
 }

 // Basculer l'état complété d'une tâche
 function toggleTaskComplete(id) {
     tasks = tasks.map(task => 
         task.id === id ? { ...task, completed: !task.completed } : task
     );
     saveTasks();
     renderTasks();
 }

 // Ouvrir l'éditeur de tâche
 function openTaskEditor(id) {
     const task = tasks.find(task => task.id === id);
     if (!task) return;
     
     currentEditId = id;
     editorInput.value = task.content;
     
     // Sélectionner la bonne priorité
     priorityOptions.forEach(option => {
         option.classList.remove('selected');
         if (option.dataset.priority === task.priority) {
             option.classList.add('selected');
         }
     });
     
     taskEditor.classList.add('active');
     editorInput.focus();
 }

 // Fermer l'éditeur de tâche
 function closeTaskEditor() {
     taskEditor.classList.remove('active');
     currentEditId = null;
 }

 // Sauvegarder les modifications d'une tâche
 function saveTaskEdit() {
     if (editorInput.value.trim() === '' || !currentEditId) return;
     
     const selectedPriority = document.querySelector('.priority-option.selected').dataset.priority;
     
     tasks = tasks.map(task => 
         task.id === currentEditId 
             ? { 
                 ...task, 
                 content: editorInput.value.trim(),
                 priority: selectedPriority
             } 
             : task
     );
     
     saveTasks();
     renderTasks();
     closeTaskEditor();
 }

 // Supprimer les tâches complétées
 function deleteCompletedTasks() {
     tasks = tasks.filter(task => !task.completed);
     saveTasks();
     renderTasks();
 }

 // Trier les tâches
 function sortTasks(sortBy) {
     currentSort = sortBy;
     
     sortButtons.forEach(btn => {
         btn.classList.toggle('active', btn.dataset.sort === sortBy);
     });
     
     renderTasks();
 }

 // Basculer entre les thèmes sombre/clair
 function toggleTheme() {
     document.body.classList.toggle('light-mode');
     const isLight = document.body.classList.contains('light-mode');
     themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
     localStorage.setItem('theme', isLight ? 'light' : 'dark');
 }

 // Sauvegarder les tâches dans localStorage
 function saveTasks() {
     localStorage.setItem('tasks', JSON.stringify(tasks));
     updateTasksCount();
 }

 // Mettre à jour le compteur de tâches
 function updateTasksCount() {
     const totalTasks = tasks.length;
     const completedTasks = tasks.filter(task => task.completed).length;
     
     document.querySelector('.completed-count').textContent = completedTasks;
     document.querySelector('.tasks-count span:last-child').textContent = totalTasks;
 }

 // Afficher les tâches
 function renderTasks() {
     if (tasks.length === 0) {
         todoList.innerHTML = '<div class="empty-state">Aucune tâche à afficher</div>';
         return;
     }
     
     // Trier les tâches
     let sortedTasks = [...tasks];
     
     switch (currentSort) {
         case 'date':
             sortedTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
             break;
         case 'priority':
             const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
             sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
             break;
         case 'completed':
             sortedTasks.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
             break;
     }
     
     todoList.innerHTML = sortedTasks.map(task => `
         <div class="task ${task.completed ? 'completed' : ''} priority-${task.priority}" data-id="${task.id}">
             <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
             <div class="task-content">${task.content}</div>
             <span class="task-date">${formatDate(task.date)}</span>
             <div class="task-actions">
                 <button class="task-btn edit-btn"><i class="fas fa-pencil-alt"></i></button>
                 <button class="task-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
             </div>
         </div>
     `).join('');
     
     // Ajouter les écouteurs d'événements aux éléments dynamiques
     document.querySelectorAll('.task-checkbox').forEach(checkbox => {
         checkbox.addEventListener('change', function() {
             toggleTaskComplete(parseInt(this.closest('.task').dataset.id));
         });
     });
     
     document.querySelectorAll('.edit-btn').forEach(btn => {
         btn.addEventListener('click', function() {
             openTaskEditor(parseInt(this.closest('.task').dataset.id));
         });
     });
     
     document.querySelectorAll('.delete-btn').forEach(btn => {
         btn.addEventListener('click', function() {
             deleteTask(parseInt(this.closest('.task').dataset.id));
         });
     });
 }

 // Formater la date
 function formatDate(dateString) {
     const date = new Date(dateString);
     const now = new Date();
     
     if (date.toDateString() === now.toDateString()) {
         return 'Aujourd\'hui';
     }
     
     const yesterday = new Date(now);
     yesterday.setDate(yesterday.getDate() - 1);
     
     if (date.toDateString() === yesterday.toDateString()) {
         return 'Hier';
     }
     
     const tomorrow = new Date(now);
     tomorrow.setDate(tomorrow.getDate() + 1);
     
     if (date.toDateString() === tomorrow.toDateString()) {
         return 'Demain';
     }
     
     return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
 }

 // Vérifier le thème au chargement
 function checkTheme() {
     const savedTheme = localStorage.getItem('theme') || 'dark';
     if (savedTheme === 'light') {
         document.body.classList.add('light-mode');
         themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
     }
 }

 // Initialiser l'application
 checkTheme();
 init();
