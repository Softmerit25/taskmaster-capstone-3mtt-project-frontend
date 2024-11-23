// GLOBAL STATE FOR AUTHENTICATED USER AND TASK DATA PAYLOAD
let user = null;
let taskData = [];
let baseUrl = 'http://localhost:5200';






// FUNCTION TO FETCH ALL TASKS
async function getTask(){
try {
 const res = await fetch(`${baseUrl}/api/v1/task/get-user-task/`,{
     method:'GET',
     headers: {
         'Content-Type': 'application/json', 
     },
     credentials: 'include',
 })

   const payload = await res.json();
   if(!res.ok || payload.error){
   throw new Error(payload?.error);
   }


    if(payload?.data){

     // Filter tasks based on the current page
    const currentPageUrl = window.location.pathname;

    taskData = payload.data?.tasks;

    let filteredTasksByPages = taskData;

    if (currentPageUrl.includes("/todo.html")) {
        filteredTasksByPages = taskData.filter(task => task.status === "todo");
      } else if (currentPageUrl.includes("/completed.html")) {
        filteredTasksByPages = taskData.filter(task => task.status === "completed");
      } else if (currentPageUrl.includes("/progress.html")) {
        filteredTasksByPages = taskData.filter(task => task.status === "progress");
      } else if (currentPageUrl.includes("/all-task.html")) {
        filteredTasksByPages = taskData;
      }



    displayTaskCount( payload.data.count);

    displayTask(filteredTasksByPages);
     // Initial call to populate dropdown
    populateFilterOptions(filteredTasksByPages);

    }

} catch (error) {
console.log('Error during getting user tasks' + error);
Toastify({
 text: `${error.message}`,
 duration: 3000, 
 close: true, 
 gravity: "top", 
 position: "right", 
 styles:{
     background: "red", 
 },
 className: "toastify"
}).showToast();
}


 }



 getTask();



// FUNCTION TO DISPLAY TASK COUNT
function displayTaskCount(data){

    const taskAnalysisElement = document.getElementById('task-analysis');

   taskAnalysisElement.innerHTML = '';
 
    const analysisBox = `
                     <div class="analysis-box">
                            <h1>Total Task</h1>

                            <div class="task-count">
                                <span>${data.allTodos}</span>
                                <div class="task-count-icon">
                                    <i class="fa-solid fa-chart-bar"></i>
                                </div>
                            </div>
                        </div>

                        <div class="analysis-box">
                            <h1>Completed Task</h1>

                            <div class="task-count">
                                <span>${data.completed}</span>
                                <div class="task-count-icon complete">
                                    <i class="fa-solid fa-bars-progress"></i>
                                </div>
                            </div>
                        </div>


                        <div class="analysis-box">
                            <h1>Task in Progress</h1>

                            <div class="task-count">
                                <span>${data.progress}</span>
                                <div class="task-count-icon progress">

                                    <i class="fa-solid fa-circle-notch"></i>
                                </div>
                            </div>
                        </div>


                        <div class="analysis-box">
                            <h1>Todo Task</h1>

                            <div class="task-count">
                                <span>${data.todo}</span>
                                <div class="task-count-icon todo">
                                    <i class="fa-solid fa-compass"></i>
                                </div>
                            </div>
                        </div>
                         `
     taskAnalysisElement.innerHTML += analysisBox;
}








// FUNCTION TO DISPLAY TASK
const taskListContainer = document.querySelector('.tasks-wrapper');

function displayTask(task){

   taskListContainer.innerHTML = '';

   if (task.length === 0) {
    taskListContainer.innerHTML = `<div style="display:flex; align-items:center; justify-content: center; font-size: 1.5rem;">You don't have any task yet! Create a task.</div>` ;
    return;
  }


     task.forEach(tasks=> {
       const gridItem = document.createElement('div');
       gridItem.classList.add('tasks-box');

       gridItem.innerHTML = `
                          
                                <h1>${tasks.title}</h1>
                                <p>
                                ${tasks.description}
                                </p>
                                <hr />
                                <div class="tasks-content">
                                    <div class="tasks-option">
                                        <p>Due Date: <b>${new Date(tasks?.deadline).toLocaleDateString()}</b></p>
                                        <p>Priorty: <b>${tasks.priority}</b></p>
                                    </div>

                                    <div class="tasks-option">
                                        <p>Status: <b>${tasks.status}</b></p>
                                    </div>
                                </div>
                                <hr />

                                <!-- task box buttons -->
                                <div class="tasks-btn">
                                    <i class="fa-solid fa-pen" id="editTask"></i>
                                    <i class="fa-solid fa-trash" id="deleteTask"></i>
                                </div>
                           
    `;


    const editButton = gridItem.querySelector('#editTask');
    const deleteButton = gridItem.querySelector('#deleteTask');

    editButton.addEventListener('click', () => editTask(tasks));
    deleteButton.addEventListener('click', () => deleteTask(tasks._id));


    taskListContainer.appendChild(gridItem);

   });

}



