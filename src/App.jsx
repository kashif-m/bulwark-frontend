
import axios from 'axios'
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'

import Dash from './components/Dash.jsx'
import Home from './components/Home.jsx'

class App extends Component {

	state = {
        user: false
    }

    componentDidMount() {
        try {
            let user = window.localStorage.getItem('bulwark')
            if(user) user = JSON.parse(user)
            else return
            axios.get('http://localhost:5000/user', {headers: {Authorization: user.token}})
                .then(res => this.updateUser(res.data.user))
                .catch(err => {
                    this.updateUser(false)
                })
            this.setState({user})
        } catch(err) {
            console.log('Object not proper')
        }
    }

    updateUser = user => {
        try {
            let str = JSON.stringify(user)
            window.localStorage.setItem('bulwark', str)
        } catch(err) {
            console.log('Object not proper')
            this.setState({user: false})
            return
        }
        this.setState({user})
    }

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
