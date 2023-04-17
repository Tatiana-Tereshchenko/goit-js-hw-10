import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box')
const countryList  = document.querySelector('.country-list')
const countryInfo  = document.querySelector('.country-info')

searchBox.addEventListener('input', debounce(searchInput, DEBOUNCE_DELAY));

function searchInput(e) {
    const searchItem = e.target.value.trim();

    if (!searchItem) {
        clearInput()
        return
    }
    fetchCountries(searchItem).then(countries => {
        if (countries.length > 10) {
            Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
            clearInput();
        }
        else if (countries.length > 1) {
            renderCountryList(countries);
            clearInput(countryInfo);
        }
        else if (countries.length === 1) {
            renderCountryInfo(countries[0]);
            clearInput(countryList);
        }
        else {
            Notiflix.Notify.failure('Oops, there is no country with that name.');
            clearInput();
        }
    }).catch(error => {
        Notiflix.Notify.failure('Oops, please try again later.');
            console.error(error);
    })
}

function renderCountryList(countries) {
    const listEl = countries.map(country => {
        return `<li class="country-item">
              <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="75" height="50">
              <span class="text">${country.name.common}</span>
            </li>`;
    })
    countryList.innerHTML = `<ul>${listEl.join('')}</ul>`;
}

function renderCountryInfo(country) {
    const languages = Object.values(country.languages).join(', ');
  const html = `
    <div class="card">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="15%" height="15%">
      <div class="card-body">
        <h3 class="card-title">${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Languages:</strong> ${languages}</p>
      </div>
    </div>`;
  countryInfo.innerHTML = html;
}
function clearInput(element) {
  if (element) {
    element.innerHTML = '';
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}