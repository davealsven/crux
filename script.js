document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskNameInput');
    const projectNameInput = document.getElementById('projectNameInput');
    const projectsContainer = document.getElementById('projectsContainer');

    let currentDraggedItem = null;

    addTaskBtn.addEventListener('click', function() {
        const taskName = taskNameInput.value.trim();
        const projectName = projectNameInput.value.trim().toLowerCase();
        if (taskName && projectName) {
            addTask(taskName, projectName);
            taskNameInput.value = '';
            projectNameInput.value = '';
        } else {
            alert('Please enter both a task name and a project name.');
        }
    });

    function addTask(taskName, projectName) {
        let projectContainer = document.querySelector(`.project-container[data-project-name="${projectName}"]`);
        if (!projectContainer) {
            projectContainer = createProjectContainer(projectName);
        }

        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.textContent = taskName;
        taskBox.draggable = true;

        taskBox.addEventListener('dragstart', function(e) {
            currentDraggedItem = { type: 'task', element: this };
            e.dataTransfer.setData('text/plain', taskName);
            // Stop the project drag event from firing
            e.stopPropagation();
        });

        projectContainer.querySelector('.tasks-container').appendChild(taskBox);
    }

    function createProjectContainer(projectName) {
        const projectContainer = document.createElement('div');
        projectContainer.className = 'project-container';
        projectContainer.setAttribute('data-project-name', projectName);
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks-container';
        projectContainer.appendChild(tasksContainer);

        const title = document.createElement('h2');
        title.className = 'project-title';
        title.textContent = projectName;
        projectContainer.insertBefore(title, tasksContainer);

        projectContainer.draggable = true;
        projectContainer.addEventListener('dragstart', function(e) {
            currentDraggedItem = { type: 'project', element: this };
            e.dataTransfer.setData('text/plain', projectName);
        });

        projectsContainer.appendChild(projectContainer);

        return projectContainer;
    }

    projectsContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        const target = e.target.closest('.project-container .tasks-container');
        if (target && currentDraggedItem.type === 'task') {
            target.style.background = '#f0f0f0'; // Optional: visual feedback
        }
    });

    projectsContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        const target = e.target.closest('.project-container .tasks-container');
        if (target && currentDraggedItem && currentDraggedItem.type === 'task') {
            target.appendChild(currentDraggedItem.element);
            target.style.background = ''; // Reset visual feedback
        } else if (currentDraggedItem.type === 'project') {
            const afterElement = getDragAfterElement(projectsContainer, e.clientY);
            if (afterElement) {
                projectsContainer.insertBefore(currentDraggedItem.element, afterElement);
            } else {
                projectsContainer.appendChild(currentDraggedItem.element);
            }
        }
        currentDraggedItem = null; // Clear the dragged item
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.project-container:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});