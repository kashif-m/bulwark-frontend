
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'

import Dash from './app/Dash.jsx'
import Home from './app/Home.jsx'

class App extends Component {

	state = {
        user: false
        // user: {
        //     id: 'randomasfuckid',
        //     name: 'Kashif',
        //     keys: {
        //         private: '218978921b89xy1b283b89z12893u2198u39021',
        //         public: 'sauig872r78y2189ye82n9ze892yne89327yz73'
        //     },
        //     wallet: {
        //         credits: '789.98',
        //         history: []
        //     }
        // }
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
