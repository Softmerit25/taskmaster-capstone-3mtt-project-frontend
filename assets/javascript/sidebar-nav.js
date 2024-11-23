
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    // Select all menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    // Add click event listeners to each link
    menuLinks.forEach(link => {
            // Remove 'active' class from all links
            link.classList.remove('active');

        if(link.getAttribute('href') === currentPath){
            link.classList.add('active');
        }

 
});

});




// Script to handle MOBILE Sidenav Menu
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Toggle sidebar and overlay
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Close sidebar when clicking the overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});




// Script to handle Search Input on mobile searching
document.addEventListener('DOMContentLoaded', () => {
    const searchInputMobile = document.querySelector('.search-input');
    const searchBtn = document.getElementById('search-btn');

    // Toggle the search input visibility
    searchBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        searchInputMobile.classList.toggle('active');
    });


    // Close the search input when clicking outside
    document.addEventListener('click', (event) => {
        // Check if the input is active and if the click is outside the input
        if (
            searchInputMobile.classList.contains('active') &&
            !searchInputMobile.contains(event.target) &&
            !searchBtn.contains(event.target)
        ) {
            searchInputMobile.classList.remove('active');
        }
    });
});



// Script to handle user log out menu
document.addEventListener('DOMContentLoaded', () => {
    const userLogBtn = document.getElementById('user-icon-btn');
    const userLogoutMenu = document.querySelector('.user-logout-menu');

    userLogBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        userLogoutMenu.classList.toggle('active');
    });


    // // Close the search input when clicking outside
    document.addEventListener('click', (event) => {
        // Check if the input is active and if the click is outside the input
        if (
            userLogoutMenu.classList.contains('active') &&
            !userLogoutMenu.contains(event.target) &&
            !userLogBtn.contains(event.target)
        ) {
            userLogoutMenu.classList.remove('active');
        }
    });
});

