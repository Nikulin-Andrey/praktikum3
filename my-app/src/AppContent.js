import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navigation from './components/navigation/Navigation';
import axios from 'axios';


export default class AppContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      dateChanged: new Date(),
      activeCountry: {},
      holidays: [],
      description: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onChangedView = this.onChangedView.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
  }

  async componentDidMount() {

    const activeCountry =
      (await axios.get('https://get.geojs.io/v1/ip/country.json')).data
    const holidays =
      (await axios.get(
        `https://calendarific.com/api/v2/holidays?&api_key=894adeb97bdc486a8f4dea8490e11eb1b6c86785&
         country=${activeCountry.country}
         &year=${this.state.date.getFullYear()}
      `)).data
    this.setState((state) => {
      state.activeCountry = activeCountry;
      state.holidays = holidays.response.holidays;
      return state;
    })
  }

  onChange(date) {
    console.log(this.state.holidays)
    const holiday = this.state.holidays.find(holiday => {
      return holiday.date.datetime.year === date.getFullYear() &&
        holiday.date.datetime.month === date.getMonth() + 1 &&
        holiday.date.datetime.day === date.getDate();
    }
    );
    console.log(date.toLocaleDateString(), holiday)
    if (holiday) {
      this.changeDescription(holiday);
    }
    this.setState({ date })
  }

  async onChangedView({ activeStartDate }) {
    if (this.state.holidays[0].date.datetime.year !== activeStartDate.getFullYear()) {
      const holidays =
        (await axios.get(
          `https://calendarific.com/api/v2/holidays?&api_key=894adeb97bdc486a8f4dea8490e11eb1b6c86785&
            country=${this.state.activeCountry.country}
            &year=${activeStartDate.getFullYear()}
          `)).data
      this.setState({
        dateChanged: activeStartDate,
        holidays: holidays.response.holidays
      });
    }
  }

  async changeCountry(country) {
    const holidays =
      (await axios.get(
        `https://calendarific.com/api/v2/holidays?&api_key=894adeb97bdc486a8f4dea8490e11eb1b6c86785&
         country=${country}
         &year=${this.state.date.getFullYear()}
      `)).data
    console.log(holidays)
    this.setState({
      holidays: holidays.response.holidays
    })
  }

  changeDescription(holiday) {
    const descript = (
      <div>
        <h3>{holiday.name}</h3>
        <p>{holiday.description}</p>
        <p>{holiday.date.iso}</p>
      </div>
    )
    this.setState({
      description: descript
    })
  }

  render() {
    return (
      <div className="appContent">
        <Calendar
          onClickDay={this.onChange}
          value={this.state.date}
          view="month"
          onActiveStartDateChange={this.onChangedView}
        />
        <Navigation
          date={this.state.dateChanged}
          holidays={this.state.holidays}
          description={this.state.description}
          activeCountry={this.state.activeCountry}
          onCountryChange={this.changeCountry}
          onDescriptionChange={this.changeDescription}
        />

      </div>
    )
  }
}
