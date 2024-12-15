const sideBar = document.querySelector("#navLink");
const menu = document.querySelector(".menu");
let isExpanded = false;

const toggleSideBar = () => {
    isExpanded = !isExpanded; // Toggle the state

    if (isExpanded) {
        sideBar.style.display = 'flex';
        sideBar.style.right = '0';
        menu.classList.add('opened');
    } else {
        sideBar.style.display = 'none';
        sideBar.style.right = '-100%';
        menu.classList.remove('opened');
    }
}

// Add click event listener to menu button
menu.addEventListener("click", toggleSideBar);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isExpanded && !sideBar.contains(e.target) && !menu.contains(e.target)) {
        toggleSideBar();
    }
});

// Close menu on window resize (if screen becomes larger than mobile breakpoint)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isExpanded) {
        sideBar.style.display = 'flex';
        isExpanded = false;
        menu.classList.remove('opened');
    }
});