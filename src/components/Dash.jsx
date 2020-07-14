
import React, { Component } from 'react'
import axios from 'axios'

// SVG
import AccountIcon from '../assets/images/account.svg'
import AddIcon from '../assets/images/add.svg'
import BlockchainIcon from '../assets/images/blockchain.svg'
import BulwarkLogo from '../assets/images/bulwarklogo.svg'
import ClaimIcon from '../assets/images/claim.svg'
import DashboardIcon from '../assets/images/dashboard.svg'
import InfoIcon from '../assets/images/info.svg'
import WalletIcon from '../assets/images/wallet.svg'
import TempIcon from '../assets/images/temperature.svg'
import RainIcon from '../assets/images/rain.svg'
import LocationIcon from '../assets/images/location.svg'

// components
import ClaimForm from './ClaimForm.jsx'
import InitialForm from './forms/InitialForm.jsx'
// import InsuranceForm from './forms/InsuranceForm.jsx'

class Dash extends Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedOption: 'overview',
			viewClaimForm: false,
			wallet: '',
			weather: {
				temp: '-',
				humidity: '-',
				info: 'loading ...',
				location: 'Bangalore'
			}
		}
	}

	updateClaimFormView = viewClaimForm => this.setState({viewClaimForm})

	componentDidMount() {
		this.getWeather()
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selectedOption !== this.state.selectedOption) {
			if(this.state.viewClaimForm) this.setState({viewClaimForm: false})
			if(this.state.selectedOption === 'overview' && this.state.weather.temp === '-') this.getWeather()
		}
	}

	payPremium = () => {
		const [user, updateUser] = this.props.user
		axios.get('http://localhost:5000/insurance/new', {headers: {Authorization: user.token}})
			.then(res => {
				if(!res || !res.data) console.log({err: 'could not receive from backend'})
				else res.data.user ? updateUser(res.data.user) : null
			})
			.catch(err => console.log(err.response.data))
	}

	submitWallet = (dev = false) => {
		const [user, updateUser] = this.props.user
		if(dev) {
			axios.get('http://localhost:5000/user/dev:keys', {headers: {Authorization: user.token}})
				.then(res => updateUser(res.data.user))
				.catch(err => console.log(err))
		}
	}

	renderAddWallet = () => {
		const wallet = this.state.wallet
		const isSubmitDisabled = wallet.length !== 42
		return (
			<div className="add-wallet">
				<div className="heading">Add Wallet</div>
				<div className="info">
					<InfoIcon />
					<span>Enter your wallet address.</span>
				</div>
				<div className="options">
					<input type="text"
						onChange={e => {
							let val = e.target.value
							if(val.length === 1) val = '0x' + val
							else if(val.length === 2) val = ''
							else if(val.length > 42) return

							this.setState({wallet: val})
						}}
						placeholder="0xlegitwalletaddress"
						value={wallet} />
					<button className={`submit${isSubmitDisabled ? ' disabled': ''}`} onClick={() => this.submitWallet()}
						disabled={isSubmitDisabled} >SUBMIT</button>
					<span className="dev-keys" onClick={() => this.submitWallet(true)} >Use Dev Wallet</span>
				</div>
			</div>
		)
	}

	renderPayPremiumPage = () => {
		const [user, updateUser] = this.props.user
		const insurance = user.insurance

		return (
			<div className="pay-premium">
				<div className="heading">Pay First Premium</div>
				<div className="info">
					<InfoIcon />
					<span>This amount will be deducted from your{user.keys.dev ? ' bulwark' : ''} wallet.</span>
				</div>
				<div className="options">
					<div className="total">
						<span className="heading">Amount to be paid</span>
						<span className="value">{user.payPremium} ETH</span>
					</div>
					<div className="insurance-info">
						<div className='heading'>For the following location and coverage</div>
						<div className="edit" onClick={() => {
							const temp = {...user}
							temp.configured = false
							updateUser(temp)
						}} >edit</div>
						<div className='item' >
							<div className="heading">Location</div>
							<div>Latitude: {insurance.location.lat}</div>
							<div>Longitude: {insurance.location.lon}</div>
						</div>
						<div className='item' >
							<div className="heading">Coverage Amount</div>
							<div>{insurance.coverage} INR</div>
						</div>
					</div>
					<div className="submit" onClick={() => this.payPremium()}>PROCEED</div>
				</div>
			</div>
		)
	}

	renderClaims = () => {
		const [user] = this.props.user
		const {viewClaimForm} = this.state
		return (
			<div className="claims">
				<div className="heading">View Claims</div>
				<div className="info">
					<InfoIcon />
					<span>All your claims as recorded on the blockchain.</span>
				</div>
				<div className="options">
					<div className="option"
						onClick={() => this.setState({viewClaimForm: true})} >
						<AddIcon />
						Insurance Claim
					</div>
					{
						user.claims ?
						<div className="option">
							<div className="heading">Current Claims</div>
						</div> : null
					}
				</div>
				{
					viewClaimForm ?
						<ClaimForm
							updateClaimFormView={this.updateClaimFormView}
							user={user} />
					: null
				}
			</div>
		)
	}

	renderAccountDetails = () => {
		const [user] = this.props.user
		return (
			<div className="account">
				<div className="heading">Account Details</div>
				<div className="info">
					<InfoIcon />
					<span>Your details as recorded on the blockchain.</span>
				</div>
				<div className="options">
					<div className="option">
						<div className="heading">Address</div>
						<div className="i"></div>
						<div className="v">{user.keys.public}</div>
					</div>
				</div>
			</div>
		)
	}

	getWeather = () =>{
		const [user] 	 = this.props.user
		const {lat, lon} = user.insurance.location
		axios.get(`http://localhost:5000/util/getWeather?lat=${lat}&lon=${lon}`)
			.then(res => {
				this.setState({weather: res.data.weather});
			})
			.catch(err => {
				console.log(err)
				this.setState({weather: {
					temp: '-',
					humidity: '-',
					info: 'Troubles updating'
				}})
			})
	}
	renderOverview = () => {
		const [user] = this.props.user
		const {insurance} = user
		const weather = this.state.weather
		const nextPayment = (date, interval) => {
			var result = new Date(date);
  			result.setDate(result.getDate() + interval);
  			return result.toDateString();
		}
		const weatherClass = weather.info.match(/troubles/i) ? 'weather err'
							: weather.info.match(/loading/) ? 'weather loading'
							: 'weather'

		return (
			<div className="overview" >
				<div className="heading">Overview</div>
				<div className="info">
					<InfoIcon />
					<span>An overview of your account.</span>
				</div>
				<div className="options">
					<div className="insurance">
						<div className="heading">Current Insurance Details</div>
						<div className={`details${insurance.insured ? '' : ' expired'}`}>
							{
								insurance.insured ?
								<React.Fragment>
									<div className="status">
										<span>{insurance.surveyNo}</span>
										is insured.
									</div>
									<div className="next-premium">
										<label>Next Payment</label>
										<span>{nextPayment(insurance.date, insurance.interval)}</span>
									</div>
								</React.Fragment>
								: <React.Fragment>
									<div className="status">
										<span>{insurance.surveyNo}</span>
										has expired.
									</div>
								</React.Fragment>
							}
						</div>
					</div>
					<div className={weatherClass} onClick={() => {
								const temp = {...this.state.weather}
								temp.info = 'loading ...'
								this.setState({
									weather: temp
								})
								this.getWeather()
							}} >
						<div className="heading">Weather in your area</div>
						<div className='details'>
							<div className="location">
								<LocationIcon />
								<span className="val">{weather.location}</span>
							</div>
							<div className="temp">
								<TempIcon />
								<span>{weather.temp}</span>
							</div>
							<div className="rain">
								<RainIcon />
								<span>{weather.humidity}</span>
							</div>
							<div className="condition">{weather.info}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	renderBlockchain = () => {
		return (
			<div className="blockchain">
				<div className="heading">Blockchain</div>
				<div className="info">
					<InfoIcon />
					<span>The blockchain itself.</span>
				</div>
			</div>
		)
	}

	renderWallet = () => {
		const [user] = this.props.user
		return (
			<div className="wallet">
				<div className="heading">Your Wallet</div>
				<div className="info">
					<InfoIcon />
					<span>Credits in your wallet.</span>
				</div>
				<div className="options">
					<div className="option">
						<div className="heading">Total credits</div>
						<div className="val">{user.wallet.credits.toFixed(4)} ETH</div>
					</div>
					<div className="option">
						<div className="heading">Transaction history</div>
						{this.renderTransactionHistory(user.wallet.history)}
					</div>
				</div>
			</div>
		)
	}

	renderTransactionHistory = history => {
		const [user] = this.props.user
		var previous=[];
		
		// axios.get('http://localhost:5000/bulwark/getTransactions', {headers: {Authorization: user.token}})
		// 		.then(res => { return res.data; })
		// 		.then(data=>{
					
		// 			data.map(each=>{ 
		// 				const temp = (
		// 					<div>
		// 						<span>{each.time}</span>
		// 						<span>{each.from}</span>
		// 						<span>{each.to}</span>
		// 						<span>{each.value}</span>
		// 						<span>{each.blockNumber}</span>
		// 					</div>
		// 				)
		// 				previous.push(temp);
		// 			})
		// 		}).catch(console.log)
		return (
			<div className="transaction-history">
				<div className="headers">
					<span>Timestamp</span>
					<span>Sender</span>
					<span>Receiver</span>
					<span>Amount</span>
					<span>Block</span>
				</div>
			</div>
		)
	}

	render() {

		const [user, updateUser] = this.props.user
		const {selectedOption} = this.state
		console.log(user)

		return (
			<div className='dash' >
				<div className="header">
					<BulwarkLogo onClick={() => window.location.reload()} />
					<div className="greeting">
						Hey,
						<span className="user">{user.name}</span>
					</div>
					<div className="logout"
						onClick={() => updateUser(false)} >Log Out</div>
				</div>
				<div className="side-menu">
					<div className="options">
						{
							user.configured && user.insurance.insured ?
							<React.Fragment>
								<div className={`option${selectedOption === 'overview' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'overview'})} >
									<DashboardIcon />
									<span>Overview</span>
								</div>
								<div className={`option${selectedOption === 'account' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'account'})} >
									<AccountIcon />
									<span>Account</span>
								</div>
								<div className={`option${selectedOption === 'claims' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'claims'})} >
									<ClaimIcon />
									<span>Claims</span>
								</div>
								<div className={`option${selectedOption === 'wallet' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'wallet'})} >
									<WalletIcon />
									<span>Wallet</span>
								</div>
								<div className={`option${selectedOption === 'blockchain' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'blockchain'})} >
									<BlockchainIcon />
									<span>Blockchain</span>
								</div>
							</React.Fragment>
							: <div className="option selected">
								<AccountIcon />
								<span>Insurance</span>
							</div>
						}
					</div>
				</div>
				{
					!user.configured ? <InitialForm user={[user, updateUser]} />
					: user.configured && !user.insurance.insured && !user.keys.public ? this.renderAddWallet()
					: user.configured && !user.insurance.insured ? this.renderPayPremiumPage()
					: selectedOption === 'account' ? this.renderAccountDetails()
					: selectedOption === 'overview' ? this.renderOverview()
					: selectedOption === 'claims' ? this.renderClaims()
					: selectedOption === 'wallet' ? this.renderWallet()
					: selectedOption === 'blockchain' ? this.renderBlockchain()
					: null
				}
			</div>
		)
	}
}

export default Dash
