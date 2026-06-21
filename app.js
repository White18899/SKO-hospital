/* ==========================================================================
   Sri Krishna Orthopedic Hospital - Web Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Scroll Effects ---
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function handleScroll() {
        // Shrink header on scroll
        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }

        // Highlight active navigation section
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Dynamic Statistics Counter Animation ---
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = 20; // 50 updates per second
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                current += increment;
                step++;
                stat.textContent = Math.floor(current).toLocaleString();

                if (step >= steps) {
                    clearInterval(timer);
                    stat.textContent = target.toLocaleString(); // Exact target
                }
            }, stepTime);
        });
    }

    // Trigger animation when stats section is scrolled into view
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- FAQ Accordion Transition ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Collapse all other active items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // --- Testimonial Slider / Carousel Logic ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlideIndex = 0;
    let slideTimer;

    // Generate dots navigation
    if (slides.length > 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function showSlide(index) {
        // Reset timer
        resetSlideTimer();

        // Update classes
        slides[currentSlideIndex].classList.remove('active');
        document.querySelectorAll('.dot')[currentSlideIndex].classList.remove('active');

        currentSlideIndex = index;

        slides[currentSlideIndex].classList.add('active');
        document.querySelectorAll('.dot')[currentSlideIndex].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function resetSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 6000); // Swap every 6 seconds
    }

    resetSlideTimer();

    // --- Appointment Form Validation & Submission ---
    const quickForm = document.getElementById('quick-book-form');
    const mainForm = document.getElementById('main-appointment-form');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-message');

    function showToast(title, message) {
        toastTitle.textContent = title;
        toastMsg.textContent = message;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000); // Slide away after 5 seconds
    }

    if (quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('quick-name').value;
            const phone = document.getElementById('quick-phone').value;
            const specialty = document.getElementById('quick-specialty').value;

            // Simple validation
            if (!/^\d{10}$/.test(phone.trim())) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            const submitBtn = quickForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Booking...';

            // Simulate server request
            setTimeout(() => {
                showToast(
                    'Callback Requested!',
                    `Hello ${name}, a receptionist will call you shortly regarding ${specialty.replace('-', ' ')}.`
                );
                quickForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Call Back';
            }, 1000);
        });
    }

    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('appt-name').value;
            const phone = document.getElementById('appt-phone').value;
            const specialty = document.getElementById('appt-specialty').value;
            const date = document.getElementById('appt-date').value;

            // Simple validation
            if (!/^\d{10}$/.test(phone.trim())) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            // Date validation (should be in future)
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                alert('Please select a future date for your consultation appointment.');
                return;
            }

            const submitBtn = mainForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Details...';

            // Simulate server request
            setTimeout(() => {
                showToast(
                    'Appointment Scheduled!',
                    `Hi ${name}, your tentative slot for ${specialty.replace('-', ' ')} on ${date} is reserved.`
                );
                mainForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Confirm Appointment Details';
            }, 1200);
        });
    }

    // --- Floating Action Widget Toggles ---
    const floatWaBtn = document.getElementById('float-wa-btn');
    const waChatBox = document.getElementById('whatsapp-chat-box');
    const chatCloseBtn = document.getElementById('chat-close-btn');

    floatWaBtn.addEventListener('click', () => {
        waChatBox.classList.toggle('active');
        // Hide badge upon opening chat
        const badge = floatWaBtn.querySelector('.wa-badge');
        if (badge) badge.style.display = 'none';
    });

    chatCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        waChatBox.classList.remove('active');
    });

    // Close chat if clicked elsewhere
    document.addEventListener('click', (e) => {
        if (!document.getElementById('whatsapp-widget-wrapper').contains(e.target)) {
            waChatBox.classList.remove('active');
        }
    });

    // --- Doctor Modal Dialog Interactions ---
    const docModal = document.getElementById('doctor-modal');

    window.openDoctorModal = function() {
        docModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop body scrolling
    };

    window.closeDoctorModal = function() {
        docModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable body scrolling
    };

    // Helper to select Dr. Mohan directly in forms
    window.setDoctorSelect = function(name) {
        const selectElement = document.getElementById('appt-specialty');
        // Select joint-replacement as default for Dr. Murali Mohan
        if (selectElement) {
            selectElement.value = 'joint-replacement';
        }
        // Smooth scroll to form section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && docModal.classList.contains('active')) {
            closeDoctorModal();
        }
    });

    // --- Report Search & Download Simulator ---
    const reportInput = document.getElementById('patient-id-input');
    const reportResult = document.getElementById('report-result-box');

    window.triggerReportSearch = function() {
        const query = reportInput.value.trim().toUpperCase();
        
        if (!query) {
            alert('Please input a valid Patient ID.');
            return;
        }

        reportResult.classList.remove('hidden', 'success', 'error');

        // Loading state simulator
        reportResult.innerHTML = '<p class="italic">Searching patient registry database...</p>';
        reportResult.classList.remove('hidden');

        setTimeout(() => {
            if (query === 'SKO-2026' || query === 'SKO2026') {
                reportResult.classList.add('success');
                reportResult.innerHTML = `
                    <div class="report-flex">
                        <div>
                            <strong>Patient ID: SKO-2026</strong> (Name: Ramana Murthy)<br>
                            <span class="text-light text-xs">Generated: June 15, 2026 | File size: 1.2 MB</span>
                        </div>
                        <div class="report-btn-dl" onclick="simulateDownload()">Download PDF</div>
                    </div>
                `;
            } else {
                reportResult.classList.add('error');
                reportResult.innerHTML = `
                    <p class="text-light">
                        <strong>No records match "${query}"</strong>. 
                        Please ensure the ID is correct or contact our hospital records desk at +91 98492 56092.
                    </p>
                `;
            }
        }, 800);
    };

    window.simulateDownload = function() {
        alert('Downloading Medical Report: Joint_Assessment_SKO_2026.pdf...');
    };

    window.launchWhatsApp = function() {
        const text = encodeURIComponent("Hello, I would like to schedule an orthopedic consultation appointment with Dr. M. Murali Mohan at Sri Krishna Hospital.");
        const whatsappUrl = `https://wa.me/919849256092?text=${text}`;
        window.open(whatsappUrl, '_blank');
        waChatBox.classList.remove('active');
    };
});
