
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'

import Dash from './app/Dash.jsx'
import Home from './app/Home.jsx'

class App extends Component {

	state = {
        // user: false
        user: {
            id: 'randomasfuckid',
            name: 'Kashif',
        }
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
