var timeString = function (timestamp) {
    t = new Date(timestamp * 1000)
    t = t.toLocaleTimeString()
    return t
}

var todoTemplate = function (todo) {
    var title = todo.title
    var id = todo.id
    var t = `
       <tr class="todo-cell" id='todo-${id}' data-id="${id}">
           <td> 
  
              <input type="checkbox" id="todo-${id}-c" class="todo-complete" />
              <label for="todo-${id}-c"></label>
   
           </td>
           <td class='todo-title' for='todo-${id}'>${title}</td>
           <td>
              <!--<i class="todo-edit small material-icons">mode_edit</i>-->
              <i class="todo-delete small material-icons">delete_forever</i>
           </td>
       </tr>
    `
    return t
}

var insertTodo = function (todo) {
    log(todo)
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var insertEditForm = function (cell) {
    var form = `
        <div class='todo-edit-form'>
            <input class="todo-edit-input">
            <button class='todo-update'>更新</button>
        </div>
    `
    cell.insertAdjacentHTML('beforeend', form)
}

var loadTodos = function () {
    // 调用 ajax api 来载入数据
    apiTodoAll(function (r) {
        // console.log('load all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for (var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            if (!todo.completed) {
                insertTodo(todo)
            }

        }
    })
}

var bindEventTodoAdd = function () {
    var b = e('#id-button-add')
    b.addEventListener('click', function () {
        var input = e('#id-input-todo')
        var title = input.value
        input.value = ''
        input.blur()
        log('click add', title)
        var form = {
            'title': title,
        }
        apiTodoAdd(form, function (r) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(r)
            insertTodo(todo)
            log(input)
            input.blur()
        })
    })
}

var bindEventTodoDelete = function () {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-delete')) {
            // 删除这个 todo
            var todoCell = self.parentElement.parentElement
            var todo_id = todoCell.dataset.id
            apiTodoDelete(todo_id, function (r) {
                log('删除成功', todo_id)
                todoCell.remove()
            })
        }
    })
}

var bindEventTodoEdit = function () {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-edit')) {
            // 删除这个 todo
            var todoCell = self.parentElement
            insertEditForm(todoCell)
        }
    })
}


var bindEventTodoUpdate = function () {
    var todoList = e('.todo-list')
    // 
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-update')) {
            var editForm = self.parentElement
            // querySelector 是 DOM 元素的方法
            // document.querySelector 中的 document 是所有元素的祖先元素
            var input = editForm.querySelector('.todo-edit-input')
            var title = input.value
            // 用 closest 方法可以找到最近的直系父节点
            var todoCell = self.closest('.todo-cell')
            var todo_id = todoCell.dataset.id
            var form = {
                'id': todo_id,
                'title': title,
            }
            apiTodoUpdate(form, function (r) {
                var todo = JSON.parse(r)
                var selector = '#todo-' + todo.id
                var todoCell = e(selector)
                var titleSpan = todoCell.querySelector('.todo-title')
                titleSpan.innerHTML = todo.title
            })
        }
    })
}


var bindEventTodoComplete = function () {
    var todoList = e('.todo-list')
    // 注意, 
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-complete')) {
            log('点击了 complete ')

            // 用 closest 方法可以找到最近的直系父节点
            var todoCell = self.closest('.todo-cell')
            var todo_id = todoCell.dataset.id
            var form = {
                'id': todo_id,
            }
            log(form)
            apiTodoComplete(form, function (r) {
                self.disabled = "disabled"
                todoCell.classList.add('complete')
            })
        }
    })
}

var bindEvents = function () {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
    bindEventTodoComplete()
}

var __main = function () {
    bindEvents()
    loadTodos()
}

__main()
