document.addEventListener('DOMContentLoaded', function() {
    // Existing code to add projects and tasks...

    function enableProjectDragAndDrop() {
        const projectContainers = document.querySelectorAll('.project-container');
        projectContainers.forEach(project => {
            project.setAttribute('draggable', true);
            project.addEventListener('dragstart', handleProjectDragStart);
            project.addEventListener('dragover', handleProjectDragOver);
            project.addEventListener('drop', handleProjectDrop);
        });
    }

    function handleProjectDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-project-name'));
        this.classList.add('dragging');
    }

    function handleProjectDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
    }

    function handleProjectDrop(e) {
        e.preventDefault();
        const projectName = e.dataTransfer.getData('text/plain');
        const draggedProject = document.querySelector(`.project-container[data-project-name="${projectName}"]`);
        if (draggedProject && e.target.classList.contains('project-container')) {
            const afterElement = getDragAfterElement(projectsContainer, e.clientY);
            if (afterElement == null) {
                projectsContainer.appendChild(draggedProject);
            } else {
                projectsContainer.insertBefore(draggedProject, afterElement);
            }
        }
        enableProjectDragAndDrop(); // Re-enable drag and drop in case of DOM changes
    }

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

    // Call this function whenever a new project is added or the DOM is updated
    enableProjectDragAndDrop();
});
