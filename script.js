document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for Hero background
    const heroBg = document.querySelector('.hero-video');
    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    });

    // Intersection Observer for scroll reveal
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });

    // Add CSS for reveal animation
    if (!document.getElementById('scroll-reveal-style')) {
        const styleAttr = document.createElement('style');
        styleAttr.id = 'scroll-reveal-style';
        styleAttr.innerHTML = `
            .scroll-reveal {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 1s ease-out, transform 1s ease-out;
            }
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleAttr);
    }

    // Mobile Sidebar Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const toggleSidebar = () => {
        if (mobileSidebar) mobileSidebar.classList.toggle('active');
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileSidebar) mobileSidebar.classList.remove('active');
        });
    });

    // Loading Screen Dismissal
    const loadingScreen = document.getElementById('loading-screen');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');

    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    }

    if (introVideo) {
        document.body.style.overflow = 'hidden'; // Disable scrolling on initial load
        introVideo.onended = hideLoadingScreen;
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', hideLoadingScreen);
    }
});
