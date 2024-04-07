/*** Asynchronously loads contacts, sorts them by name, and renders the contacts on the page.
 * @return {Promise<void>}*/
async function loadContacts(){
  try {
      loadedContacts = JSON.parse(await getItem('loadedContacts')) || [];
  } catch(e){
      console.error('Loading error:', e);
  }
  loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
  renderContacts();
  renderContactsMobile();
  setActivePage4();
}

/* Render the contacts list on the overlay.*/
function renderContacts() {
  overlay = document.getElementById('contactlist');
  overlay.innerHTML = '';
  let currentLetter = null;
  for (let i = 0; i < loadedContacts.length; i++) {
    let contact = loadedContacts[i];
    let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    let backgroundColor = contact.color;
    initialsAlphabet(initials, currentLetter, overlay);
    overlay.innerHTML += `<div id="contact-card-container-${i}" class="contact-card-container" onclick="handleContactClick(${i})">${renderContactsHTMLTemplate(i, backgroundColor, initials, contact)}</div>`;
  }
}
/* Handles the click event for a contact card, toggling the active class based on the index.
 * @param {number} index - The index of the contact card to be handled*/
function handleContactClick(index) {
  const contactContainers = document.querySelectorAll('.contact-card-container');
  contactContainers.forEach((container, i) => {
    if (i === index) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
}

/**
 * Function to update alphabet tab based on initials.
 *
 * @param {string} initials - The initials to check
 * @param {string} currentLetter - The current letter being checked
 * @param {HTMLElement} overlay - The HTML element to append the alphabet tab to*/
function initialsAlphabet(initials, currentLetter, overlay) {
  if (initials.charAt(0) !== currentLetter) {
    currentLetter = initials.charAt(0);
    overlay.innerHTML += `<div id="alphabet-tab">${currentLetter}</div>`;
  }
}

/* Renders the contacts for the mobile view.*/
function renderContactsMobile() {
  overlay = document.getElementById('contactlist-mobile');
  overlay.innerHTML = '';
  overlay.innerHTML += '<div id="adding-overlay-mobile"></div><img id="add-person-btn-mobile" src="./img/person_add.png" onclick="setNewContactMobile()">'
  let currentLetter = null; 
  for (let i = 0; i < loadedContacts.length; i++) {
    let contact = loadedContacts[i];
    let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
    let backgroundColor = contact.color; 
    initialsAlphabetMobile(initials, currentLetter, overlay);
    overlay.innerHTML += renderContactsMobileHTMLTemplate(i, backgroundColor, initials, contact);
  }
}

/**
 * Generates alphabet tabs for mobile based on the initials and current letter.
 *
 * @param {string} initials - The initials to compare with the current letter.
 * @param {string} currentLetter - The current letter to compare with the initials.
 * @param {HTMLElement} overlay - The overlay element to append the alphabet tab to.
 * @return {void} 
 */
function initialsAlphabetMobile(initials, currentLetter, overlay) {
  if (initials.charAt(0) !== currentLetter) {
    currentLetter = initials.charAt(0);
    overlay.innerHTML += `<div id="alphabet-tab-mobile">${currentLetter}</div>`;
  }
}

/* * Displays contact details in the right container.
 * @param {number} i - Index of the contact to display*/
function showContactDetails(i) {
  let overlay = document.getElementById('container-right-content');
  let contact = loadedContacts[i];
  let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  let backgroundColor = contact.color;
  overlay.innerHTML = showContactDetailsHTMLTemplate(backgroundColor, initials, contact, i);
}

/*Show contact details on the mobile interface.
 ** @param {number} i - The index of the contact to display */
function showContactDetailsMobile(i) {
  let overlayMobile = document.getElementById('container-right-mobile');
  overlayMobile.classList.remove('d-none');
  let contact = loadedContacts[i];
  let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  let backgroundColor = contact.color;
  overlayMobile.innerHTML = showContactDetailsMobileHTMLTemplate (backgroundColor, initials, contact, i);
}

/* Closes the mobile details by adding the 'd-none' class to the mobileDetails element.
 * @param {} 
 * @return {}*/
function closeMobileDetails(){
  let mobileDetails = document.getElementById('container-right-mobile');
  mobileDetails.classList.add('d-none');
}

/*** Generates a random color in hexadecimal format.
 * @return {string} The randomly generated color in hexadecimal format.*/
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/** Edit a contact and display an editing overlay.
 * @param {number} i - The index of the contact to edit
 * @return {void} 
 */
function editContact(i) {
  let overlay = document.getElementById('editing-overlay');
  overlay.classList.remove('d-none');
  let contact = loadedContacts[i];
  let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  let backgroundColor = contact.color;
  overlay.innerHTML = editContactHTMLTemplate(backgroundColor, initials, contact, i);
}

/*** Edit a mobile contact and update the editing overlay.
 * @param {number} i - The index of the contact to edit*/
function editMobileContact(i) {
  let overlay = document.getElementById('editing-overlay-mobile');
  overlay.classList.remove('d-none');
  let contact = loadedContacts[i];
  let initials = contact.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  let backgroundColor = contact.color;
  overlay.innerHTML =editMobileContactHTMLTemplate(backgroundColor, initials, contact, i);
}

/** Save the changes made to a contact and update the contact list.
 * @param {number} i - The index of the contact to be edited*/
function saveContactChanges(i) {
  if (validateEditContactInput()) {
      let editedName = document.getElementById('edit-input-name').value;
      let editedEmail = document.getElementById('edit-input-mail').value;
      let editedPhone = document.getElementById('edit-input-number').value;
      let overlay = document.getElementById('contact-overlay');
      loadedContacts[i].name = editedName;
      loadedContacts[i].email = editedEmail;
      loadedContacts[i].phone = editedPhone;
      overlay.innerHTML = '';
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      setItem('loadedContacts', JSON.stringify(loadedContacts));
      renderContacts();
      renderContactsMobile();
      closeEdit();
      playAnimation();
}
}

/*** Save changes for a contact in the mobile view.
 * @param {number} i - index of the contact to be edited
 * @return {void} */
function saveContactChangesMobile(i) {
  if (validateEditMobileContactInput()) {
      let editedName = document.getElementById('edit-contact-input-name-mobile').value;
      let editedEmail = document.getElementById('edit-contact-input-mail-mobile').value;
      let editedPhone = document.getElementById('edit-contact-input-number-mobile').value;
      let overlay = document.getElementById('editing-overlay-mobile');
      loadedContacts[i].name = editedName;
      loadedContacts[i].email = editedEmail;
      loadedContacts[i].phone = editedPhone;
      setItem('contacts', JSON.stringify(loadedContacts));
      overlay.innerHTML = '';
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      setItem('loadedContacts', JSON.stringify(loadedContacts));
      setItem('loadedContacts', JSON.stringify(loadedContacts));
      renderContacts();
      renderContactsMobile();
      closeEditMobile();
      closeMobileDetails();
      playAnimation();
  }
}

  /* * Function to play an animation.*/
  function playAnimation() {
    const animationBox = document.getElementById('animation-box');
    animationBox.style.display = 'block';
    animationBox.style.animation = 'fadeInOut 1s ease-in-out';
    let animate = document.getElementById('animation-box');
    animate.innerHTML = '<p id="success">Success</p>';
    setTimeout(() => {
        animationBox.style.display = 'none';
        animationBox.style.animation = '';
    }, 1000);
}

/** Closes the edit overlay and re-renders the contacts.*/
function closeEdit(){
  let editoverlay = document.getElementById('editing-overlay');
  editoverlay.classList.add('d-none');
  renderContacts();
}

/*** Closes the mobile edit overlay and renders the mobile contacts*/
function closeEditMobile(){
  let editoverlay = document.getElementById('editing-overlay-mobile');
  editoverlay.classList.add('d-none');
  renderContactsMobile();
}

/** Closes the new contact overlay on mobile.*/
function closeNewContactOverlayMobile(){
  let editoverlay = document.getElementById('add-new-contact-mobile');
  editoverlay.classList.add('d-none');
  renderContactsMobile();
}

/*** Sets a new contact using the provided index.
 * @param {number} i - The index of the new contact
 * @return {void} */
function setNewContact(i) {
  let overlay = document.getElementById('editing-overlay');
  overlay.classList.remove('d-none');
  overlay.innerHTML = setNewContactHTMLTemplate();
}

/** Sets a new contact's mobile information.
* @param {type} i - description of parameter
 * @return {type} description of return value*/
function setNewContactMobile(i) {
  let overlay = document.getElementById('adding-overlay-mobile');
  overlay.classList.remove('d-none');
  overlay.innerHTML = setNewContactMobileHTMLTemplate();
}

/*** Saves a new contact by validating input, creating a new contact object, adding it to the loadedContacts array, sorting the array, and updating the local storage. Finally, it renders the contacts, closes the edit form, and plays an animation.
 * @param {} 
 * @return {} */
function saveNewContact(){
  let randomColor = getRandomColor();
  if (validateNewContactInput()) {
  let newContact = {
    'name': document.getElementById('new-contact-input-name').value,
    'email': document.getElementById('new-contact-input-mail').value,
    'phone': document.getElementById('new-contact-input-number').value,
    'color': randomColor
  };
  loadedContacts.push(newContact);
  loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
  setItem('loadedContacts', JSON.stringify(loadedContacts));
  renderContacts();
  renderContactsMobile();
  closeEdit();
  playAnimation();
}
}

/*** Save a new mobile contact if the input passes validation.
 * @return {undefined} This function does not return a value.*/
function saveNewContactMobile() {
  let randomColor = getRandomColor();
  if (validateNewMobileContactInput()) {
      let newContact = {
          'name': document.getElementById('new-contact-input-name-mobile').value,
          'email': document.getElementById('new-contact-input-mail-mobile').value,
          'phone': document.getElementById('new-contact-input-number-mobile').value,
          'color': randomColor
        };
      loadedContacts.push(newContact);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      setItem('loadedContacts', JSON.stringify(loadedContacts));
      setItem('contacts', JSON.stringify(loadedContacts));
      renderContacts();
      renderContactsMobile();
      closeEdit();
      playAnimation();
    }
  }


/** Deletes a contact at the specified index.* @param {number} i - The index of the contact to be deleted
 * @return {void} */
function deleteContact(i) {
  let overlay = document.getElementById('contact-overlay');
  loadedContacts.splice(i, 1);
  setItem('loadedContacts', JSON.stringify(loadedContacts));
  setItem('contacts', JSON.stringify(loadedContacts));
  overlay.innerHTML=``;
  renderContacts();
  closeEdit();
  playAnimation();
}

/*** Deletes a contact from the loadedContacts array at the specified index, updates the local storage items, clears the overlay, and triggers various UI updates and animations.
 * @param {number} i - The index of the contact to be deleted from the loadedContacts array
 * @return {void} */
function deleteContactMobile(i) {
  let overlay = document.getElementById('adding-overlay-mobile');
  loadedContacts.splice(i, 1);
  setItem('loadedContacts', JSON.stringify(loadedContacts));
  setItem('contacts', JSON.stringify(loadedContacts));
  overlay.innerHTML=``;
  renderContactsMobile();
  closeEditMobile();
  closeMobileDetails();
  playAnimation();
}

/*** Opens a popup window by removing the 'd-none' class and adding the 'd-flex' class to the popup container element.*/
function openPopup() {
  let popup = document.getElementById('popup-window-container');
  popup.classList.remove('d-none');
  popup.classList.add('d-flex');
}

/*** Closes the popup window by adding 'd-none' class and removing 'd-flex' class.*/
function closePopup() {
  let popup = document.getElementById('popup-window-container');
  popup.classList.add('d-none');
  popup.classList.remove('d-flex');
}

/*** Function to open or close a popup window container based on its current state.
 * * @param {} 
 * @return {}*/
function openOrClose() {
  let popup = document.getElementById('popup-window-container');

  if (popup.classList.contains('d-none')) {
    openPopup();
  } else {
    closePopup();
  }
}

/*** Validates the contact input by checking if name, email, and phone are not empty after trimming whitespace.
 * @param {string} name - The name to be validated
 * @param {string} email - The email to be validated
 * @param {string} phone - The phone number to be validated
 * @return {boolean} Indicates whether the contact input is valid or not*/
function validateContactInput(name, email, phone) {
  return name.trim() !== '' && email.trim() !== '' && phone.trim() !== '';
}

/* Validates the input for a new contact.
 * @return {type} the result of validating the contact input*/
function validateNewContactInput() {
  let name = document.getElementById('new-contact-input-name').value;
  let email = document.getElementById('new-contact-input-mail').value;
  let phone = document.getElementById('new-contact-input-number').value;
  return validateContactInput(name, email, phone);
}

/*** Validates the input for a new mobile contact.
 * @return {boolean} the result of the validation*/
function validateNewMobileContactInput() {
  let name = document.getElementById('new-contact-input-name-mobile').value;
  let email = document.getElementById('new-contact-input-mail-mobile').value;
  let phone = document.getElementById('new-contact-input-number-mobile').value;
  return validateContactInput(name, email, phone);
}

/*** Validates the input for editing a contact.
 * @return {boolean} the result of validating the contact input*/
function validateEditContactInput() {
  let editedName = document.getElementById('edit-input-name').value;
  let editedEmail = document.getElementById('edit-input-mail').value;
  let editedPhone = document.getElementById('edit-input-number').value;
  return validateContactInput(editedName, editedEmail, editedPhone);
}

/** Validates the input for editing a mobile contact.
 * @return {boolean} The result of validating the contact input.*/
function validateEditMobileContactInput() {
  let editedName = document.getElementById('edit-contact-input-name-mobile').value;
  let editedEmail = document.getElementById('edit-contact-input-mail-mobile').value;
  let editedPhone = document.getElementById('edit-contact-input-number-mobile').value;
  return validateContactInput(editedName, editedEmail, editedPhone);
}
