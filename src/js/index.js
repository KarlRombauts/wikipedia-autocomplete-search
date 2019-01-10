import * as Rx from 'rxjs'
import {
  takeUntil,
  concatMap,
  throttleTime,
  retry,
  map,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators'
import axios from 'axios-observable'

const searchField = document.getElementById('search-field')
const autoComplete = document.getElementById('autocomplete')
const keyPress = Rx.fromEvent(searchField, 'keyup')

function appendAutoCompleteItem(container, string, url) {
  const item = `<li><a href="${url}">${string}</a></li>`
  container.appendChild(item)
}

keyPress
  .pipe(
    throttleTime(20),
    map(keyPress => searchField.value),
    filter(searchString => searchString.trim().length > 0),
    distinctUntilChanged(),
    switchMap(searchString => searchWiki(searchString)),
  )
  .subscribe(result => {
    console.log(result.data)
    let autoCompleteString = ''
    if (result.data) {
      console.log('here')
      zip(result.data[1], result.data[3], (string, url) => {
        autoCompleteString += `<li><a href="${url}" target="_blank">${string}</a></li>`
      })
      autoComplete.parentElement.classList.add('uk-open')
    }
    autoComplete.innerHTML = autoCompleteString
  })

keyPress.subscribe(event => {
  if (searchField.value.trim() == 0) {
    autoComplete.parentElement.classList.remove('uk-open')
  }
})

function searchWiki(string) {
  return axios
    .get(
      'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&format=json',
      {
        params: {
          search: string,
        },
      },
    )
    .pipe(retry(3))
}

searchWiki('Hello')

function zip(left, right, combinerFunction) {
  let counter,
    results = []
  for (counter = 0; counter < Math.min(left.length, right.length); counter++) {
    results.push(combinerFunction(left[counter], right[counter]))
  }
  return results
}
