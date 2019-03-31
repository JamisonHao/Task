import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {ajax} from "../utils"

class TodoItem extends Component {
    constructor(props) {
        super(props)
        let { task, id, done } = this.props.todo
        this.state = {
            editing: false,
            text: task,
            todo: {
                task,
                id,
                done,
            }
        }

    }
    onEdit = () => {
        this.setState({
            editing: true,
        })
    }
    onDelete = () => {
        let { id } = this.state.todo
        let method = 'GET'
        let url = 'http://localhost:8000/api/todo/delete/' + String(id)
        ajax(method, url, '', (r) => {
            this.props.onDelete(id)
        })
    }
    onSubmit = () => {
        let { id } = this.state.todo
        let text = this.state.text
        let method = 'POST'
        let url = 'http://localhost:8000/api/todo/update/' + String(id)
        let data = {
            task: text
        }
        ajax(method, url, data, (r) => {
            let todo = JSON.parse(r)
            this.setState({
                todo: todo,
                editing: false,
            })
            this.updateCounter()
        })
    }
    onCancel = () => {
        this.setState({
            editing: false,
        })
    }
    onChange = (e) => {
        this.setState({
            text: e.target.value,
        })
    }
    updateCounter() {
        let func = this.props.onUpdate
        func(this.state.todo)
    }

    toggleComplete = () => {
        let { id, done } = this.state.todo
        let method = 'POST'
        let url = 'http://localhost:8000/api/todo/update/' + String(id)
        let data = {
            done: !done,
        }
        ajax(method, url, data, (r) => {
            let todo = JSON.parse(r)
            this.setState({
                todo: todo,
            })
            this.updateCounter()
        })
    }

    render() {
        let {id, task, done} = this.state.todo
        let todo = null
        if (this.state.editing) {
            todo = (
                <div>
                    <button onClick={this.onSubmit}>提交</button>
                    <button onClick={this.onCancel}>取消</button>
                    <input type="text" value={this.state.text} onChange={this.onChange}/>
                </div>
            )
        } else {
            let text = done ? '取消完成' : '标记完成'
            todo = (
                <div>
                    <button onClick={this.onEdit}>编辑</button>
                    <button onClick={this.onDelete}>删除</button>
                    <button onClick={this.toggleComplete}>{text}</button>
                    {/*todo 的详细信息*/}
                    <Link to={`/todo/${id}`}>{task}</Link>
                </div>
            )
        }
        let cls = done ? 'todo-complete' : ''
        return (
            <div className={`todo-cell ${cls}`}>
                {todo}
            </div>
        )
    }
}

export default TodoItem
