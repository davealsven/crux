document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskNameInput');
    const projectNameInput = document.getElementById('projectNameInput');
    const projectsContainer = document.getElementById('projectsContainer');

    addTaskBtn.addEventListener('click', function() {
        const taskName = taskNameInput.value.trim();
        const projectName = projectNameInput.value.trim().replace(/\s+/g, '-');
        if (taskName && projectName) {
            addTask(taskName, projectName);
            taskNameInput.value = '';
            projectNameInput.value = '';
        }
    });

    function addTask(taskName, projectName) {
        let projectContainer = document.querySelector(`.project-container[data-project-name="${projectName}"]`);
        if (!projectContainer) {
            projectContainer = document.createElement('div');
            projectContainer.className = `project-container`;
            projectContainer.setAttribute('data-project-name', projectName);
            
            const title = document.createElement('h2');
            title.className = 'project-title';
            title.textContent = projectName.replace(/-/g, ' ');
            projectContainer.appendChild(title);

            projectsContainer.appendChild(projectContainer);
        }

        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.textContent = taskName;
        projectContainer.appendChild(taskBox);
    }
});
