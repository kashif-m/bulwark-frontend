
import React, {useState, useEffect} from 'react'

// SVGs
import InfoIcon from '../assets/images/info.svg'
import CloseIcon from '../assets/images/close.svg'

const ClaimForm = props => {

	const {user, updateClaimFormView} = props
	user.insurance = {}
	user.insurance.vehicles = [{name: 'RE 500cc'}, {name: 'RE 150cc'}]

  	return (
	
		<div className='claim-form'>
			<div className="heading">Insurance Claim</div>
			<div className="info">
				<InfoIcon />
				Please fill out the necessary fields.
			</div>
			<CloseIcon onClick={() => updateClaimFormView(false)} />
			<div className="claim--type">
				<div className="heading">Insurance Type</div>
				<select name="claim-type" id="claim-type">
					<option value="automobile">Automobile</option>
				</select>
			</div>
			<div className="claim--vehicle">
				<div className="heading">Select your vehicle</div>
	  			<select name="claim--vehicle" id="claim--vehicle">
					{
						user.insurance.vehicles.map(vehicle =>
							<option value={vehicle.name}> {vehicle.name} </option>
						)
					}
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
