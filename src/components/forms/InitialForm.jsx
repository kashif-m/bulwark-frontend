
import React, {useState, useEffect} from 'react'
import axios from 'axios'

// SVG
import InfoIcon from '../../assets/images/info.svg'
import CrossIcon from '../../assets/images/cross.svg'

const InitialForm = props => {

    const [user, updateUser] = props.user
    const [form, setForm] = useState('user')
    const [err, setErr]   = useState(false)
    const [wait, setWait] = useState(false)
    const [readable, setReadable] = useState({interval: '2 years', coverage: 'INR'})
    const [data, setData] = useState({
        user: {
            name: user.name,
            aadhar: ''
        },
        location: {
            lat: '',
            lon: '',
            info: '',
            surveyNo: ''
        },
        insurance: {
            interval: 24,
            coverage: '10000'
        }
    })

    const updateData = (key, value) => {
        const temp = {...data}

        if (key === 'aadhar') {
            const _value = value.replace(/ /g, '')
            if(isNaN(_value)) return
            if(_value.length > 12) return
            if (_value.length > 0
                && _value.length % 4 === 0
                && _value.length !== 12
                && value.length > temp[form][key].length )
                temp[form][key] = value + ' '
            else if(_value.length % 4 === 0 && _value.length < 12)
                temp[form][key] = value.slice(0, value.length - 1)
            else temp[form][key] = value
        } else if(form === 'location') {
            if(isNaN(value)) return
            temp[form][key] = value
        } else if(key === 'interval') {
            if(value.toString().length > 4) return
            else if(value.to)
            console.log(value)
            temp[form][key] = value
        } else if(key === 'name') {
            const _temp = {...user}
            const _value = value.length > 0 ? value : 'Mate'
            _temp.name = _value
            updateUser(_temp)
            temp[form][key] = _value
        }
        else temp[form][key] = value

        setData(temp)
    }

	const getReadable = (key, value) => {
        let str
        if(key === 'coverage') {
            str = 'INR'
        } else if(key === 'interval') {

            let years, months
            if(value.length === 0) str = ''
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
        }

		return str
	}

    const updateUserDetails = () => {

        const {lat, lon, surveyNo} = data.location
        const {coverage, interval} = data.insurance
        const insurance = {
            aadhar: data.user.aadhar.replace(/ /g, ''),
            location: {
                lat,
                lon
            },
            interval,
            surveyNo,
            coverage,
            name: data.user.name
        }

        axios.post('http://localhost:5000/user/details', {insurance}, { headers: { Authorization: user.token } })
            .then(res => {
                if(res.data.user) updateUser(res.data.user)
            })
            .catch(err => {
                if(err.response) {
                    console.log(err.response.data)
                    if(err.response.data.msg) setErr(err.response.data.msg)
                    const param = Object.keys(err.response.data.err)[0]
                    const _form = param.match(/(aadhar|name)/i) ? 'user'
                                    : param.match(/(survey|location)/i) ? 'location'
                                    : param.match(/(interval|coverage)/i) ? 'insurance'
                                    : form
                    setForm(_form)
                }
            })
            .finally(() => setWait(false))
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

                <label>Survey Number</label>
                <input type="text"
                    value={data.location.surveyNo}
                    onChange={event => updateData('surveyNo', event.target.value)} />
            </div>
        )
    }

    const insuranceDetails = () => {
        return (
            <div className="insurance-details">

                <div className="interval">
                    <label>Insurance Interval</label>
                    <input type="number" value={data.insurance.interval}
                        onChange={event => {
                            updateData('interval', event.target.value)
                            setReadable({
                                interval: getReadable('interval', event.target.value),
                                coverage: readable.coverage
                            })
                        }} />
                    <span className="readable">{readable.interval}</span>
                </div>
                <div className="coverage">
                    <label>Coverage Amount</label>
                    <input type="number" value={data.insurance.coverage}
                        onChange={e => {
                            updateData('coverage', e.target.value)
                            setReadable({
                                coverage: getReadable('coverage', event.target.value),
                                interval: readable.interval
                            })
                        }} />
                    <span className="readable">{readable.coverage}</span>
                </div>
            </div>
        )
    }

    const renderSubmitButton = () => <div className={`submit${data.insurance.interval === 0 || data.insurance.interval >= 1212 ? ' disabled' : ''} ${wait}`}
                                            disabled={data.insurance.interval === 0 || data.insurance.interval >= 1212 || wait !== false}
                                            onClick={() => {
                                                setWait('loading')
                                                updateUserDetails()
                                            }} >{wait ? 'Loading ...' : 'Submit'}</div>
    const renderPrevButton = () => <div className="prev"
                                            onClick={() => setForm(form === 'location' ? 'user'
                                                                    : form === 'insurance' ? 'location'
                                                                    : '' )}>Previous</div>
    const renderNextButton = () => <div className="next"
                                            onClick={() => setForm(form === 'user' ? 'location'
                                                                    : form === 'location' ? 'insurance'
                                                                    : '' )} >Next</div>

    return (
        <div className='initial-form' >
            <div className="heading">Let's get started</div>
            <div className="info">
                <InfoIcon />
                {
                    form === 'user' ? 'Personal details.'
                    : form === 'location' ? "What's your location?" + data.location.info
                    : form === 'insurance' ? "Let's talk business."
                    : ''
                }
            </div>

            {
                err ? <div className='err' onClick={() => setErr(false)} > {err} <CrossIcon /> </div>
                : <div className='err none' > </div>
            }

            {
                form === 'user' ? personalDetails()
                : form === 'location' ? locationDetails()
                : form === 'insurance' ? insuranceDetails()
                : ''
            }

            <div className="buttons">
                { form !== 'user' ? renderPrevButton() : <div></div> }
                {
                    form === 'insurance'
                    ? renderSubmitButton()
                    : renderNextButton()
                }
            </div>
        </div>
    )
}

export default InitialForm
