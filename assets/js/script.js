(() => {
    // Select HTML Elements
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");

    // Handles Mobile Navigation Bar
    const toggleMobileNav = () => {
        header.classList.toggle("open");
    };

    // Event Listeners
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);

    $(function(){
        $(window).scroll(function(){
            if ($(this).scrollTop() < 50 ) {
                $("nav-container").removeClass("leo-top-nav")
            } else {
                $("nav-container").addClass("leo-top-nav")
            }
        })
    });
    

})();

//Show / Hide Nav bar on scroll
