
import React, { Component } from 'react'

class Dash extends Component {

	state = {
		selectedOption: 'claims'
	}

	renderClaims = () => {
		return (
			<div className="claims">
				<div className="heading">View Claims</div>
				<div className="info">
					<img src={require('../assets/images/info.svg')} alt="" />
					<span>All your claims as recorded on the blockchain.</span>
				</div>
				<div className="options">
					<div className="option">Claim history</div>
					<div className="option">Current claims</div>
					<div className="option">Approved claims</div>
					<div className="option">Rejected claims</div>
				</div>
			</div>
		)
	}

	renderAccountDetails = () => {
		return (
			<div className="account">
				<div className="heading">Account Details</div>
				<div className="info">
					<img src={require('../assets/images/info.svg')} alt="" />
					<span>Your details as recorded on the blockchain.</span>
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
					<img src={require('../assets/images/info.svg')} alt="" />
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
					<img src={require('../assets/images/info.svg')} alt="" />
					<span>The blockchain itself.</span>
				</div>
			</div>
		)
	}

	render() {

		const [user, updateUser] = this.props.user
		const {selectedOption} = this.state

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
						<div className={`option${selectedOption === 'overview' ? ' selected' : ''}`}
							onClick={() => this.setState({selectedOption: 'overview'})} >
							<img src={require('../assets/images/dashboard.svg')} alt="" />
							<span>Overview</span>
						</div>
						<div className={`option${selectedOption === 'claims' ? ' selected' : ''}`}
							onClick={() => this.setState({selectedOption: 'claims'})} >
							<img src={require('../assets/images/claim.svg')} alt="" />
							<span>Claims</span>
						</div>
						<div className={`option${selectedOption === 'account' ? ' selected' : ''}`}
							onClick={() => this.setState({selectedOption: 'account'})} >
							<img src={require('../assets/images/account.svg')} alt="" />
							<span>Account</span>
						</div>
						<div className={`option${selectedOption === 'blockchain' ? ' selected' : ''}`}
							onClick={() => this.setState({selectedOption: 'blockchain'})} >
							<img src={require('../assets/images/blockchain.svg')} alt="" />
							<span>Blockchain</span>
						</div>
					</div>
				</div>
				{
					selectedOption === 'overview' ? this.renderOverview()
					: selectedOption === 'claims' ? this.renderClaims()
					: selectedOption === 'account' ? this.renderAccountDetails()
					: selectedOption === 'blockchain' ? this.renderBlockchain()
					: null
				}
			</div>
		)
	}
}

export default Dash
