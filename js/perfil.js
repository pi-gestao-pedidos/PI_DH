const profileData = document.getElementsByTagName('p');
const profileForm = document.forms[0];

const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g; 
const telRegex = /(\(?\d{2}\)?\s)(\d{4,5}\-?\d{4})/g;

profileForm.onsubmit = function (event) { event.preventDefault() }