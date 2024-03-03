document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskNameInput');
    const projectNameInput = document.getElementById('projectNameInput');
    const projectsContainer = document.getElementById('projectsContainer');

    const projectNamesMap = new Map(); // Maps lowercase project name to display name

    addTaskBtn.addEventListener('click', function() {
        const taskName = taskNameInput.value.trim();
        let projectName = projectNameInput.value.trim();
        const projectNameLower = projectName.toLowerCase();

        if (!projectNamesMap.has(projectNameLower)) {
            projectNamesMap.set(projectNameLower, projectName);
        } else {
            projectName = projectNamesMap.get(projectNameLower);
        }

        if (taskName && projectName) {
            addTask(taskName, projectName);
            taskNameInput.value = '';
            projectNameInput.value = '';
        } else {
            alert('Please enter both a task name and a project name.');
        }
    });

    function addTask(taskName, projectName) {
        let projectContainer = document.querySelector(`[data-project-name="${projectName.toLowerCase()}"]`);
        if (!projectContainer) {
            projectContainer = document.createElement('div');
            projectContainer.className = 'project-container';
            projectContainer.setAttribute('data-project-name', projectName.toLowerCase());

            const title = document.createElement('h2');
            title.className = 'project-title';
            title.textContent = projectName;
            projectContainer.appendChild(title);

            projectsContainer.appendChild(projectContainer);
        }

        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.setAttribute('draggable', true);
        taskBox.textContent = taskName;

        // Event listeners for drag and drop
        taskBox.addEventListener('dragstart', handleDragStart);
        taskBox.addEventListener('dragend', handleDragEnd);
        
        projectContainer.appendChild(taskBox);
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        this.classList.add('dragging');
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
    }

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        const dragging = document.querySelector('.dragging');
        if (e.target.className === 'task-box' && dragging) {
            const targetProjectContainer = e.target.closest('.project-container');
            if (targetProjectContainer) {
                targetProjectContainer.appendChild(dragging);
            }
        }
    });
});
