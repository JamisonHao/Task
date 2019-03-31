import React, { Component } from 'react'
import Menu from './Menu'
import TodoList from './TodoList'
import TodoCounter from './TodoCounter'

import { ajax } from '../utils'

import './todo.css'

class Todo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            text: '',
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }


    componentDidMount() {
        let method = 'GET'
        let url = 'http://localhost:8000/api/todo/all'
        let data = ''
        ajax(method, url, data, (r) => {
            let ts = JSON.parse(r)
            // 获取数据后在回调函数中更新 todos 的值
            this.setState({
                todos: ts,
            })
        })
    }

    onUpdate(todo) {
        let todos = this.state.todos
        let t = todos.find(e => e.id === todo.id)
        t.done = todo.done
        this.setState({
            todos: todos,
        })
    }

    onDelete(id) {
        console.log('id in delete', id, this.state)
        let todos = this.state.todos
        let index = todos.findIndex(e => e.id === id)
        todos.splice(index, 1)
        this.setState({
            todos: todos,
        })
    }

    render() {
        let todos = this.state.todos
        return (
            <div>
                <Menu />
                <h3>TODO</h3>
                <TodoList todos={todos} onUpdate={this.onUpdate} onDelete={this.onDelete}/>
                <TodoCounter todos={todos}/>
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="new-todo">
                        输入事项
                    </label>
                    <input
                        id="new-todo"
                        onChange={this.onChange}
                        value={this.state.text}
                    />
                    <button>
                        添加第 {todos.length + 1} 个 todo
                    </button>
                </form>
            </div>
        )
    }

    onChange(e) {
        this.setState({ text: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()
        if (!this.state.text.length) {
            return
        }
        let task = this.state.text
        let method = 'POST'
        let url = 'http://localhost:8000/api/todo/add'
        let data = {
            task,
        }
        let todos = this.state.todos
        ajax(method, url, data, (r) => {
            let ts = JSON.parse(r)
            console.log('ts in post', ts)
            todos.push(ts)
            this.setState({
                todos: todos,
            })
        })
    }
}

export default Todo
