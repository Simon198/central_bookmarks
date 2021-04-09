// Constants
const DEFAULT_URL = "bookmarks.html"
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
        nfilterText = filterText.replace('-', ' ').replace('_', ' ').replace('+', ' ').toLowerCase()
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

    const container = document.getElementById('container-content');

    const filteredData = getFilteredData(filterText)
    for (const category of filteredData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add(CATEGORY_DIV_CLASS)
        
        if (category.image) {
            const categoryImage = document.createElement('img');
            categoryImage.classList.add('category-image');
            categoryImage.src = category.image;
            categoryDiv.appendChild(categoryImage)
            categoryDiv.appendChild(document.createElement('br'))
        }

        const bold = document.createElement("b");
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

        if (category !== filteredData[filteredData.length - 1]) {
            categoryDiv.appendChild(document.createElement('hr'))
        }
        container.appendChild(categoryDiv)
    }
}

function changeUrl() {
    let newUrl = DEFAULT_URL
    if (searchbar.value) {
        newUrl += '?search=' + searchbar.value;
    }
    window.history.pushState(null,"", newUrl);
}

// subscripe to searchbar
const searchbar = document.getElementById('search');
searchbar.addEventListener('keyup', event => {
    createUrlList();
    changeUrl();
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
searchbar.focus()
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
    const engineName = document.createElement('span');
    engineName.classList.add('website-button-name')
    engineName.innerText = searchEngine.name;
    websiteButton.appendChild(engineName)

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