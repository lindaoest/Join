function renderContactsHTMLTemplate(i, backgroundColor, initials, contact){
    return `
        <div id="contactcard-container" class="contact" onclick="showContactDetails(${i})">
            <div id="contact-cyrcle-div">
                <div style="background-color: ${backgroundColor};" id="contact-cyrcle">${initials}</div>
            </div>
            <div id="contact-details">
                <div id="contact-name">${contact.name}</div>
                <div id="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}

function renderContactsMobileHTMLTemplate(i, backgroundColor, initials, contact){
    return`
        <div id="contactcard-container-mobile" class="contact" onclick="showContactDetailsMobile(${i})" >
            <div id="contact-cyrcle-div">
                <div style="background-color: ${backgroundColor};" id="contact-cyrcle">${initials}</div>
            </div>
            <div id="contact-details">
                <div id="contact-name">${contact.name}</div>
                <div id="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}

function showContactDetailsHTMLTemplate(backgroundColor, initials, contact, i){
    return `
        <div id="contact-overlay">
        <div id="overlay-top-container">
            <div id="contact-cyrcle-div-overlay">
                <div id="contact-cyrcle-overlay" style="background-color: ${backgroundColor};">${initials}</div>
            </div>
            <div id="contact-mid-overlay">
                <div id="contact-name-overlay"> ${contact.name}</div>
                    <div id="edit-delete-div">
                        <div onclick="editContact(${i})" id="edit-div">Edit</div>
                        <div onclick="deleteContact(${i})" id="delete-div">Delete</div>
                    </div>
                </div>
            </div>
            <div id="heading-contact-information">Contact Information</div>
            <div id="overlay-bottom-container">
                <div id="contact-email-overlay"><div><b>Email</b></div><div id="email-div">${contact.email}</div></div>
                <div id="contact-telefon-overlay"><div><b>Phone</b></div><div id="telefon-div">${contact.phone}</div></div>
            </div>
        </div>
    `;
}

function showContactDetailsMobileHTMLTemplate (backgroundColor, initials, contact, i){
    return `
    <div id="popup-window-container" class="d-none">
        <div id="popup-btn-edit" onclick="editMobileContact(${i})"><img id="popup-img-edit" src="../img/edit.png"><p>Edit</p></div>
        <div id="popup-btn-delete" onclick="deleteContactMobile(${i})"><img id="popup-img-delete" src="../img/delete-subtask.svg"><p>Delete</p></div>
    </div>
    <div id="overlay-top-container-mobile">
        <button id="mobile-more-btn" onclick="openOrClose()"></button>
        <button id="close-mobile-details-btn" onclick="closeMobileDetails()"></button>
        <div id="heading-div-static-mobile">Contacts</div>
        <div id="text-div-static-mobile">Better with a team</div>
        <div id="contact-cyrcle-div-overlay-mobile">
            <div id="contact-cyrcle-overlay-mobile" style="background-color: ${backgroundColor};">${initials}</div>
            <div id="contact-name-overlay-mobile">${contact.name}</div>
        </div>
        <div id="heading-contact-information-mobile">Contact Information</div>
        <div id="overlay-bottom-container-mobile">
            <div id="contact-email-overlay-mobile"><b>Email</b><div id="email-div">${contact.email}</div></div>
            <div id="contact-telefon-overlay-mobile"><b>Phone</b><div id="telefon-div">${contact.phone}</div></div>
        </div>
    </div>
  `;
}

function editContactHTMLTemplate(backgroundColor, initials, contact, i){
    return `
    <div id="edit">
    <div id="editing-div-leftside">
        <div id="edit-overlay-logo">
        </div>
        <div id="edit-overlay-heading">Edit Contact
            <img id="vector5" src="../img/vector5vertical.png">
        </div>
    </div>
    <div id="editing-div-rightside">
        <div id="close-edit" onclick="closeEdit()">
        </div>
        <div id="cyrcle-and-inputs-div">
            <div id="edit-cyrcle-overlay" style="background-color: ${backgroundColor};">${initials}
            </div>
            <div id="edit-content-rightside">
                <form onsubmit="saveContactChanges(${i}); return false;">
                    <div id="edit-inputs">
                        <div id="empty-fields-message"></div>
                        <input id="edit-input-name" type="text" value="${contact.name}" required>
                        <input id="edit-input-mail" type="email" value="${contact.email}" required>
                        <input id="edit-input-number" type="number" value="${contact.phone}" required>
                    </div>
                    <div id="save-delete-div">
                            <button type="submit" id="save-btn-edit">Save</button>
                            <img id="check-icon" src="../img/check.png">
                            <button onclick="deleteContact(${i})" id="delete-btn-edit">Delete</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

    `
};

function editMobileContactHTMLTemplate(backgroundColor, initials, contact, i){
    return `
      <div id="edit-mobile">
    <div id="edit-contact-div-top-mobile">
        <div id="new-contact-overlay-heading-mobile">
            <h1 id="static-heading-edit-mobile">Edit contact</h1>
            <p id="new-contact-text">Tasks are better with a team!</p>
            <img id="vector5-for-new-mobile" src="../img/vector5vertical.png">
        </div>
    </div>   
    <div id="editing-div-bottom-mobile">
        <div id="close-edit-mobile-btn" onclick="closeEditMobile()">
        </div>
        <form onsubmit="saveContactChangesMobile(${i}); return false;">
            <div id="cyrcle-and-inputs-div-mobile">
                <div id="edit-cyrcle-overlay-mobile" style="background-color: ${backgroundColor};">${initials}</div>
            </div>
            <div id="edit-content-bottom-mobile">
                <div id="edit-inputs-mobile">
                    <div id="empty-fields-message"></div>
                    <input id="edit-contact-input-name-mobile" placeholder="Name" type="text" value="${contact.name}" required>
                    <input id="edit-contact-input-mail-mobile" placeholder="Email" type="email" value="${contact.email}" required>
                    <input id="edit-contact-input-number-mobile" placeholder="Phone" type="text" value="${contact.phone}" required>
                </div>
                <div id="save-delete-div-mobile">
                    <button type="submit" id="save-btn-edit">Save</button>
                    <img id="check-icon" src="../img/check.png">
                    <button onclick="deleteContact(${i})" id="delete-btn-edit-mobile">Delete</button>
                    </div>
            </div>
        </form>
    </div>
</div>

    `
};

function setNewContactHTMLTemplate(){
    return `
    <div id="edit">
    <div id="editing-div-leftside">
        <div id="edit-overlay-logo"></div>
        <div id="new-contact-overlay-heading">
            <h1 id="static-heading-add">Add contact</h1>
            <p id="new-contact-text">Tasks are better with a team!</p>
            <img id="vector5-for-new" src="../img/vector5vertical.png">
        </div>
    </div>
    <div id="editing-div-rightside">
        <div id="close-edit" onclick="closeEdit()"></div>
        <div id="cyrcle-and-inputs-div">
            <div id="edit-cyrcle-new-contact"></div>
            <div id="edit-content-rightside">
                <form onsubmit="saveNewContact(); return false;">
                    <div id="empty-fields-message"></div>
                    <div id="edit-inputs">
                        <input id="new-contact-input-name" placeholder="Name" type="text" required>
                        <input id="new-contact-input-mail" placeholder="Email" type="email" required>
                        <input id="new-contact-input-number" placeholder="Phone" type="number" required>
                    </div>
                    <div id="save-delete-div">
                        <div id="cancel-btn-div" onclick="closeEdit()">
                            <button type="button" id="cancel-btn-edit" formnovalidate>Cancel</button>
                            <img id="cancel-icon" src="../img/cancel.png">
                        </div>
                        <div id="save-btn-div">
                            <button type="submit" id="save-btn-edit">Save</button>
                            <img id="check-icon" src="../img/check.png">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

    `
};

function setNewContactMobileHTMLTemplate(){
    return `
        <div id="add-new-contact-mobile">
            <div id="new-contact-div-top-mobile">
                <div id="new-contact-overlay-heading-mobile">
                    <h1 id="static-heading-add-mobile">Add contact<h1>
                    <p id="new-contact-text">Tasks are better with a team!</p>
                    <img id="vector5-for-new-mobile" src="../img/vector5vertical.png">
                </div>
            </div>
            <div id="editing-div-bottom-mobile">
                <div id="close-edit-mobile-btn" onclick="closeEditMobile()"></div>
                <div id="cyrcle-and-inputs-div-mobile">
                    <div id="edit-cyrcle-new-contact-mobile"></div>
                    <div id="edit-content-bottom-mobile">
                        <form onsubmit="saveNewContactMobile()">
                            <div id="edit-inputs-mobile">
                                <div id="empty-fields-message"></div>
                                <input id="new-contact-input-name-mobile" placeholder="Name" type="text" required>
                                <input id="new-contact-input-mail-mobile" placeholder="Email" type="email" required>
                                <input id="new-contact-input-number-mobile" placeholder="Phone" type="number" required>
                            </div>
                            <div id="save-delete-div-mobile">
                          
                            <div id="cancel-btn-div">
                                <button   onclick="closeEditMobile()"type="button" id="cancel-btn-edit" formnovalidate>Cancel
                                <img id="cancel-icon" src="../img/cancel.png">
                                </button>
                            </div>
                                    <button type="submit" id="save-btn-edit-mobile">Create Contact</button>
                                    <img id="check-icon" src="../img/check.png">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};