
import React, { Component } from 'react'

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
import InsuranceForm from './InsuranceForm.jsx'

class Dash extends Component {

	state = {
		selectedOption: 'overview',
		viewClaimForm: false,
		readable: '2 years'
	}

	updateClaimFormView = viewClaimForm => this.setState({viewClaimForm})

	isEmpty = id => document.getElementById(id) ? document.getElementById(id).value.length === 0 : false

	getReadable = value => {

		let years, months, str

		if(value.length === 0) str = '  Put some numbers in.'
		else {
			years = parseInt(value / 12)
			months = value % 12
			
			str = years !== 0 ? years === 1 ? '- 1 year '
			: years > 100 ? '  Are you fucking kidding me? x_x' : `- ${years} years `
			: ''
			
			if(str.length === 0 && (months > 1)) str += '-'
			if(years < 100)
			str += months !== 0 ? months === 1 ? ' 1 mon.'
			: months > 1 ? ` ${parseFloat(months).toFixed(0)} mons.` : `~ ${parseFloat(months*30).toFixed(0)} days`
			: ''
			
			str = str.length === 0 ? '  Are you fucking kidding me? x_x' : str
		}

		return str
	}

	updateInsuranceDetails = () => {

	}

	renderConfigureScreen = () => {
		const {readable, submitDisabled} = this.state
		const [user] = this.props.user
		return (
			<div className="configure">
				<div className="heading">Let's get started</div>
				<div className="info">
					<InfoIcon />
					Vehicle details and corresponding Insurance details cannot be modified once submitted.
				</div>
				<div className="inputs">

					<div className="subheading">Vehicle Details</div>
					<label>Vehicle Name</label>
					<input type="text" id='vehicle' />
					<label>Vehicle Number</label>
					<input type="text" id='number' />
					<label>Vehicle Type</label>
					<select name="vehicle-type" id="vehicle-type">
						<option value="two">2 Wheeler</option>
						<option value="three">3 Wheeler</option>
						<option value="four">4 Wheeler</option>
						<option value="six">6 Wheeler</option>
					</select>

					<div className="subheading">Personal Details</div>
					<label>Driving License Number</label>
					<input type="text" id='license' />
					<label>Name</label>
					<input type="text" id='name' defaultValue={user.name} />

					<div className="subheading">Insurance Details</div>
					<span>
						<label>Insurance Period [months]</label>
						<input type="number" id='period' defaultValue={24}
							onChange={() => this.setState({readable: this.getReadable(document.getElementById('period').value)})} />
						<span className="readable">{readable}</span>
					</span>

				</div>
				<div className='submit'
					onClick={() => updateInsuranceDetails()}> SUBMIT</div>
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
						<div className="heading">Keys</div>
						<div className="h">Private Key</div>
						<div className="v">{user.keys.private}</div>
						<div className="h">Public Key</div>
						<div className="v">{user.keys.public}</div>
					</div>
					<div className="option">
						<div className="heading">Digital Documents</div>
						<div className="h dd">Vehicle License</div>
						<div className="v dd">{user.documents.license}</div>
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
						<div className="val">{user.wallet.credits} ETH</div>
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
							user.configured ?
							<React.Component>
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
							</React.Component>
							: <div className="option selected">
								<AccountIcon />
								<span>Insurance</span>
							</div>
						}
					</div>
				</div>
				{
					selectedOption === 'account' ? this.renderAccountDetails()
					: !user.configured ? this.renderConfigureScreen()
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
