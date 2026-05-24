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
    const nav = document.querySelector('.mobile-nav');
    const stickyHeader = document.querySelector('.sticky-header');

    function closeMenu() {
        if (nav) nav.classList.remove('active');
        if (mobileBtn) mobileBtn.classList.remove('active');
        const lines = mobileBtn ? mobileBtn.querySelectorAll('span') : [];
        if (lines.length) {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    }

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
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

        // Close menu when a nav link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu when clicking outside the header
        document.addEventListener('click', (e) => {
            if (stickyHeader && !stickyHeader.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // 9. Typewriter effect for brand statements
    const typewriterElements = document.querySelectorAll('.ab-typewriter-text');
    if (typewriterElements.length > 0) {
        const typeText = (el) => {
            const fullText = el.getAttribute('data-text') || el.innerText;
            el.innerText = '';
            el.style.opacity = '1';
            el.classList.add('typing-active');
            
            let index = 0;
            const speed = 25; // speed of typing (25ms per char)
            
            const type = () => {
                if (index < fullText.length) {
                    el.innerText += fullText.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    el.classList.remove('typing-active');
                    el.classList.add('typing-done');
                }
            };
            type();
        };

        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(entry.target);
                    typeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        typewriterElements.forEach(el => {
            if (!el.getAttribute('data-text')) {
                el.setAttribute('data-text', el.innerText.trim());
            }
            el.innerText = '';
            el.style.opacity = '1';
            typeObserver.observe(el);
        });
    }

    // 10. 3D Interactive Tilt Animation for Pillar Cards
    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 12; // Max 12 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 12; // Max 12 degrees tilt
            
            card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            card.style.boxShadow = '0 30px 60px rgba(79, 70, 229, 0.1), 0 4px 16px rgba(79, 70, 229, 0.04)';
            card.style.borderColor = 'rgba(79, 70, 229, 0.25)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)';
            card.style.borderColor = 'rgba(226, 232, 240, 0.8)';
        });
    });

    // 11. 3D Interactive Tilt Animation for Philosophy Cards (Women's Series)
    const philosophyCards = document.querySelectorAll('.philosophy-card');
    philosophyCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 12; // Max 12 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 12; // Max 12 degrees tilt
            
            card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            card.style.boxShadow = '0 30px 60px rgba(212, 175, 55, 0.1), 0 4px 16px rgba(212, 175, 55, 0.04)';
            card.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)';
            card.style.borderColor = 'rgba(226, 232, 240, 0.8)';
        });
    });
});
