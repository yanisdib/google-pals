import useInput from "../../../../hooks/useInput";
import PropTypes from "prop-types";
import moment from "moment";
import { useEffect, useState } from "react";
import { SingleDatePicker } from "react-google-flight-datepicker";
import {
  checkEmail,
  checkPassword,
  comparePassword,
} from "../../../../utils/form-controls";
import { useDispatch, useSelector } from "react-redux";
import { startGetCities } from "../../../../actions/cities";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const propTypes = {
  date: PropTypes.object,
  focused: PropTypes.bool,
  onDateChange: PropTypes.object,
};

const defaultProps = {
  dateFormat: "DD/MM/YYYY",
  invalid: false,
  disabled: false,
  cities: {},
};

function CreateAccountForm(props) {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.cities);

  const {
    value: firstName,
    bind: bindFirstName,
    reset: resetFirstName,
  } = useInput("");

  const {
    value: lastName,
    bind: bindLastName,
    reset: resetLastName,
  } = useInput("");

  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useInput("");

  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");

  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const {
    value: passwordBis,
    bind: bindPasswordBis,
    reset: resetPasswordBis,
  } = useInput("");

  const [country, setCountry] = useState("");
  const { value: city, bind: bindCity, reset: resetCity } = useInput("");
  const [iso, setIso] = useState("");
  const [birthdate, setBirthdate] = useState(moment().subtract(16, "years"));
  const [calendarFocused, setCalendarFocused] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  let isValidEmail = checkEmail(email);
  let isValidPassword = checkPassword(password);
  let hasMatchingPasswords = comparePassword(password, passwordBis);
  const maxYear = moment().format("YYYY") - 16;
  const calendarStyle = {
    border: "2px solid #ced4da",
  };

  useEffect(() => {
    if (iso !== "") {
      dispatch(startGetCities(iso));
    }
  }, [dispatch, iso]);

  const onCountryChange = async (e) => {
    const country = e.target.value;
    const selectedIso = e.target.options[e.target.selectedIndex].dataset.iso;
    setCountry(country);
    setIso(selectedIso);
  };

  const onDateChange = (birthdate) => {
    if (birthdate) {
      setBirthdate(birthdate);
    }
  };

  const onFocusChange = ({ focused }) => {
    setCalendarFocused(focused);
  };

  function renderCountriesList() {
    const countries = props.countries;
    return countries.map((country, i) => (
      <option
        key={`${country.key}-${i}`}
        value={country.value}
        data-iso={country.iso_a3.toLowerCase()}
      >
        {country.value}
      </option>
    ));
  }

  /**
   * Renders multiple options of cities
   * Results depend on country selected
   */
  function renderCitiesList() {
    return cities.map((city) => (
      <option key={`${city.key}`} value={city.value} data-iso={city.iso_a2}>
        {city.value}
      </option>
    ));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorForm("Please provide valid email and password");
    } else {
      if (isValidEmail && isValidPassword && hasMatchingPasswords) {
        props.onSubmit({
          firstName,
          lastName,
          username,
          birthdate: birthdate.format("DD/MM/YYYY"),
          email,
          password,
          country,
          city,
        });
        setErrorForm("");
        setErrorEmail("");
        setErrorPassword("");
        setErrorPassword("");
        setCountry("");
        setIso("");
        resetFirstName();
        resetLastName();
        resetUsername();
        resetPassword();
        resetPasswordBis();
        resetEmail();
        resetCity();
        console.log("User successfully created!");
      } else if (!isValidEmail) {
        setErrorEmail("Please provide a valid email");
      } else if (!isValidPassword) {
        setErrorPassword("Please provide a valid password");
      }
    }
  };

  return (
    <>
      <form id="createAccountForm" className="mt-4" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="col">
            <label htmlFor="firstNameInput">First name</label>
            <input
              type="text"
              id="firstNameInput"
              className="form-control"
              placeholder="John"
              {...bindFirstName}
            />
            <small id="nameDetail">Your name won't be displayed</small>
          </div>
          <div className="col">
            <label htmlFor="lastNameInput">Last name</label>
            <input
              type="text"
              id="lastNameInput"
              className="form-control"
              placeholder="Doe"
              {...bindLastName}
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="birthdateInput">Birthdate</label>
          <br />
          <SingleDatePicker
            date={birthdate}
            startDatePlaceholder="Date"
            startDate={moment().subtract(28, "years")}
            maxDate={new Date(maxYear, 12, 31)}
            onDateChange={onDateChange}
            focused={calendarFocused}
            onFocusChange={onFocusChange}
            numberOfMonths={0}
            isOutsideRange={() => false}
            dateFormat={"DD/MM/YYYY"}
            singleCalendar={true}
            id="birthdateInput"
            style={calendarStyle}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="usernameInput">Username</label>
          <input
            type="text"
            id="usernameInput"
            className="form-control"
            placeholder="Username"
            {...bindUsername}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="emailInput">Email</label>
          <div className="form-row">
            <div className="col-11">
              <input
                type="email"
                id="emailInput"
                className="form-control"
                placeholder="Enter your email address"
                {...bindEmail}
              />
            </div>
            <div className="d-flex col-1 align-items-center">
              {isValidEmail ? (
                <CheckCircleIcon className="green" fontSize="small" />
              ) : (
                <CancelIcon className="red" fontSize="small" />
              )}
            </div>
          </div>
          <small id="emailHelp" className="red">
            {errorEmail}
          </small>
        </div>
        <div className="form-group mt-3">
          <div className="form-row">
            <div className="col-6">
              <label htmlFor="passwordInput">Password</label>
              <input
                type="password"
                id="passwordInput"
                className="form-control"
                placeholder="Password"
                {...bindPassword}
              />
            </div>
            <div className="col-6">
              <label htmlFor="passwordConfirmationInput">
                Confirmation
              </label>
              <input
                type="password"
                id="passwordConfirmationInput"
                className="form-control"
                placeholder="Password again"
                {...bindPasswordBis}
              />
            </div>
          </div>
          <small id="passwordDetail">
            Use at least height characters using alphanumeric characters and symbols
          </small>
          <small id="passwordHelp" className="red">
            {hasMatchingPasswords ? "" : errorPassword}
          </small>
        </div>
        <div className="form-row">
          <div className="col">
            <label htmlFor="countryInput">Country</label>
            <select
              name="country"
              id="countrySelect"
              className="form-control"
              onChange={onCountryChange}
            >
              <option value="">Select your country</option>
              {renderCountriesList()}
            </select>
          </div>
          <div className="col">
            <label htmlFor="lastNameInput">City</label>
            <select
              name="city"
              id="citySelect"
              className="form-control"
              {...bindCity}
            >
              <option value="">Select your city</option>
              {renderCitiesList()}
            </select>
          </div>
        </div>
        <br />
        <small id="formHelp" className="red">
          {errorForm}
        </small>
        <div className="form-group mt-2">
          <input
            type="submit"
            className="btn btn-primary"
            value="Create an account"
          />
        </div>
      </form>
    </>
  );
}

CreateAccountForm.propTypes = propTypes;
CreateAccountForm.defaultProps = defaultProps;

export default CreateAccountForm;