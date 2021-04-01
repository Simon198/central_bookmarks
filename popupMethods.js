function closePopupEventHandler(event) {
    if (
        event.target.className !== 'url-element' &&
        (
            !document.querySelector('.popup') ||
            !document.querySelector('.popup').contains(event.target)
        )
    ) {
        closePopups();
    }
}

function closePopups() {
    const popups = document.getElementsByClassName('popup');
    while (popups.length > 0) {
        popups[0].parentNode.removeChild(popups[0]);
    }
    document.getElementById('dimmer').style = 'visibility: hidden';
}

window.addEventListener('click', event => { closePopupEventHandler(event) });
window.addEventListener('contextmenu', event => { closePopupEventHandler(event) });

function openPopup(contentItem, anchorNode) {
    closePopups();
    document.getElementById('dimmer').style = 'visibility: visible';

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
    const urlDiv = document.createElement('div');
    urlDiv.classList.add('popup-column')

    const urlTitle = document.createElement('span');
    urlTitle.innerText = 'URL:'
    urlDiv.appendChild(urlTitle)

    const url = document.createElement('a');
    url.setAttribute('href', contentItem.url);
    url.setAttribute('target', '_blank');
    url.innerText = contentItem.url
    urlDiv.appendChild(url)

    const urlCopyButton = document.createElement('button');
    urlCopyButton.innerText = 'URL kopieren'
    addCopyToClipBoardEvent(urlCopyButton, contentItem.url)
    urlDiv.appendChild(urlCopyButton)
    popup.appendChild(urlDiv)


    // username
    if (contentItem.username) {
        const usernameDiv = document.createElement('div');
        usernameDiv.classList.add('popup-column')

        const usernameTitle = document.createElement('span');
        usernameTitle.innerText = 'Nutzername:'
        usernameDiv.appendChild(usernameTitle)

        const username = document.createElement('span');
        username.innerText = contentItem.username
        usernameDiv.appendChild(username)

        const usernameCopyButton = document.createElement('button');
        usernameCopyButton.innerText = 'Nutzernamen kopieren'
        addCopyToClipBoardEvent(usernameCopyButton, contentItem.username)
        usernameDiv.appendChild(usernameCopyButton)
        popup.appendChild(usernameDiv)
    }

    // password
    if (contentItem.password) {
        const passwordDiv = document.createElement('div');
        passwordDiv.classList.add('popup-column')

        const passwordTitle = document.createElement('span');
        passwordTitle.innerText = 'Passwort:'
        passwordDiv.appendChild(passwordTitle)

        const password = document.createElement('span');
        password.innerText = contentItem.password
        passwordDiv.appendChild(password)

        const passwordCopyButton = document.createElement('button');
        passwordCopyButton.innerText = 'Passwort kopieren'
        addCopyToClipBoardEvent(passwordCopyButton, contentItem.password)
        passwordDiv.appendChild(passwordCopyButton)
        popup.appendChild(passwordDiv)
    }

    document.body.appendChild(popup)

}

function addCopyToClipBoardEvent(button, text) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
    });
}