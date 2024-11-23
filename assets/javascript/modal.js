

// Get elements
const openModalButton = document.getElementById('openModal');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');









// Open modal on button click
openModalButton.addEventListener('click', () => {
  modal.style.display = 'flex'; // Show modal

  modal.innerHTML = ''

  const createModalContent = `
     <div class="modal-content" id="modal-content">
                <h1 class="task-title">Add Task</h1>

                <div class="modal-form">
                    <div class="formgroup">
                        <label for="title">Title</label>
                        <input type="text" placeholder="Type in Title" id="title" required />
                    </div>

                    <div class="formgroup">
                        <label for="title">Description</label>
                        <textarea rows="4" cols="50" type="text" placeholder="Type in Description" id="description"
                            required></textarea>
                    </div>

                    <div class="formgroup">
                        <label for="title">Deadline</label>
                        <input type="date" min="1900-01-01" max="2025-12-31" id="deadline" required />
                    </div>

                    <div class="formgroup">
                        <label for="title">Priority</label>
                        <select id="priority">
                            <option value="">Select Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>


                    <!-- modal buttons -->
                    <div class="modal-btn">
                        <button class="btn cancel" id="closeModal" onclick="closeModalButton()">Cancel</button>
                        <button class="btn confirm" id="createTask" onclick="createNewTask()">Create Task</button>
                    </div>

                </div>
            </div>
  `

  modal.innerHTML = createModalContent;

  // Add event listener for creating task
  const createTaskButton = document.getElementById('createTask');
  createTaskButton.addEventListener('click', createNewTask);




// Close modal on clicking outside the modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    if(title || description || deadline || priority || statusInput){
      title.value = "";
      description.value = "";
      deadline.value = "";
      priority.value = "";
    }
  }
});


});


function closeModalButton() {
modal.style.display = 'none'; 
if(title || description || deadline || priority || statusInput){
  title.value = "";
  description.value = "";
  deadline.value = "";
  priority.value = "";
}
};













