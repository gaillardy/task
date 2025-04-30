// Configuration de base
const API_BASE_URL =  'http://localhost:8000/api/tasks';
let tasks = [];
let currentSort = 'date';// Tri par défaut
let darkMode = false;// État du thème
// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');
const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
const taskEditor = document.getElementById('taskEditor');
const editorInput = document.getElementById('editorInput');
const closeEditor = document.getElementById('closeEditor');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
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
        // Ajout du paramètre de tri dans l'URL
        const url = new URL(API_BASE_URL);
        url.searchParams.append('sort', currentSort);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Gestion des différents formats de réponse
        if (Array.isArray(responseData.data)) {
            tasks = responseData.data; // Format avec wrapper data
        } else if (Array.isArray(responseData)) {
            tasks = responseData; // Format tableau direct
        } else if (responseData && Array.isArray(responseData.items)) {
            tasks = responseData.items; // Autre format possible
        } else {
            console.error('Format de réponse inattendu:', responseData);
            tasks = []; // Fallback safe
        }
        
        renderTasks();
    } catch (error) {
        console.error('Erreur de chargement:', error);
        showError("Impossible de charger les tâches");
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

    //  initialisation du triage
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => sortTasks(btn.dataset.sort));
    });
}

// Ajouter une tâche via API
async function addTask(e) {
    e.preventDefault();
    
    if (taskInput.value.trim() === '') return;
    
    const newTask = {
        title: taskInput.value.trim(),
        completed: false,
    };
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        const responseData = await response.json();
        
        if (!response.ok) throw new Error(responseData.message || 'Erreur lors de la création');

        // Ajoute la nouvelle tâche 
        tasks.unshift({
            ...responseData,
        });
        
        renderTasks();
        taskInput.value = '';
        
    } catch (error) {
        console.error('Erreur:', error);
        showError(error.message || "Erreur lors de l'ajout");
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
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) throw new Error('Échec de la suppression');

        // Mise à jour locale
        tasks = tasks.filter(task => task.id != id);
        renderTasks();
        hideDeleteModal();

    } catch (error) {
        console.error("Erreur:", error);
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
let currentEditId = null;

function openTaskEditor(id) {
    const task = tasks.find(t => t.id == id);
    if (!task) return;
    
    currentEditId = id;
    editorInput.value = task.title;
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
    if (!currentEditId || editorInput.value.trim() === '') return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: editorInput.value.trim()
            })
        });

        if (!response.ok) throw new Error('Échec de la mise à jour');
        
        const updatedTask = await response.json();
        
        // Mise à jour locale
        const taskIndex = tasks.findIndex(t => t.id == currentEditId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            renderTasks();
        }
        
        closeTaskEditor();
    } catch (error) {
        console.error("Erreur:", error);
    }
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
function attachTaskEvents() {
    // Événements pour les cases à cocher
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', async function() {
            const taskElement = this.closest('.task');
            const taskId = taskElement.dataset.id;
            const isChecked = this.checked;

            // Mise à jour visuelle immédiate
            if (isChecked) {
                taskElement.classList.add('completed');
            } else {
                taskElement.classList.remove('completed');
            }

            // Mise à jour dans la base de données
            try {
                const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        completed: isChecked
                    })
                });

                if (!response.ok) throw new Error('Échec de la mise à jour');

                // Mise à jour locale
                const task = tasks.find(t => t.id == taskId);
                if (task) {
                    task.completed = isChecked;
                    updateTasksCount();
                }
            } catch (error) {
                console.error("Erreur:", error);
                // Annuler le changement visuel en cas d'erreur
                this.checked = !isChecked;
                if (isChecked) {
                    taskElement.classList.remove('completed');
                } else {
                    taskElement.classList.add('completed');
                }
            }
        });
    });

    
    // Événements pour les boutons d'édition
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.closest('.task').dataset.id;
            openTaskEditor(taskId);
        });
    });
    // Événements pour les boutons de suppression
    document.querySelectorAll('#delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.closest('.task').dataset.id;
            confirmDelete(taskId);
        });
    });
}



// Afficher les tâches
function renderTasks() {
    if (!tasks || !Array.isArray(tasks)) {
        console.error('Tasks invalide:', tasks);
        tasks = [];
    }

    if (tasks.length === 0) {
        todoList.innerHTML = '<div class="empty-state">Aucune tâche à afficher</div>';
        updateTasksCount();
        return;
    }

    todoList.innerHTML = tasks.map(task => {
        // Assure que tous les champs requis existent
        const safeTask = {
            id: task.id || Date.now(),
            title: task.title || 'Tâche sans titre',
            completed: task.completed || false,
            created_at: task.created_at || new Date().toISOString()
        };

        return `
            <div class="task ${safeTask.completed ? 'completed' : ''} " data-id="${safeTask.id}">
                <input type="checkbox" class="task-checkbox" ${safeTask.completed ? 'checked' : ''}>
                <div class="task-content">${safeTask.title}</div>
                <span class="task-date">${formatDate(safeTask.created_at)}</span>
                <div class="task-actions">
                    <button class="task-btn edit-btn"><i class="fas fa-pencil-alt"></i></button>
                    <button class="task-btn delete-btn" id="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    }).join('');

    updateTasksCount();
    attachTaskEvents();
}
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Nouveau';
    }
}

// Mettre à jour le compteur de tâches
function updateTasksCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    document.querySelector('.completed-count').textContent = completedTasks;
    document.querySelector('.tasks-count span:last-child').textContent = totalTasks;
}

// Fonction de tri
function sortTasks(sortBy) {
    currentSort = sortBy;
    
    // Mise à jour visuelle des boutons actifs
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortBy);
    });
    
    // Tri local si les données sont déjà chargées
    if (tasks.length > 0) {
        sortTasksLocally();
        renderTasks();
    } 
    loadTasks(); // Recharge depuis l'API si nécessaire
}

// Tri local des tâches
function sortTasksLocally() {
    switch (currentSort) {
        case 'date':
            tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
            
        case 'completed':
            tasks.sort((a, b) => {
                if (a.completed === b.completed) {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
                return a.completed ? 1 : -1;
            });
            break;
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    checkTheme();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// Vérifier le thème sauvegardé
function checkTheme() {
    darkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme();
}

// Basculer le thème
function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyTheme();
}

// Appliquer le thème
function applyTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (darkMode) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}
console.log('Dark mode:', localStorage.getItem('darkMode'));
// Doit retourner 'true' ou 'false' après le premier clic