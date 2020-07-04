
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVG
import BulwarkLogo from '../assets/images/bulwarklogo.svg'
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
		console.log('asfhvashj')
		return (
			authScreen === 'login' ?
			<div className="login-form">
				<div className="heading">
					Enter your credentials
					<CloseIcon onClick={() => setAuthScreen(false)} />
				</div>
				{
					err ?
						<div className="err"
							onClick={() => setErr(false)} >
							{err}
							<CrossIcon />
						</div>
					: <div></div>
				}
				<label>E-MAIL</label>
				<input id='email' type="email" placeholder='Registered e-mail' />
				<label>PASSWORD</label>
				<input id='password' type="password" placeholder='Your password' />

				<div className="submit"
					onClick={() => verifyUser()} >LOGIN</div>
			</div>
			: authScreen === 'signup' ?
			<div className="signup-form">
				<div className="heading">
					Enter your details
					<CloseIcon onClick={() => setAuthScreen(false)} />
				</div>
				{
					err ?
						<div className="err"
							onClick={() => setErr(false)} >
							{err}
							<CrossIcon />
						</div>
					: <div></div>
				}
				<label>E-MAIL</label>
				<input type="text" id="email" placeholder='Your e-mail' />
				<label>PASSWORD</label>
				<input type="password" id="password" placeholder='Choose a strong password' />
				<label>NAME</label>
				<input type="text" id="name" placeholder='Full name as per records' />

				<div className="submit"
					onClick={() => createUser()} >REGISTER</div>
			</div>
			: null
		)
	}

	return (
		<div className='home' >
			{ authScreen ?
				<div className='auth'> {renderForm()} </div>
			: null }
			<div className="header">
				<BulwarkLogo />
				<span>bulwark</span>
				<span className="sign-up"
					onClick={() => setAuthScreen('signup')} >
					Sign Up</span>
			</div>
			<div className="main">
				<div className="info">
					<strong> Crop insurance with blockchain technologies. </strong>
					<div>
						We use a blockchain systems to strengthen our policies and your insurance claims.
					</div>
				</div>
				<div className="sign-in">
					Already Registered?
					<span
						onClick={() => setAuthScreen('login')} >
						login</span>
				</div>
			</div>
		</div>
	)
}

export default Home
