
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVG
import BulwarkLogo from '../assets/images/bulwarklogo.svg'
import CloseIcon from '../assets/images/close.svg'
import CrossIcon from '../assets/images/cross.svg'
import InfoIcon from '../assets/images/info.svg'

const Home = props => {

	const [authScreen, setAuthScreen] = useState(false)
	const [err, setErr] = useState(false)
	const [data, setData] = useState({
		email: '',
		password: '',
		name: ''
	})

	useEffect(() => {
		setErr(false)
	}, [authScreen])

	const updateData = (key, val) => {
		const temp = {...data}
		temp[key] = val
		setData(temp)
	}

	const createUser = () => {

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
		
		const {email, password} = data

		const _data = {
			email,
			password
		}

		axios.post('http://localhost:5000/user/login', _data)
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

	const resetUser = () => {
		const {email} = data

		axios.get(`http://localhost:5000/user/reset&email=${email}`)
			.then(res => {console.log(res.data)})
			.catch(err => {
				if(err.response) {
					if(err.response.data.err) setErr(err.response.data.err)
					else setErr("Something's wrong. Check console.") && console.log(err)
				}
				else setErr('Could no connect to bulwark-backend')
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
				<input id='email' type="email" placeholder='Registered e-mail'
					onChange={e => updateData('email', e.target.value)} />
				<label className='pass'>
					PASSWORD
					<span onClick={() => setAuthScreen('reset')} >Forgot Password</span>
				</label>
				<input id='password' type="password" placeholder='Your password'
					onChange={e => updateData('password', e.target.value)} />

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
				<input type="text" id="email" placeholder='Your e-mail'
					onChange={e => updateData('email', e.target.value)} />
				<label>PASSWORD</label>
				<input type="password" id="password" placeholder='Choose a strong password'
					onChange={e => updateData('password', e.target.value)} />
				<label>NAME</label>
				<input type="text" id="name" placeholder='Full name as per records'
					onChange={e => updateData('name', e.target.value)} />

				<div className="submit"
					onClick={() => createUser()} >REGISTER</div>
			</div>
			: authScreen === 'reset' ?
			<div className="reset-form">
				<div className="heading">
					<div>
						<div>Forgot your password?</div>
						<div className="info">
							<InfoIcon />
							A link to reset your password will be sent to your e-mail
						</div>
					</div>
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
				<input type="text" id='email' placeholder='Your registered e-mail'
					onChange={e => updateData('email', e.target.value)} />

				<div className="submit"
					onClick={() => resetUser()} >SUBMIT</div>
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
						We use blockchain systems to strengthen our policies and your insurance claims.
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
