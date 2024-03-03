document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskNameInput');
    const projectNameInput = document.getElementById('projectNameInput');
    const projectsContainer = document.getElementById('projectsContainer');

    let currentDraggedElement = null;

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
        taskBox.setAttribute('data-task-name', taskName);

        taskBox.addEventListener('dragstart', function(e) {
            currentDraggedElement = this;
            e.dataTransfer.setData('text/plain', taskName);
        });

        projectContainer.appendChild(taskBox);
    }

    function createProjectContainer(projectName) {
        const projectContainer = document.createElement('div');
        projectContainer.className = 'project-container';
        projectContainer.setAttribute('data-project-name', projectName);
        projectContainer.draggable = true;

        const title = document.createElement('h2');
        title.className = 'project-title';
        title.textContent = projectName;
        projectContainer.appendChild(title);

        projectContainer.addEventListener('dragstart', function(e) {
            currentDraggedElement = this;
            e.dataTransfer.setData('text/plain', projectName);
            e.dataTransfer.effectAllowed = 'move';
        });

        projectsContainer.appendChild(projectContainer);

        return projectContainer;
    }

    projectsContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    projectsContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        if (currentDraggedElement.className === 'task-box') {
            // Task is being dragged
            const targetProject = e.target.closest('.project-container');
            if (targetProject) {
                targetProject.appendChild(currentDraggedElement);
            }
        } else if (currentDraggedElement.className === 'project-container') {
            // Project is being dragged
            let afterElement = null;
            Array.from(projectsContainer.children).forEach(child => {
                const rect = child.getBoundingClientRect();
                if (e.clientY > rect.top && e.clientY < rect.bottom) {
                    afterElement = child;
                }
            });
            if (afterElement) {
                projectsContainer.insertBefore(currentDraggedElement, afterElement);
            } else {
                projectsContainer.appendChild(currentDraggedElement);
            }
        }
        currentDraggedElement = null;
    });
});