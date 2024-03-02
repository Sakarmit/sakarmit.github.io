'use strict';

const darkMode = localStorage.getItem('dark_mode');
document.addEventListener('DOMContentLoaded', () => {document.querySelector("html").classList.add(darkMode)})

const jamIds = [382039, 330366, 326297, 325036];
//New Carousel Code
const jamCarousels = document.querySelectorAll('.carousel-container.jam');
jamCarousels.forEach(
    carousel => {
        const carouselList = carousel.querySelector('.carousel');
        const carouselNavList = carousel.querySelector('.carousel-nav');

        jamIds.forEach(
            id => {
                const masterListItem = document.createElement('li');
                masterListItem.classList.add('carousel-item');
                carouselList.append(masterListItem);

                const navMarker = document.createElement('div');
                navMarker.classList.add('nav-item');
                carouselNavList.append(navMarker);
                fetch('https://corsproxy.io/?'+ encodeURIComponent(`https://itch.io/jam/${id}/entries.json`))
                .then(async (result) =>
                    {
                        const data = await result.json();
                        const games = data.jam_games;

                        await games.forEach(
                            gameObj => {
                                const gameDiv = document.createElement('div');
                                gameDiv.addEventListener('click', (e) => {
                                    console.log(e);
                                    window.open(gameObj.game.url);
                                });
                                masterListItem.append(gameDiv);

                                const gameImg = document.createElement('img');
                                if (gameObj.game.cover === '') {
                                    gameImg.src = 'images/game-image-missing.png';
                                } else {
                                    gameImg.src = gameObj.game.cover;
                                }
                                gameDiv.append(gameImg);
                                
                                const gameName = document.createElement('p');
                                gameName.textContent = gameObj.game.title;
                                gameDiv.append(gameName);
                            }
                        )
                    }
                ).catch((err) => {
                        carousel.remove();
                        console.log(err);
                    }
                )
            }
        )
        carouselList.firstChild.classList.add('active');
        carouselNavList.firstChild.classList.add('active');
    }
)
//Carousel Code
const carousels = document.querySelectorAll('.carousel-container');
carousels.forEach(
    carousel => {
        const carouselItems = Array.from(carousel.querySelectorAll('.carousel-item'));
        const navItems = Array.from(carousel.querySelectorAll('.nav-item'));

        carousel.querySelector('.left').addEventListener('click', swipe);
        carousel.querySelector('.right').addEventListener('click', swipe);

        function swipe(e) {
            const CAROUSEL_SIZE = carouselItems.length;
            const currentCarouselItem = carousel.querySelector('.carousel-item.active');
            const currentIndex = carouselItems.indexOf(currentCarouselItem);

            let nextIndex;

            if (e.currentTarget.classList.contains('left')) {
                if (currentIndex === 0) {
                    nextIndex = CAROUSEL_SIZE - 1;
                }
                else {
                    nextIndex = currentIndex - 1;
                }
            }
            else {
                if (currentIndex === CAROUSEL_SIZE - 1) {
                    nextIndex = 0;
                }
                else {
                    nextIndex = currentIndex + 1;
                }
            }

            carouselItems[nextIndex].classList.add('active');
            navItems[nextIndex].classList.add('active');
            currentCarouselItem.classList.remove('active');
            navItems[currentIndex].classList.remove('active');
        }

        navItems.forEach((item) => { item.addEventListener('click', changeImage) });

        function changeImage(event) {
            const oldIndex = navItems.indexOf(carousel.querySelector('.nav-item.active'));
            const newIndex = navItems.indexOf(event.currentTarget);

            if (oldIndex !== newIndex) {
                carouselItems[newIndex].classList.add('active');
                navItems[newIndex].classList.add('active');
                carouselItems[oldIndex].classList.remove('active');
                navItems[oldIndex].classList.remove('active');
            }
        }
    }
);

//Date tooltip
const dates = document.querySelectorAll('.date');

const span = document.createElement('span');
span.classList.add('hidden', 'tooltip');
document.body.append(span);

dates.forEach(
    dateElem => {
        const date = new Date(dateElem.textContent);

        dateElem.addEventListener('mouseenter', calcAndShowTooltip);

        function calcAndShowTooltip(e) {
            const diffInWeeks = Math.round((((date - new Date()) / 86400000) + 1) / 7);
            if (diffInWeeks === 0) {
                span.textContent = 'This Week';
            } else if (diffInWeeks < 0) {
                span.textContent = `${diffInWeeks * -1} Week${diffInWeeks < -1 ? 's' : ''} Ago`;
            } else if (diffInWeeks > 0) {
                span.textContent = `In ${diffInWeeks} Week${diffInWeeks > 1 ? 's' : ''}`;
            } else {
                console.error('Something went with diffInWeeks should be an int but got: ' + diffInWeeks);
            }

            span.classList.remove('hidden');
        }

        dateElem.addEventListener('mousemove', (e) => {
            span.style.left = e.clientX - span.offsetWidth / 2 + 'px';
            span.style.top = e.clientY + span.offsetHeight - 10 + 'px';
        });

        dateElem.addEventListener('mouseleave', () => { span.classList.add('hidden') });
    }
);

//Theme Changer
const themeSwitcher = document.querySelector('.theme-changer');

themeSwitcher.addEventListener('click', toggleTheme);

function toggleTheme(e) {
    themeSwitcher.querySelectorAll('i').forEach(elem => {
        elem.classList.toggle('hidden');
    });
    document.querySelector("html").classList.toggle('light');

    if (localStorage.getItem('dark_mode') === 'light') {
        localStorage.removeItem('dark_mode');
    } else {
        localStorage.setItem('dark_mode', 'light');
    }
}

/* Minecraft status */
const serverStatusDisplays = document.querySelectorAll('.mc-server');

serverStatusDisplays.forEach(
    display => { 
        fetch(`https://api.mcsrvstat.us/3/mc.unccgamedev.org`)
        .then(async obj => {
            const data = await obj.json();

            const img = document.createElement('img');
            img.classList.add('mc-server-icon')
            if (data.icon === undefined) {
                img.src = 'images/games/default-server.png';
            } else {
                img.src = data.icon;
            }
            display.append(img);

            const displayText = document.createElement('div');
            display.append(displayText);

            const para = document.createElement('p');
            para.innerText = `${data.hostname} (${data.players.online} / ${data.players.max})
                              Version: ${data.software} ${data.version}
                              ${data.motd.clean}
                              `

            displayText.append(para);
            console.log(data)
        })
        .catch(
            err => console.log(err)
        )
    }
)