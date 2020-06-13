
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVG
import InfoIcon from '../../assets/images/info.svg'

const InitialForm = props => {

    const [user, updateUser] = props.user
    const [form, setForm] = useState('user')
    const [readable, setReadable] = useState('2 years')
    const [data, setData] = useState({
        user: {
            name: '',
            license: ''
        },
        vehicle: {
            name: '',
            wheels: 2,
            number: ''
        },
        insurance: {
            period: 24
        }
    })

    const updateData = (key, value) => {
        const temp = {...data}
        temp[form][key] = value
        setData(temp)
    }

	const getReadable = value => {

		let years, months, str

		if(value.length === 0) str = '  Put some numbers in.'
		else {
			years = parseInt(value / 12)
			months = value % 12

			str = years !== 0 ? years === 1 ? ' 1 year '
			: years > 100 ? '  Are you fucking kidding me? x_x' : ` ${years} years `
			: ''

			if(years < 100)
			str += months !== 0 ? months === 1 ? ' 1 mon.'
			: months > 1 ? ` ${parseFloat(months).toFixed(0)} mons.` : `~ ${parseFloat(months*30).toFixed(0)} days`
			: ''

			str = str.length === 0 ? '  Are you fucking kidding me? x_x' : str
		}

		return str
	}

    const updateUserDetails = () => {

        const userData = {
            dl: data.user.dl,
            insurance: {
                period: data.insurance.period,
                vehicle: data.vehicle
            }
        }
        axios.post('http://localhost:5000/user/details', {userData}, { headers: { Authorization: user.token } })
            .then(res => {
                if(res.data.user) updateUser(res.data.user)
            })
            .catch(err => console.log(err))
	}

	const personalDetails = () => {
        return (
            <div className="personal-details">
                <label>Name</label>
                <input type="text" defaultValue={user.name}
                    onChange={event => updateData('name', event.target.value) } />
                <label>Driving License Number</label>
                <input type="text"
                    onChange={event => updateData('dl', event.target.value) } />
            </div>
        )
    }

    const vehicleDetails = () => {
        return (
            <div className="vehicle-details">
                <label>Vehicle Name</label>
                <input type="text"
                    onChange={event => updateData('name', event.target.value) } />
                <label>Vehicle Number</label>
                <input type="text"
                    onChange={event => updateData('number', event.target.value) } />
                <label>Vehicle Type</label>
                <select name="vehicle-type"
                    onChange={event => updateData('wheels', event.target.value) } >
                    <option value="2">2 Wheeler</option>
                    <option value="3">3 Wheeler</option>
                    <option value="4">4 Wheeler</option>
                    <option value="6">6 Wheeler</option>
                </select>
            </div>
        )
    }

    const insuranceDetails = () => {
        return (
            <div className="insurance-details">
                <label>Insurance Period [months]</label>
                <input type="number" defaultValue={data.insurance.period}
                    onChange={event => {
                        updateData('period', event.target.value ? parseInt(event.target.value) : 0)
                        setReadable(getReadable(event.target.value))
                    }} />
                <span className="readable">{readable}</span>
            </div>
        )
    }

    const renderSubmitButton = () => <div className={`submit${data.insurance.period == 0 ? ' disabled' : ''}`}
                                            disabled={data.insurance.period == 0}
                                            onClick={() => updateUserDetails()} >SUBMIT</div>
    const renderNextButton = () => <div className="next"
                                            onClick={() => setForm(form === 'user' ? 'vehicle'
                                                                    : form === 'vehicle' ? 'insurance'
                                                                    : '' )} >NEXT</div>

    return (
        <div className='initial-form' >
            <div className="heading">Let's get started</div>
            <div className="info">
                <InfoIcon />
                {
                    form === 'user' ? 'Personal details.'
                    : form === 'vehicle' ? 'Your vehicle details.'
                    : form === 'insurance' ? 'How long you want them insured?'
                    : ''
                }
            </div>

            {
                form === 'user' ? personalDetails()
                : form === 'vehicle' ? vehicleDetails()
                : form === 'insurance' ? insuranceDetails()
                : ''
            }

            {
                form === 'insurance'
                ? renderSubmitButton()
                : renderNextButton()
            }

        </div>
    )
}

export default InitialForm
