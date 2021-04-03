// Constants
const CATEGORY_DIV_CLASS = 'category'
const target = settings.openLinksInNewTab ? '_blank' : '_self'

// data classes
class Category {
    constructor(name, image, content) {
        this.name = name;
        this.image = image;
        if (!content) {
            this.content = [];
        } else {
            this.content = content;
        }
    }
}

function includes(names, filterText) {
    if (!names) {
        return false;
    }

    if (!Array.isArray(names)) {
        names = [names];
    }

    for (const name of names) {
        nName = name.replace('-', ' ').replace('_', ' ').toLowerCase()
        nfilterText = filterText.replace('-', ' ').replace('_', ' ').toLowerCase()
        if (nName.includes(nfilterText)) {
            return true;
        }
    }

    return false;
}

function getFilteredData(filterText) {
    if (!filterText) {
        return data;
    }

    filteredData = [];
    for (const category of data) {
        let isCategoryIncluded = false;
        for (const link of category.content) {
            if (
                includes(link.name, filterText) ||
                includes(link.url, filterText) ||
                includes(link.nicknames, filterText)
            ) {
                if (!isCategoryIncluded) {
                    filteredData.push(new Category(category.name, category.image, [link]))
                    isCategoryIncluded = true;
                } else {
                    filteredData[filteredData.length - 1].content.push(link)
                }
            }
        }
    }

    return filteredData;
}

function clearUrlList() {
    const divs = document.getElementsByClassName(CATEGORY_DIV_CLASS);
    while (divs.length > 0) {
        divs[0].parentNode.removeChild(divs[0]);
    }
}

// create url list
function createUrlList() {
    const filterText = searchbar.value
    clearUrlList();

    const container = document.getElementById('container');

    const filteredData = getFilteredData(filterText)
    for (const category of filteredData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add(CATEGORY_DIV_CLASS)

        categoryDiv.appendChild(document.createElement('hr'))
        // categoryDiv.appendChild(document.createElement('img'))

        const bold = document.createElement("h4");
        bold.innerHTML = '<i>' + category.name + ':</i>'
        categoryDiv.appendChild(bold)

        // create urls
        for (const link of category.content) {
            const aElement = document.createElement('a');
            aElement.setAttribute('href', link.url);
            aElement.setAttribute('target', target);
            aElement.classList.add('url-element')
            aElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                openPopup(link, aElement)
            });
            aElement.innerText = link.name;
            categoryDiv.appendChild(aElement)
        }

        // create back to the top button
        const aElement = document.createElement('a');
        aElement.setAttribute('href', '#body');
        aElement.innerText = 'Zurück nach oben';
        categoryDiv.appendChild(aElement);

        container.appendChild(categoryDiv)
    }
}

// subscripe to searchbar
const searchbar = document.getElementById('search');
searchbar.addEventListener('keyup', () => {
    createUrlList();
})
searchbar.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        for (const searchEngine of searchEngines) {
            if (searchEngine.default) {
                searchInSearchEngine(searchEngine)
                break;
            }
        }
    }
})


// read url params
var query = window.location.search.substring(1);
var queryParams = {};
query.split("&").forEach(function (part) {
    var item = part.split("=");
    queryParams[item[0]] = decodeURIComponent(item[1]);
});

// init url list
if (queryParams.search) {
    searchbar.value = queryParams.search
} else {
    searchbar.value = ''
}
createUrlList();

function searchInSearchEngine(searchEngine) {
    const filterText = searchbar.value
    let url;
    if (!filterText) {
        url = searchEngine.href
    } else {
        url = searchEngine.href + '?q=' + filterText
    }

    window.open(url, target)
}


// add searchengine buttons
const websiteButtonDiv = document.getElementsByClassName('website-buttons')[0]
for (const searchEngine of searchEngines) {
    const websiteButton = document.createElement('button')
    websiteButton.classList.add("website-button")
    websiteButton.addEventListener('click', () => searchInSearchEngine(searchEngine))

    if (settings.externalLinks) {
        const engingeImage = document.createElement('img')
        engingeImage.src = searchEngine.favicon
        engingeImage.classList.add("website-button-icon")
        websiteButton.appendChild(engingeImage)
    }
    websiteButton.appendChild(document.createTextNode(searchEngine.name))

    websiteButtonDiv.appendChild(websiteButton)
}


// add material icons
if (settings.externalLinks) {
    const materialIconsLink = document.createElement('link')
    materialIconsLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
    materialIconsLink.rel = "stylesheet"
    document.head.appendChild(materialIconsLink)

    const searchIconDiv = document.getElementsByClassName('search-icon')[0]
    searchIconDiv.children[0].innerText = 'search'
}