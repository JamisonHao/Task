import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Menu extends Component {
    render() {
        let menus = [
            {
                text: 'home',
                url: '/',
            },
            {
                text: 'todo',
                url: '/todo',
            },
        ]
        return (
            <nav>
                {
                    menus.map((e, index) =>
                        <Link to={e.url} key={index}>{e.text}</Link>
                    )
                }
            </nav>
        )
    }
}

export default Menu
