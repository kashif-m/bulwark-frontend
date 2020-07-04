
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
            aadhar: ''
        },
        location: {
            lat: '',
            lon: '',
            info: ''
        },
        insurance: {
            interval: 24
        }
    })

    const updateData = (key, value) => {
        const temp = {...data}

        if (key === 'aadhar') {
            const _value = value.replace(/ /g, '')
            if(isNaN(_value)) return
            if(_value.length > 16) return
            if (_value.length > 0
                && _value.length % 4 === 0
                && _value.length !== 16
                && value.length > temp[form][key].length )
                temp[form][key] = value + ' '
            else if(_value.length % 4 === 0 && _value.length < 16)
                temp[form][key] = value.slice(0, value.length - 1)
            else temp[form][key] = value
        } else if(form === 'location') {
            if(isNaN(value)) return
            temp[form][key] = value.toFixed(4) || value
        }
        else temp[form][key] = value

        console.log(form, key, value)
        setData(temp)
    }

	const getReadable = value => {

		let years, months, str

		if(value.length === 0) str = '  Put some numbers in.'
		else {
			years = parseInt(value / 12)
			months = value % 12

			str = years !== 0 ? years === 1 ? ' 1 year '
			: years > 100 ? '  Are you kidding me? x_x' : ` ${years} years `
			: ''

			if(years < 100)
			str += months !== 0 ? months === 1 ? ' 1 mon.'
			: months > 1 ? ` ${parseFloat(months).toFixed(0)} mons.` : `~ ${parseFloat(months*30).toFixed(0)} days`
			: ''

			str = str.length === 0 ? '  Are you kidding me? x_x' : str
		}

		return str
	}

    const updateUserDetails = () => {

        const insurance = {
            aadhar: data.user.aadhar.replace(/ /g, ''),
            location: {
                lat: data.location.lat,
                lon: data.location.lon
            },
            interval: data.insurance.interval
        }

        axios.post('http://localhost:5000/user/details', {insurance}, { headers: { Authorization: user.token } })
            .then(res => {
                if(res.data.user) updateUser(res.data.user)
            })
            .catch(err => console.log(err.response.data))
	}

	const personalDetails = () => {
        return (
            <div className="personal-details">
                <label>Name</label>
                <input type="text" defaultValue={user.name}
                    onChange={event => updateData('name', event.target.value) } />
                <label>Aadhar Number</label>
                <input type="text"
                    value={data.user.aadhar}
                    onChange={event => updateData('aadhar', event.target.value) } />
            </div>
        )
    }

    const getLocation = () => {
        if(navigator.geolocation) navigator.geolocation.getCurrentPosition(pos => {
            updateData('lat', pos.coords.latitude)
            updateData('lon', pos.coords.longitude)

            console.log(data)
        })
        else updateData('info', ' Geolocation API is not available.')
    }

    const locationDetails = () => {
        return (
            <div className="location-details">
                <div className="locate" onClick={() => getLocation()} >
                    <span>Locate</span>
                </div>
                <label>Latitude</label>
                <input type="text"
                    value={data.location.lat}
                    onChange={event => updateData('lat', event.target.value) } />
                <label>Longitude</label>
                <input type="text"
                    value={data.location.lon}
                    onChange={event => updateData('lon', event.target.value) } />
            </div>
        )
    }

    const insuranceDetails = () => {
        return (
            <div className="insurance-details">
                <label>Insurance Interval [months]</label>
                <input type="number" defaultValue={data.insurance.interval}
                    onChange={event => {
                        updateData('interval', event.target.value ? parseInt(event.target.value) : 0)
                        setReadable(getReadable(event.target.value))
                    }} />
                <span className="readable">{readable}</span>
            </div>
        )
    }

    const renderSubmitButton = () => <div className={`submit${data.insurance.interval === 0 || data.insurance.interval >= 1212 ? ' disabled' : ''}`}
                                            disabled={data.insurance.interval === 0 || data.insurance.interval >= 1212}
                                            onClick={() => updateUserDetails()} >SUBMIT</div>
    const renderNextButton = () => <div className="next"
                                            onClick={() => setForm(form === 'user' ? 'location'
                                                                    : form === 'location' ? 'insurance'
                                                                    : '' )} >NEXT</div>

    return (
        <div className='initial-form' >
            <div className="heading">Let's get started</div>
            <div className="info">
                <InfoIcon />
                {
                    form === 'user' ? 'Personal details.'
                    : form === 'location' ? "What's your location?" + data.location.info
                    : form === 'insurance' ? "What's the PayPremium interval?"
                    : ''
                }
            </div>

            {
                form === 'user' ? personalDetails()
                : form === 'location' ? locationDetails()
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
