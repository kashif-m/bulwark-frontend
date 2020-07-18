
import React, { Component } from 'react'
import axios from 'axios'

import {getFormattedDate} from '../util/helpers'

// SVG
import AccountIcon from '../assets/images/account.svg'
import AddIcon from '../assets/images/add.svg'
import BackIcon from '../assets/images/back.svg'
import BitcoinIcon from '../assets/images/bitcoin.svg'
import BlockchainIcon from '../assets/images/blockchain.svg'
import BulwarkLogo from '../assets/images/bulwarklogo.svg'
import ClaimIcon from '../assets/images/claim.svg'
import DashboardIcon from '../assets/images/dashboard.svg'
import ExpiredIcon from '../assets/images/expired.svg'
import InfoIcon from '../assets/images/info.svg'
import InsuredIcon from '../assets/images/insured.svg'
import LocationIcon from '../assets/images/location.svg'
import RainIcon from '../assets/images/rain.svg'
import TempIcon from '../assets/images/temperature.svg'
import WalletIcon from '../assets/images/wallet.svg'

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
			},
			claims: 'loading',
			receipt: false
		}
	}

	updateClaimFormView = viewClaimForm => this.setState({viewClaimForm})

	componentDidMount() {
		const [user] = this.props.user
		if(user.configured) this.getWeather()

		this.getClaims()
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selectedOption !== this.state.selectedOption) {
			if(this.state.viewClaimForm) this.setState({viewClaimForm: false})
			if(this.state.selectedOption === 'overview' && this.state.weather.temp === '-') this.getWeather()
		}
		if(prevState.viewClaimForm !== this.state.viewClaimForm
			&& prevState.viewClaimForm) this.getClaims()
	}

	getClaims = () => {
		const [user] = this.props.user

		axios.get('http://localhost:5000/user/claims', {headers: {Authorization: user.token}})
			.then(res => this.setState({claims: res.data.claims ? res.data.claims.reverse() : []}))
			.catch(err => {
				console.log('Check bulwark console ?')
				console.log(err.response.data)
			})
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

	signUp = () => {
		const [user, updateUser] = this.props.user
		axios.get('http://localhost:5000/insurance/new', {headers: {Authorization: user.token}})
			.then(res => {
				if(!res || !res.data) console.log({err: 'could not receive from backend'})
				else res.data.user ? updateUser(res.data.user) : null
			})
			.catch(err => console.log(err.response.data))
	}

	payPremium = () => {
		const [user, updateUser] = this.props.user
		axios.get('http://localhost:5000/insurance/pay', {headers: {Authorization: user.token}})
			.then(res => {
				console.log(res.data)
				if(!res || !res.data) console.log({err: 'could not receive from backend'})
				else res.data.user ? updateUser(res.data.user) : null
				if(res.data.receipt) this.setState({receipt: res.data.receipt})
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

	renderPayPremiumPage = (initial = false) => {

		const nextPayment = (date, interval) => {
			var result = new Date(date);
			result.setDate(result.getDate() + interval);
			return result.toDateString();
		}

		const [user, updateUser]		= this.props.user
		const {selectedOption, receipt} = this.state

		const insurance  = user.insurance
		user._payPremium = ((insurance.coverage / 100) * 3).toFixed(2)
		insurance.status = insurance.insured ? 'insured' : 'expired'

		const date       = initial
							? new Date()
							: receipt ? receipt.date : insurance.date
		const _interval  = initial
							? insurance.interval
							: receipt ? receipt.interval : insurance.interval
		const from 		 = nextPayment(date, 0)
		const to   		 = nextPayment(from, _interval)
		const interval   = {from, to}
		const {lat, lon} = insurance.location

		return (
			<div className="pay-premium">
				{
					receipt
					? <React.Fragment>
						<div className="heading">Payment was successfull</div>
						{
							initial ? <div className="redirect">Redirecting you to dashboard ...</div>
							: <div className="transaction-details">
								<div className="heading">Transaction details</div>
								<div className="options">
									<div className="interval">
										<div className="heading">Interval</div>
										<div className="value">{interval.from} - {interval.to}</div>
									</div>
									<div className="land">
										<div className="heading">Location</div>
										<div className="lat">Latitude &ensp;&emsp; {lat}</div>
										<div className="lon">Longitude &emsp;{lon}</div>
									</div>
									<div className="amount">
										<div className="heading">Amount paid</div>
										<div className="value">{receipt.amount_paid} ETH</div>
									</div>
									<div className="back" onClick={() => this.setState({receipt: false})} >
										Go Back
									</div>
								</div>
							</div>
						}
					</React.Fragment>
					: initial || selectedOption === 'payment'
					? <React.Fragment>
						<div className="heading">Pay Premium</div>
						<div className="info">
							<InfoIcon />
							<span>This is calculated based on your coverage amount.</span>
						</div>
						<div className="options">
							<div className="total">
								<div className="heading">Amount to be paid</div>
								<div className="value">&ensp;{user.payPremium} ETH</div>
								<div className="value INR">&ensp;{user._payPremium} INR</div>
							</div>
							<div className="insurance-info">
								<div className={`heading${!initial ? ' non-edit' : ''}`}>For the following location and coverage</div>
								{
									initial ?
										<div className="edit" onClick={() => {
											const temp = {...user}
											temp.configured = false
											updateUser(temp)
										}} >edit</div>
									: null
								}
								<div className='location' >
									<div className="heading">Location</div>
									<div>Latitude: {lat}</div>
									<div>Longitude: {lon}</div>
								</div>
								<div className='coverage' >
									<div className="heading">Coverage Amount</div>
									<div>{insurance.coverage} INR</div>
								</div>
								<div className="interval">
									<div className="heading">Interval</div>
									{interval.from} - {interval.to}
								</div>
							</div>
							<div className="submit" onClick={() => initial ? this.signUp() : this.payPremium() }> PROCEED</div>
						</div>
					</React.Fragment>
					: <React.Fragment>
						<div className="heading">Pay Premium</div>
						<div className="info">
							<InfoIcon />
							<span>{insurance.status === 'insured' ? 'Payments done for this interval.' : 'Payments due for this interval.'}</span>
						</div>
						<div className="payment-details">
							{
								insurance.status === 'insured'
								? <div className="next-premium">
									Next Payment is on <span className="date">{nextPayment(insurance.date, insurance.interval)}</span>.
								</div>
								: insurance.status === 'expired'
								? <React.Fragment>
									<div className="next-premium">
										Payment due for 
										<div className="date"> {interval.from} - {interval.to} </div>
									</div>
									<div className={`pay ${insurance.status}`} onClick={() => this.setState({selectedOption: 'payment'})} >
										Clear dues
									</div>
								</React.Fragment>
								: ''
							}							
						</div>
					</React.Fragment>
				}
			</div>
		)
	}

	renderClaimList = () => {
		const claims = this.state.claims
		return (
			<div className="claim-list">
				{
					claims === 'loading'
					? <div className='loading' >
						<span>Loading your claims ...</span>
					</div>
					: claims.length > 0
					? <React.Fragment>
						{
							claims.map(claim => {
								const {status, processed, date, _id, land} = claim
								return (
									<div className={`claim ${processed ? 'success'
													: status === 'fail' ? 'error'
													: status === 'processing' ? 'processing'
													: 'success' }`} key={_id}
										onClick={() => this.setState({viewClaimForm: claim})} >
										<div className='survey' >{land}</div>
										<div className='date' >{getFormattedDate(date)}</div>
										<div className='details'>View details</div>
									</div>
								)
							})
						}
					</React.Fragment>
					: <div className='none' >
						<span>No claims made yet.</span>
					</div>
				}
			</div>
		)
	}

	renderClaims = () => {
		const [user] = this.props.user
		const {viewClaimForm} = this.state
		return (
			<div className="claims">
				{
					viewClaimForm ?
						<ClaimForm
							claim={viewClaimForm}
							updateClaimFormView={this.updateClaimFormView}
							user={user} />
					: <React.Fragment>
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
						{this.renderClaimList()}
					</React.Fragment>
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
		insurance.status = insurance.insured ? 'insured' : 'expired'

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
						<div className='details'>
							<div className={`status ${insurance.status}`}>
								{
									insurance.status === 'insured'
									? <React.Fragment>
										<InsuredIcon />
										<span>{insurance.status.toUpperCase()}</span>
									</React.Fragment>
									: <React.Fragment>
										<ExpiredIcon />
										<span>{insurance.status.toUpperCase()}</span>
									</React.Fragment>
								}
							</div>
							<div className="claim-details">
								<span>{insurance.surveyNo}</span>
								is {insurance.insured ? 'valid' : 'invalid'}.
							</div>
							<div className="next-premium"
								onClick={() => this.setState({selectedOption: 'pay-premium'})} >
								<label>Next Payment</label>
								<span>{nextPayment(insurance.date, insurance.interval)}</span>
							</div>
						</div>
					</div>
					<div className={weatherClass}>
						<div className="heading">Weather in your area</div>
						<div className='details'
								onClick={() => {
									const temp = {...this.state.weather}
									temp.info = 'loading ...'
									this.setState({
										weather: temp
									})
									this.getWeather()
								}} >
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
								<div className={`option${selectedOption === 'pay-premium' ? ' selected' : ''}`}
									onClick={() => this.setState({selectedOption: 'pay-premium'})} >
									<BitcoinIcon />
									<span>Pay Premium</span>
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
					: user.configured && !user.insurance.insured ? this.renderPayPremiumPage(true)
					: selectedOption === 'account' ? this.renderAccountDetails()
					: selectedOption === 'overview' ? this.renderOverview()
					: selectedOption.match(/(pay-premium|payment)/) ? this.renderPayPremiumPage()
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
