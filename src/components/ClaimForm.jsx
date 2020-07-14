
import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {getFormattedDate} from '../util/helpers'

// SVGs
import InfoIcon from '../assets/images/info.svg'
import CloseIcon from '../assets/images/close.svg'
import CrossIcon from '../assets/images/cross.svg'

const ClaimForm = props => {

	const {user, updateClaimFormView, claim} = props
	const {insurance} = user
	const [err, setErr] = useState(false)
	const [status, setStatus] = useState(false)

	const canClaim = () => {
		const claim = {
			land: document.getElementById('claim--land').value,
			cause: document.getElementById('claim--cause').value
		}
		if(claim.cause === '') return setErr('Please select a reason.')

		setStatus('loading')
		axios.post('http://localhost:5000/bulwark/claim', {data: claim}, {headers: {Authorization: user.token}})
			.then(res => setStatus(res.data))
			.catch(err => {
				console.log(err)
				setStatus({
					info: {processed: false},
					err: 'Network issues'
				})
			})
	}

	const renderForm = () => {
		return (
			<React.Fragment>
				<div className="info">
					<InfoIcon />
					<span>Please fill out the necessary fields.</span>
				</div>
				<CloseIcon className='close' onClick={() => updateClaimFormView(false)} />
				<div className="claim--land">
					<div className="heading">Select your land</div>
					<select name="claim--land" id="claim--land" >
						<option value={insurance.surveyNo}> {insurance.surveyNo} </option>
					</select>
				</div>
				<div className="claim--cause">
					<div className="heading">Reason for Insurance claim?</div>
					<select name="claim--cause" id="claim--cause" >
						<option value="">Select Cause</option>
						<option value="rain">Rain Flooding</option>
						<option value="drought">Drought Damage</option>
					</select>
				</div>
				<div className={`err${err ? ' display' : ' none'}`}
					onClick={() => setErr(false)} >
					{err ? err : ''}
					<CrossIcon />
				</div>
				<div className={`submit${status === 'loading' ? ' loading' : ''}`}
					disabled={status === 'loading'}
					onClick={() => canClaim() } >SUBMIT</div>
			</React.Fragment>
		)
	}

	const renderLoadingScreen = () => {
		return (
			<React.Fragment>
				<div className="loading">
					Your claim is being processed. <br/>
					Come back here later. <br/>
					<div className="info">
						<InfoIcon />
						<span>This can take upto 15 minutes.</span>
					</div>
				</div>
				<div className="back" onClick={() => updateClaimFormView(false)} >Go Back</div>
			</React.Fragment>
		)
	}

	const renderTransactionScreen = (claim = false) => {
		const {date, _id, land, cause, info, processed} = claim ? claim : status
		const formattedDate = getFormattedDate(date)
		const heading = processed ? 'Your claim was successfully processed.' : 'Your claim could not be proccessed.'

		return (
			<React.Fragment>
				<div className={`claim ${processed ? 'success' : 'error'}`}>
					<div>{heading}</div>
					<div className="claim-info">
						<div className="info">Transaction details</div>
						<div className="date">
							<span>Date</span>
							<span>{formattedDate}</span>
						</div>
						<div className="id">
							<span>ID</span>
							<span>{_id}</span>
						</div>
						<div className="survey">
							<span>Survey Number</span>
							<span>{land}</span>
						</div>
						<div className="cause">
							<span>Cause</span>
							<span>{cause}</span>
						</div>
					</div>
				</div>
				<div className="back" onClick={() => updateClaimFormView(false)} >Go Back</div>
			</React.Fragment>
		)
	}
  	return (
	
		<div className='claim-form'>
			{
				claim === true
				? <React.Fragment>
					<div className="heading">Insurance Claim</div>
					{
						status === false ? renderForm()
						: status === 'loading' ? renderLoadingScreen()
						: status ? renderTransactionScreen()
						: null
					}
				</React.Fragment>
				: Object.keys(claim).length > 0
				? renderTransactionScreen(claim)
				: null
			}
		</div>
  	)
}

export default ClaimForm
