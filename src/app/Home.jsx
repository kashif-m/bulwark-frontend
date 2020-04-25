
import React, {useState, useEffect} from 'react'

const Home = props => {

	const [authScreen, setAuthScreen] = useState(false)
	const [err, setErr] = useState(false)

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
						Already Registered?
						<div className="login"
							onClick={() => setAuthScreen(true)} >
							SIGN IN
						</div>
					</React.Fragment>
					: <div className="login-form">
						<div className="heading">
							Enter your credentials
							<img src={require('../assets/images/close.svg')} alt="x"
								onClick={() => setAuthScreen(false)} />
						</div>
						<label>E-MAIL</label>
						<input type="email" placeholder='Registered e-mail' />
						<label>PASSWORD</label>
						<input type="password" placeholder='Your password' />

						{
							err ?
								<div className="err"
									onClick={() => setErr(false)} >
									{err}
									<img src={require('../assets/images/cross.svg')} alt="" />
								</div>
							: null
						}

						<div className="submit">LOGIN</div>
					</div>
				}
			</div>
		</div>
	)
}

export default Home
