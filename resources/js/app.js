// Configuration de base
const API_BASE_URL = '/api/tasks';
let tasks = [];
let currentPriority = localStorage.getItem('taskPriority') || 'medium';

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
const sortButtons = document.querySelectorAll('.sort-btn');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    checkTheme();
});

// Chargement des tâches avec preloader
async function loadTasks() {
    showLoader();
    
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Gestion des différents formats de réponse
        if (data && Array.isArray(data.data)) {
            tasks = data.data; // Format Laravel Resource
        } else if (Array.isArray(data)) {
            tasks = data; // Format tableau direct
        } else if (data && Array.isArray(data.items)) {
            tasks = data.items; // Autre format possible
        } else {
            throw new Error('Format de réponse inattendu');
        }
        
        renderTasks();
    } catch (error) {
        console.error('Erreur détaillée:', error);
        showError(error.message.includes('Unexpected token') 
            ? 'Réponse API invalide' 
            : error.message);
    } finally {
        hideLoader();
    }
}

// Afficher le preloader
function showLoader() {
    todoList.innerHTML = `
        <div class="loader-container">
            <div class="loader-spinner"></div>
            <div class="loader-text">Chargement des tâches...</div>
        </div>
    `;
}

// Cacher le preloader
function hideLoader() {
    const loader = document.querySelector('.loader-container');
    if (loader) loader.remove();
}

// Afficher une erreur
function showError(message) {
    todoList.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="retry-btn" id="retryBtn">Réessayer</button>
        </div>
    `;
    
    document.getElementById('retryBtn').addEventListener('click', loadTasks);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    taskForm.addEventListener('submit', addTask);
    deleteCompletedBtn.addEventListener('click', deleteCompletedTasks);
    closeEditor.addEventListener('click', closeTaskEditor);
    cancelEdit.addEventListener('click', closeTaskEditor);
    saveEdit.addEventListener('click', saveTaskEdit);
    
    priorityOptions.forEach(option => {
        option.addEventListener('click', () => {
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentPriority = option.dataset.priority;
            localStorage.setItem('taskPriority', currentPriority);
        });
    });

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => sortTasks(btn.dataset.sort));
    });
}

// Ajouter une tâche via API
async function addTask(e) {
    e.preventDefault();
    
    if (taskInput.value.trim() === '') return;
    
    const newTask = {
        title: taskInput.value.trim(),
        description: '', // Champ requis dans le modèle
        completed: false,
        priority: currentPriority
    };
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(newTask)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Détails erreur:', errorData);
            throw new Error(errorData.message || 'Erreur lors de la création');
        }
        
        const createdTask = await response.json();
        
        // Adaptation pour Laravel Resources
        if (createdTask.data) {
            tasks.unshift(createdTask.data); // Si la réponse contient un wrapper "data"
        } else {
            tasks.unshift(createdTask);
        }
        
        renderTasks();
        taskInput.value = '';
    } catch (error) {
        console.error('Erreur détaillée:', error);
        showError(error.message || "Erreur lors de l'ajout de la tâche");
    }
}

// Mettre à jour une tâche via API
async function updateTask(id, updatedData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) throw new Error('Erreur lors de la mise à jour');
        
        const updatedTask = await response.json();
        const taskIndex = tasks.findIndex(task => task.id === id);
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            renderTasks();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError("Erreur lors de la mise à jour de la tâche");
    }
}

// Supprimer une tâche via API
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error('Erreur:', error);
        showError("Erreur lors de la suppression de la tâche");
    }
}

// Confirmation de suppression
function confirmDelete(id) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
            <div class="modal-actions">
                <button class="modal-btn cancel-btn">Annuler</button>
                <button class="modal-btn confirm-btn">Supprimer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        deleteTask(id);
        modal.remove();
    });
}

// Basculer l'état complété d'une tâche
function toggleTaskComplete(id, isChecked) {
    const updatedData = { completed: isChecked };
    updateTask(id, updatedData);
}

// Ouvrir l'éditeur de tâche
function openTaskEditor(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    currentEditId = id;
    editorInput.value = task.title;
    
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
async function saveTaskEdit() {
    if (editorInput.value.trim() === '' || !currentEditId) return;
    
    const selectedPriority = document.querySelector('.priority-option.selected').dataset.priority;
    const updatedData = {
        title: editorInput.value.trim(),
        priority: selectedPriority
    };
    
    await updateTask(currentEditId, updatedData);
    closeTaskEditor();
}

// Supprimer les tâches complétées
async function deleteCompletedTasks() {
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer ${completedTasks.length} tâche(s) complétée(s) ?</p>
            <div class="modal-actions">
                <button class="modal-btn cancel-btn">Annuler</button>
                <button class="modal-btn confirm-btn">Supprimer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.confirm-btn').addEventListener('click', async () => {
        try {
            const deletePromises = completedTasks.map(task => 
                fetch(`${API_BASE_URL}/${task.id}`, { method: 'DELETE' })
            );
            
            await Promise.all(deletePromises);
            tasks = tasks.filter(task => !task.completed);
            renderTasks();
        } catch (error) {
            console.error('Erreur:', error);
            showError("Erreur lors de la suppression des tâches");
        } finally {
            modal.remove();
        }
    });
}

// Afficher les tâches
function renderTasks() {
    if (tasks.length === 0) {
        todoList.innerHTML = '<div class="empty-state">Aucune tâche à afficher</div>';
        updateTasksCount();
        return;
    }
    
    todoList.innerHTML = tasks.map(task => `
        <div class="task ${task.completed ? 'completed' : ''} priority-${task.priority}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">${task.title}</div>
            <span class="task-date">${formatDate(task.created_at)}</span>
            <div class="task-actions">
                <button class="task-btn edit-btn"><i class="fas fa-pencil-alt"></i></button>
                <button class="task-btn delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
    
    updateTasksCount();
    
    // Ajouter les écouteurs d'événements aux éléments dynamiques
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = parseInt(this.closest('.task').dataset.id);
            toggleTaskComplete(taskId, this.checked);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.closest('.task').dataset.id);
            openTaskEditor(taskId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = parseInt(this.closest('.task').dataset.id);
            confirmDelete(taskId);
        });
    });
}

// Mettre à jour le compteur de tâches
function updateTasksCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    document.querySelector('.completed-count').textContent = completedTasks;
    document.querySelector('.tasks-count span:last-child').textContent = totalTasks;
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '';
    
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

// Trier les tâches
function sortTasks(sortBy) {
    currentSort = sortBy;
    
    sortButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortBy);
    });
    
    switch (sortBy) {
        case 'date':
            tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'priority':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
        case 'completed':
            tasks.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
            break;
    }
    
    renderTasks();
}

// Vérifier le thème au chargement
function checkTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}