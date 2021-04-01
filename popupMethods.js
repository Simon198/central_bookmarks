function closePopups() {
    const popups = document.getElementsByClassName('popup');
    while (popups.length > 0) {
        popups[0].parentNode.removeChild(popups[0]);
    }
}

window.addEventListener('click', event => {
    if (
        event.target.className !== 'url-element' &&
        !document.querySelector('.popup').contains(event.target)
    ) {
        closePopups();
    }
});
window.addEventListener('contextmenu', event => {
    if (
        event.target.className !== 'url-element' &&
        !document.querySelector('.popup').contains(event.target)
    ) {
        closePopups();
    }
});

function openPopup(contentItem, anchorNode, parentDiv) {
    closePopups();

    const anchorRect = anchorNode.getBoundingClientRect()

    const popup = document.createElement('div');
    popup.classList.add('popup')
    popup.style = "position: absolute;" +
        "left: " + anchorRect.left + "px;" +
        "top: " + (anchorRect.top + anchorRect.height + 2) + "px;";
    popup.addEventListener('click', (event) => {
        event.preventDefault()
    });
    

    // url
    const url = document.createElement('a');
    url.setAttribute('href', contentItem.url);
    url.setAttribute('target', '_blank');
    url.innerText = contentItem.url
    popup.appendChild(url)

    const urlCopyButton = document.createElement('button');
    urlCopyButton.innerText = 'URL kopieren'
    addCopyToClipBoardEvent(urlCopyButton, contentItem.url)
    popup.appendChild(urlCopyButton)


    // username
    if (contentItem.username) {
        const username = document.createElement('span');
        username.innerText = contentItem.username
        popup.appendChild(username)

        const usernameCopyButton = document.createElement('button');
        usernameCopyButton.innerText = 'Nutzernamen kopieren'
        addCopyToClipBoardEvent(usernameCopyButton, contentItem.username)
        popup.appendChild(usernameCopyButton)
    }

    // password
    if (contentItem.password) {
        const password = document.createElement('span');
        password.innerText = contentItem.password
        popup.appendChild(password)

        const passwordCopyButton = document.createElement('button');
        passwordCopyButton.innerText = 'Passwort kopieren'
        addCopyToClipBoardEvent(passwordCopyButton, contentItem.password)
        popup.appendChild(passwordCopyButton)
    }

    parentDiv.appendChild(popup)
    
}

function addCopyToClipBoardEvent(button, text) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
    });
}