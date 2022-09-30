const initialData = {
    title: "ToDo",
    year: (new Date()).getFullYear(),
    todo: {
        items: load("todoitems") || []
    }
};


renderApp(initialData);

function renderApp(data) {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = App(data);
    rootElem.querySelector(".todoaddform")
        .addEventListener("submit", (event) => handleTodoFormAdd(event, data));
    data.todo.items.forEach(item => {
        rootElem.querySelector(`[data-toggleid="${item.id}"`)
            .addEventListener("click", (event) => handleTodoItemToggle(event, data, item));
        rootElem.querySelector(`[data-removeid="${item.id}"`)
            .addEventListener("click", (event) => handleRemoveTodoItem(event, data, item));
    });

    save("todoitems", data.todo.items);
}

function handleTodoFormAdd(event, data) {
    event.preventDefault();

    const newItem = {
        "id": uuidv4(),
        "description": event.target.elements.todoItemDescription.value,
        "isCompleted": false,
    };

    const updatedData = {
        ...data,
        todo: {
            items: [
                ...data.todo.items,
                newItem
            ]
        }
    };

    renderApp(updatedData);
}

function handleTodoItemToggle(event, data, clickedItem) {
    const newItems = data.todo.items
        .map(item => {
            return item.id !== clickedItem.id ? item : {
                ...item,
                isCompleted: !item.isCompleted,
            }
        });
    
    const updatedData = {
        ...data,
        todo: {
            items: newItems
        }
    }

    renderApp(updatedData);
}

function handleRemoveTodoItem(event, data, clickedItem) {
    // filtered out the clicked item
    const newItems = data.todo.items
        .filter(item => item.id !== clickedItem.id);
    
    // create new data object
    const updatedData = {
        ...data,
        todo: {
            items: newItems
        }
    }

    // re-render
    renderApp(updatedData);
}

function TodoItem(props) {
    // add completed class name if the task is completed
    const className = "todoitem" 
        + (props.isCompleted ? " todoitem--completed" : "");
    
    return `
        <div class="${className}" data-taskid="${props.id}">
            <button class="todoitem__description todoitem__completedtoggle"
                data-toggleid="${props.id}">
                ${props.description}
            </button>
            <button class="todoitem__remove" data-removeid="${props.id}">
                Remove
            </button>
        </div>
    `;
}

function TodoListItem(props) {
    return `
        <li class="todolist__item">
            ${TodoItem(props)}
        </li>
    `;
}

function TodoList(props) {
    return `
        <ul class="todolist">
            ${
                
                props.items
                    .slice()
                    .reverse()
                    .map(function(todoItem) {
                        return TodoListItem(todoItem);
                    })
                    .join("")
            }
        </ul>
    `;
}

function TodoAddForm(props) {
    return `
        <form class="todoaddform">
            <input type="text" name="todoItemDescription" placeholder="Enter a task"
                class="todoaddform__description" />
            <button type="submit" class="todoaddform__submit">
                Add
            </button>
        </form>
    `;
}

function App(props) {
    return `
        <header class="mainheader">
            <h1 class="pagetitle">${props.title}</h1>
        </header>
        <main>
            ${TodoAddForm(props)}
            ${TodoList(props.todo)}
        </main> 
        <footer class="mainfooter">
            Oleksii &copy; ${props.year}
        </footer>
    `;
}

// Taken from: https://stackoverflow.com/a/2117523
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

function save(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}