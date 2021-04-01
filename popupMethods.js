// name, url, username, password
function openPopup(event, contentItem, anchorNode, parentDiv) {
    event.preventDefault();

    const anchorRect = anchorNode.getBoundingClientRect()
    console.log(anchorRect)

    const popup = document.createElement('div');
    popup.classList.add('popup')
    popup.style = "position: absolute;" +
        "left: " + anchorRect.left + "px;" +
        "top: " + (anchorRect.top + anchorRect.height + 2) + "px;";

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

        parentDiv.appendChild(popup)
    }
}

function addCopyToClipBoardEvent(button, text) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
    });
}