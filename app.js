// UI Elements
const nav = document.getElementById('side-nav');
const showNav = document.getElementById('show-nav-btn');
const hideNav = document.getElementById('hide-nav-btn');
const showNavHeader = document.getElementById('show-nav-header');

// Show nav
showNav.addEventListener('click', () => {
    //if small screen
    if(window.matchMedia(("(max-width: 767px)")).matches || nav.style.transform === 'translateX(-100%)'){
        nav.style.transform = 'translateX(0%)';
    }
    document.body.classList.add('show-nav');
    showNavHeader.classList.add('d-none');

getTranslateX(nav);
    /*document.body.classList.add('show-nav')
    showNav.classList.add('d-none');*/
});
// Hide nav
hideNav.addEventListener('click', () => {
    if(window.matchMedia(("(max-width: 767px)")).matches || nav.style.transform === 'translateX(0%)'){
        nav.style.transform = 'translateX(-100%)';
    }
    document.body.classList.remove('show-nav');
    showNavHeader.classList.remove('d-none');
});