// FUNCTION TO DELETE A TASK
async function deleteTask(taskId){
    try {

        const res = await fetch(`${baseUrl}/api/v1/task/delete-user-task/${taskId}`,{
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include',
        })
       
          const payload = await res.json();

          if(!res.ok || payload.error){
          throw new Error(payload?.error);
          }

        if(payload?.data){
            Toastify({
                text: "Task Deleted Successful",
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                backgroundColor: "#4CAF50", 
                className: "toastify"
              }).showToast(); 
             
              getTask();

            }
            
       
        
    } catch (error) {
        console.error('Failed to delete task:', error);
        Toastify({
            text: `${error.message}`,
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
           }).showToast();
    }
}




// FUNCTION TO DELETE A TASK
function editTask(task){
     modal.style.display = 'flex';
    modal.innerHTML  = `
              <div class="modal-content">
                <h1 class="task-title">Update Task</h1>

                <div class="modal-form">
                    <div class="formgroup">
                        <label for="title">Title</label>
                        <input type="text" 
                        placeholder="Type in Title"
                        id="edit-title"
                       value="${task.title}"
                       required
                        />
                    </div>

                    <div class="formgroup">
                        <label for="title">Description</label>
                       <textarea id="edit-description" rows="4" required>${task.description}</textarea>
                    </div>

                    <div class="formgroup">
                    <label for="edit-deadline">Deadline</label>
                    <input type="date" id="edit-deadline" value="${task?.deadline?.slice(0, 10)}" required />
                    </div>
                    
                    <div class="formgroup">
                    <label for="edit-priority">Priority</label>
                    <select id="edit-priority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                    </div>

                    <!-- ADDED FEATURE STATUS -->
                    <div class="formgroup">
                        <label for="edit-status">Status</label>
                        <select id="edit-status">
                            <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Todo</option>
                            <option value="progress" ${task.status === 'progress' ? 'selected' : ''}>Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>


                    <!-- modal buttons -->
                     <div class="modal-btn">
                        <button class="btn cancel" id="closeModal">Cancel</button>
                        <button class="btn confirm" id="updateTask">Update Task</button>
                     </div>

                </div>
            </div>
    `

     // Close Modal
  document.getElementById('closeModal').addEventListener('click', () => {
    modal.style.display = 'none';
  });



    // Save Changes
    document.getElementById('updateTask').addEventListener('click', async () => {
        

        // Update task properties

        const data = {
        title: document.getElementById('edit-title').value,
        description: document.getElementById('edit-description').value,
        deadline: document.getElementById('edit-deadline').value || new Date().toISOString().slice(0, 10),
        priority: document.getElementById('edit-priority').value,
        status: document.getElementById('edit-status').value

        }


        try {

            const res = await fetch(`${baseUrl}/api/v1/task/update-user-task/${task?._id}`,{
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })
           
              const payload = await res.json();

              if(!res.ok || payload.error){
              throw new Error(payload?.error);
              }

            if(payload?.data){

                Toastify({
                    text: "Task Updated Successful",
                    duration: 3000,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    backgroundColor: "#4CAF50", 
                    className: "toastify"
                  }).showToast(); 
                 
                  getTask();
                  modal.style.display = 'none';

                }
                
           
            
        } catch (error) {
            console.error('Failed to update task:', error);
            Toastify({
                text: `${error.message}`,
                duration: 3000, 
                close: true, 
                gravity: "top", 
                position: "right", 
                styles:{
                    background: "red", 
                },
                className: "toastify"
               }).showToast();
        }
      });


}



// FUNCTION TO HANDLE SEARCH
const searchInput =  document.getElementById('search-input');

searchInput && searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
  
    // Filter data based on search term
    const filteredData = taskData.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    );
  
    // Re-render grid with filtered data
    displayTask(filteredData);
  });




// FUNCTION TO HANDLE TASK FILTERING

const filterSelect = document.getElementById("filter-task");

// Populate select options dynamically
function populateFilterOptions(filterTaskData) {

    filterSelect.innerHTML = `<option value="">Filter task</option>`;

    const statuses = [...new Set(filterTaskData.map((task) => task.status))];
    const deadlines = [...new Set(filterTaskData.map((task) => new Date(task.deadline).toLocaleDateString()))];
  
    // Add status options
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = `Status: ${status}`;
      filterSelect.appendChild(option);
    });
  
    // Add deadline options
    deadlines.forEach((deadline) => {
      const option = document.createElement("option");
      option.value = deadline;
      option.textContent = `Deadline: ${deadline}`;
      filterSelect.appendChild(option);
    });
  }

  
 
  

