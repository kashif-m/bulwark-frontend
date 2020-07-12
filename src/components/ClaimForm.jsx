
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVGs
import InfoIcon from '../assets/images/info.svg'
import CloseIcon from '../assets/images/close.svg'
import CrossIcon from '../assets/images/cross.svg'

const ClaimForm = props => {

	const {user, updateClaimFormView} = props
	const {insurance} = user
	const [err, setErr] = useState(false)

	 useEffect(() => {
	 	setErr(false)
	 },[updateClaimFormView])

	const canClaim = () => {
		axios.get('http://localhost:5000/bulwark/claim', {headers: {Authorization: user.token}})
			.then(res =>{
				console.log(res)
				if(res.data.err)
					setErr(res.data.err);
				else 
				{
					console.log("Claim receipt: \n"+res.data)
				}
			})
			.catch(err => console.log(err))
	}

  	return (
	
		<div className='claim-form'>
			<div className="heading">Insurance Claim</div>
			<div className="info">
				<InfoIcon />
				<span>Please fill out the necessary fields.</span>
			</div>
			<CloseIcon className='close' onClick={() => updateClaimFormView(false)} />
			{
					err ?
					<div className="err"
						onClick={() => setErr(false)} >
						{err}
						<CrossIcon />
					</div>
					: <div></div>
			}
			<div className="claim--land">
				<div className="heading">Select your land</div>
	  			<select name="claim--land" id="claim--land">
					<option value={insurance.surveyNo}> {insurance.surveyNo} </option>
				</select>
			</div>
			<div className="claim--cause">
				<div className="heading">Reason for Insurance claim?</div>
				<select name="claim--cause" id="claim--cause">
					<option value="">Select Cause</option>
					<option value="rain">Rain Flooding</option>
					<option value="drought">Drought Damage</option>
				</select>
			</div>

			<div className="submit"
				onClick={() => canClaim()} >SUBMIT</div>
		</div>
  	)
}

export default ClaimForm
