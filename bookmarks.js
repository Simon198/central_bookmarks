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

class ContentItem {
    constructor(name, url, nicknames, username, password) {
        this.name = name;
        this.url = url;
        if (!nicknames) {
            this.nicknames = [];
        } else {
            this.nicknames = nicknames;
        }

        this.username = username;
        this.password = password;
        this.active = true;
    }
}

function includes(names, filterText) {
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

    const filteredData = getFilteredData(filterText)
    for (const category of filteredData) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add(CATEGORY_DIV_CLASS)

        categoryDiv.appendChild(document.createElement('hr'))
        // categoryDiv.appendChild(document.createElement('img'))

        const bold = document.createElement("b");
        bold.innerHTML = '<i>' + category.name + ':</i>'
        categoryDiv.appendChild(bold)

        // create urls
        for (const link of category.content) {
            const aElement = document.createElement('a');
            aElement.setAttribute('href', link.url);
            aElement.setAttribute('target', '_blank');
            aElement.addEventListener('contextmenu', (event) => openPopup(event, link, aElement, categoryDiv))//"javascript:return openPopup(link);")
            aElement.innerText = link.name;
            categoryDiv.appendChild(aElement)
        }

        // create back to the top button
        const aElement = document.createElement('a');
        aElement.setAttribute('href', '#body');
        aElement.innerText = 'Zurück nach oben';
        categoryDiv.appendChild(aElement);

        document.body.appendChild(categoryDiv)
    }
}

// subscripe to searchbar
const searchbar = document.getElementById('search');
searchbar.addEventListener('keyup', () => {
    createUrlList(searchbar.value);
})

// read url params
var query = window.location.search.substring(1);
var queryParams = {};
query.split("&").forEach(function (part) {
    var item = part.split("=");
    queryParams[item[0]] = decodeURIComponent(item[1]);
});

// init url list
searchbar.value = queryParams.search
createUrlList(queryParams.search);