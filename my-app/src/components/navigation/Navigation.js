import React from 'react';
import axios from 'axios';

export default class Navigation extends React.Component {
    constructor() {
        super();
        this.state = {
            countries: [],
            
        }
        this.changeCountry = this.changeCountry.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
    }

    async componentDidMount() {
        const countries =
            (await axios.get('https://calendarific.com/api/v2/countries?api_key=894adeb97bdc486a8f4dea8490e11eb1b6c86785')).data;
        
        
        this.setState((state) => {
            state.countries = countries.response.countries;
            return state;
        })
    }

    changeCountry(e) {
        const newCountry = this.state.countries.find(country => country.country_name === e.target.value);
        if(newCountry){
            this.props.onCountryChange(newCountry["iso-3166"]);
        }
        
    }

    changeDescription(e) {
        const newHoliday = this.props.holidays.find(holiday => holiday.name === e.target.value);
        if(newHoliday){
            this.props.onDescriptionChange(newHoliday);
        }
    }

    render() {
        const countryId = this.props.holidays[0] ? this.props.holidays[0].country.id : this.props.activeCountry.country;
        return (
            <div className="navigation">
                <div>
                <img src={`https://www.countryflags.io/${countryId}/shiny/32.png`} alt={`${this.props.activeCountry.country}`} />
                {this.props.description}
                </div>
                <p>
                    <label>
                        Выберите страну:
                    <input
                            type="text"
                            list="select_countries"
                            id="selected_countries"
                            onInput={this.changeCountry}
                            placeholder={this.props.activeCountry.name}
                        />
                    
                    </label>
                    <datalist id="select_countries">
                        {this.state.countries.map((country) => (
                            <option value={country.country_name} key={country.uuid} ></option>   
                        ))}
                    </datalist>
                </p>
                <p>
                    <label>
                        Выберите праздник в {this.props.date.getFullYear()} году:
                    <input
                            type="text"
                            list="select_holiday"
                            onInput={this.changeDescription}
                            id="selected_holiday"
                        />
                    </label>
                    <datalist id="select_holiday">
                        {this.props.holidays.map((holiday) => (
                            <option value={holiday.name} key={holiday.name}></option>
                        ))}
                    </datalist>
                </p>
            </div>
        )
    }
}