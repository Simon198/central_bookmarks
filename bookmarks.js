// Constants
const CATEGORY_DIV_CLASS = 'category'

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
function createUrlList(filterText) {
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
            aElement.setAttribute('target', '_blank');
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
    createUrlList(searchbar.value);
})
searchbar.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        searchInDuckDuckGo();
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
createUrlList(queryParams.search);

function searchInGoogle() {
    const filterText = searchbar.value
    if (!filterText) {
        location.href = 'https://www.google.com/'
    } else {
        location.href = 'https://www.google.com/search?q=' + filterText
    }
}

function searchInDuckDuckGo() {
    const filterText = searchbar.value
    if (!filterText) {
        location.href = 'https://duckduckgo.com/'
    } else {
        location.href = 'https://duckduckgo.com?q=' + filterText
    }
}