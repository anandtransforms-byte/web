document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Premium Animations
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    
    let revealDelay = 0;
    let revealTimer = null;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Automatic stagger for elements entering at once
                if (!revealTimer) {
                    revealTimer = setTimeout(() => { revealDelay = 0; revealTimer = null; }, 100);
                }

                const delay = revealDelay;
                revealDelay += 100; // 100ms stagger increment

                setTimeout(() => {
                    entry.target.classList.add('active'); // For reveal-text
                    entry.target.classList.add('fade-in-up'); // For .animate
                    
                    // Trigger count up if it's a stats card
                    const countEls = entry.target.querySelectorAll('.count-up');
                    countEls.forEach(el => animateValue(el, 0, parseInt(el.getAttribute('data-target')), 2000));
                    
                    const flowLine = entry.target.querySelector('.flow-line');
                    if (flowLine) flowLine.classList.add('active');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate, .reveal-text').forEach(el => {
        observer.observe(el);
    });

    // Count Up Animation function
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end; // Ensure final exact value
            }
        };
        window.requestAnimationFrame(step);
    }

    // 7. Simple Parallax Background Fallback
    const growthSection = document.getElementById('growth-steps');
    const parallaxBg = document.querySelector('.scroll-parallax');
    if (growthSection && parallaxBg) {
        window.addEventListener('scroll', () => {
            const rect = growthSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const scrollProgress = window.innerHeight - rect.top;
                parallaxBg.style.transform = `translateY(${scrollProgress * 0.1}px)`;
            }
        });
    }

    // 3. Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Remove active from all panes and initially reset transition
            panes.forEach(p => {
                p.classList.remove('active');
                p.style.opacity = '0';
                p.style.transform = 'translateX(20px)';
            });

            // Add active to clicked tab
            tab.classList.add('active');
            
            // Show corresponding pane
            const targetId = tab.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);
            targetPane.classList.add('active');
            
            // Force reflow and apply animation
            void targetPane.offsetWidth;
            targetPane.style.opacity = '1';
            targetPane.style.transform = 'translateX(0)';
        });
    });

    // 4. AMP Carousel Navigation
    const ampTrack = document.getElementById('amp-track');
    const prevBtn = document.getElementById('amp-prev');
    const nextBtn = document.getElementById('amp-next');
    
    if (ampTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            ampTrack.scrollBy({ left: -344, behavior: 'smooth' }); // 320 + 24 gap
        });
        nextBtn.addEventListener('click', () => {
            ampTrack.scrollBy({ left: 344, behavior: 'smooth' });
        });
    }
    // 5. Profile Fan Interaction
    const fanWrapper = document.querySelector('.fan-profile-wrapper');
    if (fanWrapper) {
        fanWrapper.addEventListener('click', () => {
            fanWrapper.classList.toggle('expanded');
            
            // Remove the cue UI once clicked interactively
            const cue = fanWrapper.querySelector('.expand-cue');
            if (cue) cue.style.opacity = '0';
        });
    }
    // 6. Interactive Steps Scroll Spy (CoachHub section)
    const stepBlocks = document.querySelectorAll('.step-block');
    const mockupViews = document.querySelectorAll('.mockup-view');
    
    if (stepBlocks.length > 0 && mockupViews.length > 0) {
        const stepObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -40% 0px', // Trigger when block is central in viewport
            threshold: 0
        };
        
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepId = entry.target.getAttribute('data-step');
                    
                    // Remove active from all views
                    mockupViews.forEach(view => {
                        view.classList.remove('active');
                    });
                    
                    // Add active to the corresponding view
                    const targetView = document.getElementById(`mockup-view-${stepId}`);
                    if (targetView) targetView.classList.add('active');
                }
            });
        }, stepObserverOptions);
        
        stepBlocks.forEach(block => stepObserver.observe(block));
    }

    // 8. Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            mobileBtn.classList.toggle('active');
            
            // Toggle hamburger to close icon
            const lines = mobileBtn.querySelectorAll('span');
            if (isActive) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }
});
