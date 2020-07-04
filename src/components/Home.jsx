
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVG
import CloseIcon from '../assets/images/close.svg'
import CrossIcon from '../assets/images/cross.svg'

const Home = props => {

	const [authScreen, setAuthScreen] = useState(false)
	const [err, setErr] = useState(false)

	useEffect(() => {
		if(!authScreen) setErr(false)
	}, [authScreen])

	const createUser = () => {

		const email = document.getElementById('email').value
		const password = document.getElementById('password').value
		const name = document.getElementById('name').value

		const data = {
			email,
			password,
			name
		}

		axios.post('http://localhost:5000/user/new', data)
			.then(res => {
				console.log(res.data)
				if(res.data.msg) {
					setAuthScreen('login')
					setErr(false)
				}
			})
			.catch(err => {
				if(err.response) {
					if(err.response.data.err) setErr(err.response.data.err)
				}
				else setErr('Could not connect to bulwark-backend.')
			})
	}

	const verifyUser = () => {
		
		const email = document.getElementById('email').value
		const password = document.getElementById('password').value

		const data = {
			email,
			password
		}

		axios.post('http://localhost:5000/user/login', data)
			.then(res => {
				if(res.data.user) props.updateUser(res.data.user)
				console.log('updated')
			})
			.catch(err => {
				if(err.response) {
					if(err.response.data.err) setErr(err.response.data.err)
				}
				else setErr('Could not connect to bulwark-backend.')
			})
	}

	const renderForm = () => {
		return (
			authScreen === 'login' ?
			<div className="login-form">
				<div className="heading">
					Enter your credentials
					<CloseIcon onClick={() => setAuthScreen(false)} />
				</div>
				<label>E-MAIL</label>
				<input id='email' type="email" placeholder='Registered e-mail' />
				<label>PASSWORD</label>
				<input id='password' type="password" placeholder='Your password' />

				{
					err ?
						<div className="err"
							onClick={() => setErr(false)} >
							{err}
							<CrossIcon />
						</div>
					: null
				}

				<div className="submit"
					onClick={() => verifyUser()} >LOGIN</div>
			</div>
			: authScreen === 'signup' ?
			<div className="signup-form">
				<div className="heading">
					Enter your details
					<CloseIcon onClick={() => setAuthScreen(false)} />
				</div>
				<label>E-MAIL</label>
				<input type="text" id="email" placeholder='Your e-mail' />
				<label>PASSWORD</label>
				<input type="password" id="password" placeholder='Choose a strong password' />
				<label>NAME</label>
				<input type="text" id="name" placeholder='Full name as per records' />

				{
					err ?
						<div className="err"
							onClick={() => setErr(false)} >
							{err}
							<CrossIcon />
						</div>
					: null
				}

				<div className="submit"
					onClick={() => createUser()} >REGISTER</div>
			</div>
			: null
		)
	}

	return (
		<div className='home' >
			<div className="header">BULWARK</div>
			<div className="body">
				Crop insurance with blockchain technologies.
				We use a blockchain system to strengthen our policies and your insurance claims.
				{/* <img src={require('../assets/images/crops.png')} alt=""/> */}
			</div>
			<div className="side">
				
				{
					!authScreen ?
					<React.Fragment>
						<div>
							Already Registered?
							<span className="login"
								onClick={() => setAuthScreen('login')} >
								Sign in
							</span>
						</div>
						<div className="sign-up"
							onClick={() => setAuthScreen('signup')} >
							SIGN UP
						</div>
					</React.Fragment>
					: renderForm()
				}
			</div>
		</div>
	)
}

export default Home
