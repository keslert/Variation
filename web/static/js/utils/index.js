import React        from 'react';
import fetch        from 'isomorphic-fetch';
import { polyfill } from 'es6-promise';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function buildHeaders() {
  const authToken = localStorage.getItem('phoenixAuthToken');//.replace('a', 'b');
  return { ...defaultHeaders, Authorization: authToken };
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function getRandomImage() {
  return `https://unsplash.it/600/600?image=${_.random(0, 1000)}`;
}

export function constrain(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function parseJSON(response) {
  return response.json();
}

export function httpGet(url) {

  return fetch(url, {
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPost(url, data) {
  const body = JSON.stringify(data);

  return fetch(url, {
    method: 'post',
    headers: buildHeaders(),
    body: body,
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpDelete(url) {
  return fetch(url, {
    method: 'delete',
    headers: buildHeaders(),
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function setDocumentTitle(title) {
  document.title = `${title} | Variation Driven Design`;
}

export function renderErrorsFor(errors, ref) {
  if (!errors) return false;

  return errors.map((error, i) => {
    if (error[ref]) {
      return (
        <div key={i} className="error">
          {error[ref]}
        </div>
      );
    }
  });
}

export function weightedRandom(weights) {
  let sum = Math.floor(_.sum(weights));
  let random = _.random(0, sum);
  for(let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if(random <= 0) {
      return i;
    }
  }
}

export function chunkText(text) {
  return text.split(' ').map((word) => {
    return {
      text: word.replace('~', '').trim(),
      important: word.includes('~')
    }
  })
}
