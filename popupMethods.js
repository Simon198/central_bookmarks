function closePopupEventHandler(event) {
    if (
        event.target.className !== 'url-element' &&
        event.target.tagName !== 'BUTTON' &&
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

    const profileKeys = []
    if (contentItem.profiles) {
        contentItem.profiles.forEach(profile => {
            for (const key in profile) {
                if (!profileKeys.includes(key)) {
                    profileKeys.push(key)
                }
            }
        })
    }

    const popup = document.createElement('div');
    popup.classList.add('popup')
    popup.style = "position: absolute;" +
        "left: " + anchorRect.left + "px;" +
        "top: " + (anchorRect.top + anchorRect.height + 2) + "px;" +
        "grid-template-columns: repeat(" + (profileKeys.length + (contentItem.profiles && contentItem.profiles.length > 1 ? 2 : 1)) + ", auto);" +
        "grid-template-rows: repeat(" + (contentItem.profiles ? Math.max(1, contentItem.profiles.length) : 1) + ", auto);";

    // url
    const urlTitle = document.createElement('span');
    urlTitle.innerText = 'URL'
    urlTitle.style = 'grid-column: 1; grid-row: 1'
    popup.appendChild(urlTitle)

    const urlDiv = document.createElement('div');
    urlDiv.classList.add('popup-column')
    urlDiv.style = 'grid-column: 1; grid-row: 2'

    const url = document.createElement('a');
    url.setAttribute('href', contentItem.url);
    url.setAttribute('target', target);
    url.innerText = contentItem.url
    urlDiv.appendChild(url)

    const urlCopyButton = document.createElement('button');
    urlCopyButton.innerText = 'URL kopieren'
    addCopyToClipBoardEvent(urlCopyButton, contentItem.url)
    urlDiv.appendChild(urlCopyButton)
    popup.appendChild(urlDiv)

    // profiles
    if (contentItem.profiles && contentItem.profiles.length > 1) {
        const profilesTitle = document.createElement('span');
        profilesTitle.innerText = 'Profil'
        profilesTitle.style = 'grid-column: 2; grid-row: 1'
        popup.appendChild(profilesTitle)

        for (let index = 0; index < contentItem.profiles.length; index++) {
            const profilesNumber = document.createElement('span');
            profilesNumber.innerText = index + 1
            profilesNumber.style = 'grid-column: 2; grid-row: ' + (2 + index)
            popup.appendChild(profilesNumber)
        }
    }

    // key/values
    for (const [keyIndex, profileKey] of profileKeys.entries()) {
        // title
        const keyTitle = document.createElement('span');
        keyTitle.classList.add('wrap')
        keyTitle.innerText = profileKey
        keyTitle.style = 'grid-row: 1; grid-column: ' + (keyIndex + (contentItem.profiles.length > 1 ? 3 : 2))
        popup.appendChild(keyTitle)

        for (const [profileIndex, profile] of contentItem.profiles.entries()) {
            const profileKeyDiv = document.createElement('div');
            profileKeyDiv.classList.add('popup-column')
            profileKeyDiv.style = 'grid-column: ' +
                (keyIndex + (contentItem.profiles.length > 1 ? 3 : 2)) + '; ' +
                'grid-row: ' + (profileIndex + 2)

            if (profile[profileKey]) {
                const profileKeyValue = document.createElement('span');
                profileKeyValue.classList.add('wrap')
                profileKeyValue.innerText = profile[profileKey]
                profileKeyDiv.appendChild(profileKeyValue)

                const profileKeyCopyButton = document.createElement('button');
                profileKeyCopyButton.innerText = profileKey + ' kopieren'
                addCopyToClipBoardEvent(profileKeyCopyButton, profile[profileKey])
                profileKeyDiv.appendChild(profileKeyCopyButton)
            }
            popup.appendChild(profileKeyDiv)
        }
    }

    document.body.appendChild(popup)

}

function addCopyToClipBoardEvent(button, text) {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
    });
}