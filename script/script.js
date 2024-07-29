'use strict';

//Glossary Generator
Array.from(document.getElementsByClassName('glossary'))
    .forEach((elem) => {
        for (let item of document.body.getElementsByTagName('h4')) {
            let name = item.id;
            let text = item.textContent;
            if (name) {
                let link = document.createElement('a');
                link.textContent = text;
                link.href = `#${name}`
                elem.append(link);
            }
        }
    }
);