// express_demo.js 文件
const fs = require('fs')

// 引入 express 并且创建一个 express 实例赋值给 app
const express = require('express')
const bodyParser = require('body-parser')

// cors 模块用来解决跨域问题
const cors = require('cors')

const log = console.log.bind(console)

const app = express()

const loadTodos = () => {
    let data = fs.readFileSync('todo.json')
    let todos = JSON.parse(data)
    return todos
}

const saveTodos = (todos) => {
    let s = JSON.stringify(todos, null, 2)
    fs.writeFileSync('todo.json', s)
}

const todoList = loadTodos()

// 配置静态文件目录
app.use(express.static('static'))
app.use(cors())
// 自己解析前端发送过来的 json 格式的数据
app.use(bodyParser.json())

const sendHtml = (path, response) => {
    let options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        log(`读取的 html 文件 ${path} 内容是`, typeof data)
        // 用 response.send 函数返回数据给浏览器
        response.send(data)
    })
}

const sendJSON = (data, response) => {
    let r = JSON.stringify(data, null, 2)
    response.send(r)
}

const abort = (response, code) => {
    let mapper = {
        400: 'Bad Request',
        404: 'Not Found',
    }
    let text = mapper[code]
    response.status(code).send(text)
}

const todoAdd = (form) => {
    if (todoList.length === 0) {
        form.id = 1
    } else {
        let tail = todoList[todoList.length - 1]
        form.id = tail.id + 1
    }
    let now = Date.now()
    form.createdTime = now
    form.updatedTime = now
    form.done = false
    todoList.push(form)
    saveTodos(todoList)
    return form
}

const todoUpdate = (id, form) => {
    id = Number(id)
    let todo = todoList.find(e => e.id === id)
    if (todo === undefined) {
        return {}
    } else {
        todo.updatedTime = Date.now()
        Object.entries(form).forEach(entry => {
            let [k, v] = entry
            todo[k] = v
        })
        saveTodos(todoList)
        return todo
    }
}

const todoDelete = (id) => {
    id = Number(id)
    let index = todoList.findIndex(e => e.id === id)
    if (index > -1) {
        let t = todoList.splice(index, 1)[0]
        saveTodos(todoList)
        return t
    } else {
        return {}
    }
}

app.get('/', (request, response) => {
    console.log('debug 111')
    let path = 'index.html'
    sendHtml(path, response)
})

app.get('/api/todo/all', (request, response) => {
    console.log('todoList in todo', todoList)
    sendJSON(todoList, response)
})

app.post('/api/todo/add', (request, response) => {
    let form = request.body
    let todo = todoAdd(form)
    sendJSON(todo, response)
})

app.post('/api/todo/update/:id', (request, response) => {
    let id = request.params.id
    let form = request.body
    let todo = todoUpdate(id, form)
    sendJSON(todo, response)
})


app.get('/api/todo/delete/:id', (request, response) => {
    let id = request.params.id
    let todo = todoDelete(id)
    sendJSON(todo, response)
})

const todoFetch = (id) => {
    id = Number(id)
    let todo = todoList.find(e => e.id === id)
    if (todo === undefined) {
        return {}
    } else {
        return todo
    }
}

app.get('/api/todo/:id', (request, response) => {
    let id = request.params.id
    let todo = todoFetch(id)
    sendJSON(todo, response)
})

const main = () => {
    let server = app.listen(8000, () => {
        let host = server.address().address
        let port = server.address().port

        log(`应用实例，访问地址为 http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}
