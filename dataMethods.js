function openNewCategoryPopup() {
    closePopups();
    document.getElementById('dimmer').style = 'visibility: visible';

    const popupWidth = 300;
    const popupHeight = 100;

    const popup = document.createElement('div');
    popup.classList.add('popup')
    popup.style = "position: absolute;" +
        "left: 50%;" +
        "top: 50%;" +
        "margin-top: -" + popupHeight/2 + "px;" +
        "margin-left: -" + popupWidth/2 + "px;" +
        "width: " + popupWidth + "px;" +
        "height: " + popupHeight + "px;";

    const nameInput = document.createElement('input')
    nameInput.classList.add('popup-input')
    popup.appendChild(nameInput)

    const buttonFooter = document.createElement('div');
    buttonFooter.classList.add('button-footer')

    const saveButton = document.createElement('button')
    saveButton.classList.add('save-button')
    saveButton.innerText = 'Speichern'
    saveButton.addEventListener('click', () => {
        data.push({
            name: nameInput.value,
            content: []
        })
        createUrlList();
        closePopups();
    })
    buttonFooter.appendChild(saveButton)

    const cancelButton = document.createElement('button')
    cancelButton.classList.add('cancel-button')
    cancelButton.innerText = 'Abbrechen'
    cancelButton.addEventListener('click', () => closePopups())
    buttonFooter.appendChild(cancelButton)

    popup.appendChild(buttonFooter)

    document.body.appendChild(popup)
}