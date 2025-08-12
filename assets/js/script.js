(() => {
    const header = document.querySelector("header");
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-list");
    window.addEventListener("scroll", () => {
        if (!hamburger.classList.contains("open")) {
            if (window.pageYOffset > 50) {
                header.classList.add("scroll")
            } else {
                header.classList.remove("scroll")
            }
        }
    });
    const toggleMobileNav = () => {
        header.classList.toggle("open")
    };
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);
    const galleryTabs = document.querySelectorAll(".gallery-tabs > .tab");
    const galleryTabIndicator = document.querySelector(".gallery-tabs > .tab-indicator");
    const galleries = document.querySelectorAll(".gallery");
    galleryTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            galleryTabs.forEach((tab) => {
                tab.classList.remove("active")
            });
            galleries.forEach((gallery) => {
                gallery.classList.remove("active")
            });
            galleryTabIndicator.style.left = `${index * 140}px`;
            tab.classList.add("active");
            galleries[index].classList.add("active")
        })
    });
    let eventSlider = new Swiper(".event-slider", {
        slidesPerView: 1,
        spaceBetween: 130,
        loop: !0,
        autoplay: {
            delay: 2500,
            disableOnInteraction: !1,
        },
        navigation: {
            nextEl: ".next-event",
            prevEl: ".prev-event",
        },
        pagination: {
            el: ".event-slider-pagination",
            clickable: !0,
        },
    });
    const backVideo = document.querySelector(".back-video");
    const setVideoSrc = () => {
        if (window.innerWidth <= 680) {
            if (backVideo.getAttribute("src") !== "./assets/videos/mobile.mp4")
                backVideo.src = "./assets/videos/mobile.mp4"
        } else if (backVideo.getAttribute("src") !== "./assets/videos/light.mp4") {
            backVideo.src = "./assets/videos/light.mp4"
        }
    };
    window.addEventListener("resize", setVideoSrc);
    setVideoSrc()

    document.getElementById("scrollToAbout").addEventListener("click", function(event) {
        event.preventDefault();
        var aboutSection = document.getElementById("about");
        var offset = 50; // Adjust this value to control the offset
        var scrollPosition = aboutSection.offsetTop - offset;
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      });

    // Slick Slider for Testimonal  
      $(document).ready(function () {
        $('.slider-row').slick({
            dots: true,
            infinite: true,
            speed: 1500,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 7000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });

    // Typing effect for hero subtitle
    const typingText = document.getElementById('typing-text');
    const textToType = "Studio Quality Photos, 70+ Fun Props, and Expert Attendant for unforgettable moments";
    let charIndex = 0;
    
    function typeText() {
        if (charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 50); // Adjust speed here (milliseconds between characters)
        } else {
            // Remove cursor when typing is complete
            typingText.classList.remove('typing-cursor');
        }
    }
    
    // Start typing effect when page loads
    window.addEventListener('load', () => {
        typingText.classList.add('typing-cursor');
        setTimeout(typeText, 1000); // Delay before starting typing
    });

    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question) => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach((item) => {
                item.classList.remove('active');
            });
            
            // Toggle current FAQ item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
     
})();

document.addEventListener('DOMContentLoaded', function () {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach((card) => {
        const flipCardInner = card.querySelector('.flip-card-inner');
        const frontButton = card.querySelector('.flip-card-front .equipment-btn');
        const backButton = card.querySelector('.flip-card-back .equipment-btn');

        // Handle front button click (View Props & Equipment)
        frontButton.addEventListener('click', (event) => {
            event.stopPropagation();
            card.classList.add('rotate');
        });

        // Handle back button click (Back to Package Details)
        backButton.addEventListener('click', (event) => {
            event.stopPropagation();
            card.classList.remove('rotate');
        });

        // Remove any card click handlers to prevent conflicts
    });
});


