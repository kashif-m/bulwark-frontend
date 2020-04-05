
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'

import Dash from './app/Dash.jsx'
import Home from './app/Home.jsx'

class App extends Component {

	state = {
        user: false
    }

    render() {

        const {user} = this.state

        return (
            <div className="app">
                {
                    !user ? <Home />
                    : <Dash />
                }
            </div>
        )
    }
}

export default hot(App)