// Get reference to the dropdown and task container
filterSelect.addEventListener("change", () => {

    const filterValue = filterSelect.value;
  
    // Filter tasks based on selected status or deadline
    const filteredTasks = taskData.filter(task => {
      const taskDeadline = new Date(task.deadline).toLocaleDateString();
      return task.status === filterValue || taskDeadline === filterValue;
    });
  
    // Render filtered tasks
   displayTask(filteredTasks);

  });





// END OF TASK FILTERING BY PRIORITY AND DEADLINE



// FUNCTION TO CREATE NEW TASK
async function createNewTask(event){
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

      // Validate inputs
  if (!title || !description || !deadline || !priority) {
    alert('Please fill in all fields!');
    return;
  }

const data  = {
    title,
    description,
    deadline,
    priority,
}


try {
 const res = await fetch(`${baseUrl}/api/v1/task/create-task/${user?._id}`,{
     method:'POST',
     headers: {
         'Content-Type': 'application/json', 
     },
     credentials: 'include',
     body: JSON.stringify(data)
 })

   const payload = await res.json();
   if(!res.ok || payload.error){
   throw new Error(payload?.error);
   }


if(payload?.data){
    getTask();

  Toastify({
   text: "Task Created Successful",
   duration: 3000,
   close: true,
   gravity: "top", 
   position: "right", 
   backgroundColor: "#4CAF50", 
   className: "toastify"
 }).showToast(); 



// reset taskInputForm
  if(title || description || deadline || priority){
    title.value = "",
    description.value = '',
    deadline.value = '',
    priority.value = ''
  }


  // Hide the modal after creating the task
  modal.style.display = 'none';

  // Optionally, clear the modal content
  modal.innerHTML = '';

}


} catch (error) {
console.log('Error during task creation' + error);
Toastify({
 text: `${error.message}`,
 duration: 3000, 
 close: true, 
 gravity: "top", 
 position: "right", 
 styles:{
     background: "red", 
 },
 className: "toastify"
}).showToast();
}


 }






// handle login and register ui switching
document.addEventListener('DOMContentLoaded', function(){
    const registerUI = document.querySelector('.register-wrapper');
    const loginUI = document.querySelector('.login-wrapper');

    const loginText = document.getElementById('login-text');
    const registerText = document.getElementById('register-text');

    // switch to register
    registerText && registerText.addEventListener('click', (event)=>{
        event.stopPropagation();
            registerUI.classList.add('active');
            loginUI.style.display = "none";
            loginUI.style.opacity = "0";
            loginUI.style.visibility = "hidden"; 
    });

    // switch to login
    loginText && loginText.addEventListener('click', (event)=>{
        event.stopPropagation();
        registerUI.classList.remove('active');
        loginUI.style.display = "block";
        loginUI.style.opacity = "1";
        loginUI.style.visibility = "visible"; 
});

})

// Registration form inputs 
let fullName = document.getElementById('fullname');
let email = document.getElementById('email');
let password = document.getElementById('password');



// validate User Registration Inputs
function validateRegisterInputs(){
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if(!fullName.value.trim()){
        Toastify({
            text: "Fullname is required",
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
          }).showToast(); 
        return false;
    }

    if(!email.value.trim()){
        Toastify({
            text: "Email is required",
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
          }).showToast(); 
        return false;
    }

    if(email.value.trim() && !email.value.includes('@') || emailRegex.test(email)){
        Toastify({
            text: "Enter a valid email address!",
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
          }).showToast(); 
        return false;
    }

    if(!password.value.trim()){
        Toastify({
            text: "Password is required",
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
          }).showToast(); 
        return false;
    }

    if(password.value.trim().lenth <= 4){
        Toastify({
            text: "Password characters must be of length 6 or greater!",
            duration: 3000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            styles:{
                background: "red", 
            },
            className: "toastify"
          }).showToast(); 
        return false;
    }

    return true;
}






