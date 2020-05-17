
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'

import Dash from './components/Dash.jsx'
import Home from './components/Home.jsx'

class App extends Component {

	state = {
        user: false
    }

    updateUser = user => this.setState({user})

    render() {

        const {user} = this.state

        return (
            <div className="app">
                {
                    !user
                    ? <Home updateUser={this.updateUser} />
                    : <Dash user={[user, this.updateUser]} />
                }
            </div>
        )
    }
}

export default hot(App)
