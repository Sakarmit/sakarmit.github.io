'use strict';

//Theme Selector
const theme = localStorage.getItem('theme');
if (theme === null || theme === 'dark') {
    document.getElementsByTagName('html')[0].dataset.theme = 'dark';
} else {
    document.getElementsByTagName('html')[0].dataset.theme = 'light';
}
//Theme Selector Icon Positioning
const themeIcon = document.getElementById('theme-icon');
const themeSelected = document.getElementById('theme-selected');
if (themeIcon && themeSelected) {
    const updateThemeIconPosition = () => {
        const rect = themeIcon.getBoundingClientRect();
        themeSelected.style.left = `${rect.left + window.scrollX}px`;

        let currentTheme = document.getElementsByTagName('html')[0].dataset.theme;
        if (currentTheme === null || currentTheme === 'dark') {
            themeSelected.style.top = `${rect.top + rect.height/2}px`;
        } else {
            themeSelected.style.top = `${rect.top}px`;
        }
    };

    updateThemeIconPosition();
    window.addEventListener('resize', updateThemeIconPosition);
    document.getElementById('theme-selector').addEventListener('click', () => {
        const currentTheme = document.getElementsByTagName('html')[0].dataset.theme;
        if (currentTheme === null || currentTheme === 'dark') {
            document.getElementsByTagName('html')[0].dataset.theme = 'light';
            localStorage.setItem('theme', 'light');
        } else {
            document.getElementsByTagName('html')[0].dataset.theme = 'dark';
            localStorage.setItem('theme', 'dark');
        }
        updateThemeIconPosition();
    });
}

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