// API CALL FOR USER REGISTRATION
async function handleUserRegistration(data){

const registerBtn = document.querySelector('#register');
const registerLoader = document.getElementById('registerloader');

    registerBtn.disabled = true;
    registerBtn.style.opacity = '0.5';
    registerLoader.style.display = 'inline-block'
        try {
                const res = await fetch(`${baseUrl}/api/v1/auth/register`,{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(data)
                })
            
        const payload = await res.json();

         if(!res.ok || payload.error){
            throw new Error(payload?.error);
         }

         
         if(payload?.data){
            user = payload?.data;
            Toastify({
                text: "Register Successful!",
                duration: 3000, 
                close: true, 
                gravity: "top", 
                position: "right", 
                styles:{
                    background: "green", 
                }, 
                className: "toastify"
              }).showToast(); 

            
    
        } 
         

        } catch (error) {
            console.log('Error during user registration' + error);
            Toastify({
                text: `${error.message}`,
                duration: 3000, 
                close: true, 
                gravity: "top", 
                position: "right", 
                styles:{
                    background: "red", 
                },
                className: "toastify"
              }).showToast();
        }finally{
            registerBtn.disabled = false;
            registerBtn.style.opacity = '1';
            registerLoader.style.display = 'none'
        }
}




// API CALL FOR USER LOGIN
async function handleUserLogin(data){
    const loginBtn = document.querySelector('#login');
    const loginLoader = document.getElementById('loginloader');


    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.5';
    loginLoader.style.display = 'inline-block'

    try {
        const res = await fetch(`${baseUrl}/api/v1/auth/login`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
    
const payload = await res.json();
 if(!res.ok || payload.error){
    throw new Error(payload?.error);
 }

 
 if(payload?.data){
     user = payload?.data;
     Toastify({
        text: "Login Successful",
        duration: 3000, 
        close: true, 
        gravity: "top", 
        position: "right", 
        styles:{
            background: "green", 
        },
        className: "toastify"
      }).showToast(); 

  window.location.href = "/";

 }


} catch (error) {
    console.log('Error during user login' + error);
    Toastify({
        text: `${error.message}`,
        duration: 3000, 
        close: true, 
        gravity: "top", 
        position: "right", 
        styles:{
            background: "red", 
        },
        className: "toastify"
      }).showToast();
}finally{
    loginBtn.disabled = false;
    loginBtn.style.opacity = '1';
    loginLoader.style.display = 'none'
}

}




// HANDLE USER REGISTRATION AND LOGIN FUNCTION
async function loginUser(){
    
    // login form inputs
    const lemail = document.getElementById('lemail');
    const lpassword = document.getElementById('lpassword');
    
        const loginData = {
                email:lemail.value,
                password:lpassword.value
        }
          
    await handleUserLogin(loginData);
    
    lemail.value = '',
    lpassword.value = ''
    
    }



//FUNCTION  HANDLE USER LOGOUT
async function handleUserLogOut(){
    try {
        const res = await fetch(`${baseUrl}/api/v1/auth/logout/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials:'include'
        })
    
const payload = await res.json();

 if(!res.ok || payload?.error){
    throw new Error(payload?.error);
 }
    Toastify({
       text: "Logout Successful",
       duration: 3000, 
       close: true, 
       gravity: "top", 
       position: "right", 
       styles:{
           background: "red", 
       },
       className: "toastify"
     }).showToast(); 

     window.location.href = '/login.html'

} catch (error) {
    console.log('Error during user logout' + error);
    Toastify({
        text: `${error.message}`,
        duration: 3000, 
        close: true, 
        gravity: "top", 
        position: "right", 
        styles:{
            background: "red", 
        },
        className: "toastify"
      }).showToast();
}
}








// register
async function registerUser(){
    const validate =  validateRegisterInputs();

        if(!validate) return;

     const registerData = {
        fullName: fullName.value,
        email: email.value,
        password: password.value
     }

    await handleUserRegistration(registerData);
    
    fullName.value = '',
    email.value = '',
    password.value = ''
}









// CHECK USER LOGIN STATUS
async function checkAuthStatus(){
    
    const displayUserName =  document.getElementById('user-name');
    const currentWindowPath = window.location.pathname;
    
    const siteLocationPath = ["/", "/all-task.html", "/todo.html", "/progress.html", "/completed.html"];
    try {

        const res = await fetch(`${baseUrl}/api/v1/auth/auth-status/`,{
            method:'GET',
            credentials: 'include'
        })
    
        const userAuth = await res.json();
         user = userAuth?.data;
        displayUserName.textContent = `${user.fullName.charAt(0).toUpperCase()}`
        const isAuthenticated = Boolean(user);

        // Redirect based on authentication status
        if (isAuthenticated && currentWindowPath === "/login.html") {
          // User is logged in but on the login page
          window.location.href = "/";
        } else if (!isAuthenticated && siteLocationPath.includes(currentWindowPath)) {
          // User is not logged in but trying to access a protected page
          window.location.href = "/login.html";
        }
        
        
} catch (error) {
    console.log(error.message);
    // Redirect to login if there's an error and user is on a protected page
    if (siteLocationPath.includes(currentWindowPath)) {
        window.location.href = "/login.html";
      }
}
}


