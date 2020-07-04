
import React, { Component } from 'react'
import axios from 'axios'

// SVG
import AccountIcon from '../assets/images/account.svg'
import AddIcon from '../assets/images/add.svg'
import BlockchainIcon from '../assets/images/blockchain.svg'
import ClaimIcon from '../assets/images/claim.svg'
import DashboardIcon from '../assets/images/dashboard.svg'
import InfoIcon from '../assets/images/info.svg'
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
			viewClaimForm: false
		}
	}

	updateClaimFormView = viewClaimForm => this.setState({viewClaimForm})

	componentDidUpdate(prevProps, prevState) {
		if(prevState.selectedOption !== this.state.selectedOption
			&& this.state.viewClaimForm) this.setState({viewClaimForm: false})
	}

	payPremium = () => {
		const [user, updateUser] = this.props.user
		console.log(user)
		const data = {
			vehicleNo: user.insurance.vehicle.number,
			insurance_period: user.insurance.period
		}
		axios.post('http://localhost:5000/insurance/new', {data}, {headers: {Authorization: user.token}})
			.then(res => {
				if(!res || !res.data) console.log({err: 'could not receive from backend'})
				else res.data.user ? updateUser(res.data.user) : null
			})
			.catch(err => console.log(err.response.data))
	}

	renderPayPremiumPage = () => {
		const [user, updateUser] = this.props.user
		const insurance = user.insurance
		const vehicle = insurance.vehicle

		return (
			<div className="pay-premium">
				<div className="heading">Pay Premium</div>
				<div className="info">
					<InfoIcon />
					<span>This amount will be deducted from your bulwark wallet.</span>
				</div>
				<div className="options">
					<div className="total">
						<span className="heading">Amount to be paid</span>
						<span className="value">{user.payPremium} ETH</span>
					</div>
					<div className="insurance-info">
						<div className='heading'>For the following vehicle and insurance period</div>
						<div className="edit" onClick={() => {
							const temp = {...user}
							temp.configured = false
							updateUser(temp)
						}} >edit</div>
						<div className="vehicle-details">
							<div>Vehicle - {vehicle.name}</div>
							<div>Type - {vehicle.wheels} Wheeler</div>
							<div>Insurance Period - {insurance.period} months</div>
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

	renderOverview = () => {
		const [user] = this.props.user
		return (
			<div className="overview">
				<div className="heading">Overview</div>
				<div className="info">
					<InfoIcon />
					<span>An overview of your account.</span>
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
		return (
			<div className="transaction-history">
				<div className="headers">
					<span>Timestamp</span>
					<span>Sender</span>
					<span>Receiver</span>
					<span>Amount</span>
					<span>Balance</span>
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
				<div className="nav">
					<div className="greeting">
						Greetings, {user.name}
					</div>
					<div className="logout"
						onClick={() => updateUser(false)} >logout</div>
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
