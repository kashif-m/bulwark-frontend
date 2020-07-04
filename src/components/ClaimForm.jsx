
import React, {useState, useEffect} from 'react'

// SVGs
import InfoIcon from '../assets/images/info.svg'
import CloseIcon from '../assets/images/close.svg'

const ClaimForm = props => {

	const {user, updateClaimFormView} = props
	const vehicle = user.insurance.vehicle

  	return (
	
		<div className='claim-form'>
			<div className="heading">Insurance Claim</div>
			<div className="info">
				<InfoIcon />
				<span>Please fill out the necessary fields.</span>
			</div>
			<CloseIcon className='close' onClick={() => updateClaimFormView(false)} />
			<div className="claim--type">
				<div className="heading">Insurance Type</div>
				<select name="claim-type" id="claim-type">
					<option value="automobile">Automobile</option>
				</select>
			</div>
			<div className="claim--vehicle">
				<div className="heading">Select your vehicle</div>
	  			<select name="claim--vehicle" id="claim--vehicle">
					<option value={vehicle.number}> {vehicle.value} </option>
				</select>
			</div>
			<div className="claim--cause">
				<div className="heading">Reason for Insurance claim?</div>
				<select name="claim--cause" id="claim--cause">
					<option value="stolen">Vehicle Stolen</option>
					<option value="damage">Vehicle Damaged</option>
				</select>
			</div>

			<div className="submit">SUBMIT</div>
		</div>
  	)
}

export default ClaimForm
