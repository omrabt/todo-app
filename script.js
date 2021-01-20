//Storage Controller
const StorageController = (function () {
    return {
        
        storeProduct: function (task) {
            let tasks;
            if (localStorage.getItem('tasks') === null) {
                tasks = [];
                tasks.push(task);
            } else {
                tasks = JSON.parse(localStorage.getItem('tasks'));
                tasks.push(task);
            }

            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
        getTasks: function () {
            
            let tasks;
            if(localStorage.getItem('tasks')==null){
                tasks = [];
            }else{
                tasks = JSON.parse(localStorage.getItem('tasks'));
            }
            return tasks;
        },
        deleteTask: function (deleteTask) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach(function (tsk, index) {
                if (deleteTask.title == tsk.title) {
                    tasks.splice(index, 1);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));

        },
        updateTask: function (slctdTask) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach(function (tsk, index) {
                if (slctdTask.title == tsk.title) {
                    tasks.splice(index, 1, slctdTask);
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
}());
//Task Controller
const TaskController = (function () {
    const Task = function (title, status) {
        this.title = title;
        this.status = false;
    }
    const data = {

        tasks: StorageController.getTasks(),
        selectedTask: null,
    }

    return {
        addTask: function (title, status) {
            const newTask = new Task(title, status);
            console.log("task ctrl")
            console.log(data.tasks)
            data.tasks.push(newTask);
            return newTask;
        },
        getTasks: function () {
            return data.tasks;
        },
        getTaskByTitle: function (title) {
            let task = null;
            data.tasks.forEach(function (tsk) {
                if (tsk.title == title) {
                    task = tsk;
                }
            })
            return task;
        },
        setCurrentTask: function (slctdTask) {
            data.selectedTask = slctdTask;
        },
        getCurrentTask: function () {
            return selectedTask;
        },
        updateTask: function () {
            data.tasks.forEach(function (tsk) {
                if (tsk.title === data.selectedTask.title) {
                    tsk.status = (tsk.status == false) ? true : false;
                }
            })
        }
    }

}());
//UI Controller
const UIController = (function () {
    const Selectors = {
        titleInput: ".form-control",
        addTaskBtn: "#btnAddNewTask",
        checkBoxTask: ".flexCheck",
        deleteItem: ".fa-times",
        taskDiv: "#task-list",
        taskListItems: ".list-group-item",
    }
    return {
        createTaskList: function (tasks) {
            let html = '';
            tasks.forEach(element => {
                if (element.status) {
                    html += `
                <li class="list-group-item list-group-item-secondary d-flex justify-content-between comleted-task">
                    <div class="d-flex">
                        <div >
                        <input type="checkbox" checked="${element.status}" onchange="App.completedTask(event)">
                        </div>
                        <p class="">${element.title}</p>
                    </div>
                    
                    <a href="#" class="delete-item" onclick="App.deleteTask(event)">
                        <i class="fas fa-times" ></i>
                    </a>
                </li>`;
                } else {
                    html += `
                <li class="list-group-item list-group-item-secondary d-flex justify-content-between">
                    <div class="d-flex">
                        <div >
                        <input type="checkbox"  onchange="App.completedTask(event)">
                        </div>
                        <p class="">${element.title}</p>
                    </div>
                    
                    <a href="#" class="delete-item" onclick="App.deleteTask(event)">
                        <i class="fas fa-times" ></i>
                    </a>
                </li>`;
                }

            });
            document.querySelector(Selectors.taskDiv).innerHTML += html;

        },

        getSelectors: function () {
            return Selectors;
        },
        addTask: function (tsk) {
            var item = `
        <li class="list-group-item list-group-item-secondary d-flex justify-content-between">
            <div class="d-flex">
                <div >
                <input type="checkbox"  onchange="App.completedTask(event)">
                </div>
                <p class="">${tsk.title}</p>
            </div>
            
            <a href="#" class="delete-item" onclick="App.deleteTask(event)">
                <i class="fas fa-times" ></i>
            </a>
        </li>`;
            document.querySelector(Selectors.taskDiv).innerHTML += item;
        },
        clearInputs: function () {
            document.querySelector(Selectors.titleInput).value = '';
        },
        blankTaskList: function () {
            document.querySelector(Selectors.taskDiv).innerHTML = "";
        },
        updateTask: function (tsk, pntr) {
            pntr.checked = tsk.status;
            if (pntr.checked) {
                pntr.parentNode.parentNode.parentNode.classList.add('comleted-task');
            } else if (pntr.checked == false && pntr.parentNode.parentNode.parentNode.classList.contains('comleted-task')) {
                pntr.parentNode.parentNode.parentNode.classList.remove('comleted-task');

            }
            /*   pntr.value = true */


        },
    }
}());
//App Controller
const App = (function (StorageCtrl, TaskCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors();
    const loadEventListeners = function () {
        document.querySelector(UISelectors.addTaskBtn).addEventListener('click', taskAddSubmit);

    }

    const taskAddSubmit = function (e) {
        const taskTitle = document.querySelector(UISelectors.titleInput).value;
        if (taskTitle !== "") {

            const newTask = TaskCtrl.addTask(taskTitle, false)
            StorageCtrl.storeProduct(newTask);
            UICtrl.clearInputs();
        }
        e.preventDefault();

    }
    return {
        init: function () {
            console.log('starting app...');

            const tasks = TaskCtrl.getTasks();
            if (tasks !== "") {
                UICtrl.createTaskList(tasks);
            }
            loadEventListeners();

        },
        completedTask: function (e) {
            //selected title
            const title = e.target.parentNode.parentNode.innerText;
            const slctdTask = TaskCtrl.getTaskByTitle(title);
            TaskCtrl.setCurrentTask(slctdTask);
            TaskCtrl.updateTask();
            
            StorageCtrl.updateTask(slctdTask);

            UICtrl.updateTask(slctdTask, e.target);
            e.preventDefault();
        },
        deleteTask: function (e) {
            //selected title
            const title = e.target.parentNode.parentNode.innerText;
            //get selected title
            const task = TaskCtrl.getTaskByTitle(title);
            //set selected title
            TaskCtrl.setCurrentTask(task);
            //local storage delete
            StorageCtrl.deleteTask(task);
            //UI update
            const tasks = StorageCtrl.getTasks();
            if (tasks !== "") {
                UICtrl.blankTaskList();

                UICtrl.createTaskList(tasks);
            } else {
                UICtrl.blankTaskList();
            }
            e.preventDefault();
        },
    }
}(StorageController, TaskController, UIController));

App.init();