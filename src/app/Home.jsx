
import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Home = props => {

	const [authScreen, setAuthScreen] = useState(false)
	const [err, setErr] = useState(false)

	const createUser = () => {

		const email = document.getElementById('email').value
		const password = document.getElementById('password').value
		const name = document.getElementById('name').value
		const license = document.getElementById('license').value

		const data = {
			email,
			password,
			name,
			license
		}

		axios.post('http://localhost:5000/user/new', data)
			.then(res => console.log(res.data))
			.catch(err => {
				if(err.response.data.err)
					setErr(err.response.data.err)
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
				console.log(res.data)
			})
			.catch(err => {
				if(err.response.data.err)
					setErr(err.response.data.err)
			})
	}

	const renderForm = () => {
		return (
			authScreen === 'login' ?
			<div className="login-form">
				<div className="heading">
					Enter your credentials
					<img src={require('../assets/images/close.svg')} alt="x"
						onClick={() => setAuthScreen(false)} />
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
							<img src={require('../assets/images/cross.svg')} alt="" />
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
					<img src={require('../assets/images/close.svg')} alt="x"
						onClick={() => setAuthScreen(false)} />
				</div>
				<label>E-MAIL</label>
				<input type="text" id="email" placeholder='Your e-mail' />
				<label>PASSWORD</label>
				<input type="password" id="password" placeholder='Choose a strong password' />
				<label>NAME</label>
				<input type="text" id="name" placeholder='Full name as per records' />
				<label>DRIVING LICENSE #</label>
				<input type="text" id="license" placeholder='DL # as per records' />

				{
					err ?
						<div className="err"
							onClick={() => setErr(false)} >
							{err}
							<img src={require('../assets/images/cross.svg')} alt="" />
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
			<div className="header">unnamed-frontend</div>
			<div className="body">
				Automobile insurance with blockchain technologies.
				We use blockchain systems to strengthen our policies and your insurance claims. <br/> <br/>
				Contact us and get started today!
			</div>
			<div className="side">
				{
					!authScreen ?
					<React.Fragment>
						<span>Already Registered?</span>
						<div className="login"
							onClick={() => setAuthScreen('login')} >
							Sign in
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
