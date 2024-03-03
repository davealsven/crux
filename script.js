document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskNameInput = document.getElementById('taskNameInput');
    const projectNameInput = document.getElementById('projectNameInput');
    const projectsContainer = document.getElementById('projectsContainer');

    let draggedProject = null;

    addTaskBtn.addEventListener('click', function() {
        const taskName = taskNameInput.value.trim();
        const projectName = projectNameInput.value.trim();
        if (taskName && projectName) {
            addTask(taskName, projectName);
            taskNameInput.value = '';
            projectNameInput.value = '';
        } else {
            alert('Please enter both a task name and a project name.');
        }
    });

    function addTask(taskName, projectName) {
        let projectContainer = document.querySelector(`.project-container[data-project-name="${projectName.toLowerCase()}"]`);
        if (!projectContainer) {
            projectContainer = createProjectContainer(projectName);
        }

        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.textContent = taskName;
        projectContainer.appendChild(taskBox);
    }

    function createProjectContainer(projectName) {
        const projectContainer = document.createElement('div');
        projectContainer.className = 'project-container';
        projectContainer.setAttribute('data-project-name', projectName.toLowerCase());
        projectContainer.setAttribute('draggable', true);

        const title = document.createElement('h2');
        title.className = 'project-title';
        title.textContent = projectName;
        projectContainer.appendChild(title);

        projectsContainer.appendChild(projectContainer);

        // Drag and drop listeners for the project container
        projectContainer.addEventListener('dragstart', function(e) {
            draggedProject = this;
        });

        projectContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        projectContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedProject) {
                projectsContainer.insertBefore(draggedProject, this);
                draggedProject = null;
            }
        });

        return projectContainer;
    }

    // Optional: Handle drop outside any project container
    projectsContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    projectsContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedProject) {
            this.appendChild(draggedProject);
            draggedProject = null;
        }
    });
});
