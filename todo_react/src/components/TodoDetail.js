import React, { Component } from 'react'
import Menu from "./Menu"
import {ajax} from "../utils";

class TodoDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            todo: {},
        }
    }
    componentDidMount() {
        let method = 'GET'
        let id = this.state.id
        let url = 'http://localhost:8000/api/todo/' + String(id)
        let data = ''
        ajax(method, url, data, (r) => {
            let t = JSON.parse(r)
            this.setState({
                todo: t,
            })
        })
    }

    render() {
        let todo = this.state.todo
        return (
            <div>
                <Menu/>
                <div>
                    {
                        Object.entries(todo).map((e, index) => {
                            let [k, v] = e
                            return (
                                <pre key={index}>
                                    ({k}): ({String(v)})
                                </pre>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default TodoDetail
