// ========== IMAGE SLIDER SETUP ==========
document.addEventListener('DOMContentLoaded', async function() {
    
    // ✅ CHECK: Only load old slider if NEW carousel doesn't exist
    const newCarouselExists = document.querySelector('.images-holder');
    
    if (!newCarouselExists) {
        // Load old image slider (for doctor pages)
        try {
            const response = await fetch('imageConfig.json');
            const data = await response.json();
            setupSlider(data.images);
        } catch (error) {
            console.error('Failed to load image configuration:', error);
        }
    }

    // Setup doctor page buttons if they exist
    const page2Btn = document.getElementById("page2-btn");
    const backBtn = document.getElementById("back-btn");
    
    if (page2Btn) {
        page2Btn.addEventListener("click", function() {
            $("#page1-content").fadeOut(function() {
                $("#page2-content").fadeIn();
            });
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener("click", function() {
            $("#page2-content").fadeOut(function() {
                $("#page1-content").fadeIn();
            });
        });
    }

    // Initialize back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Setup search button listener
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchSpecialization);
    }

    // Filter doctors on page load
    filterDoctors();
    
    // ✅ INITIALIZE NEW CAROUSEL
    initCarousel();
    
    console.log("Script loaded");
});

// ========== SERVICE SLIDER FUNCTIONS ==========
function initServiceSlider() {
    // Get elements for service slider
    const serviceContainer = document.querySelector('.container-slider');
    const wrapperHolder = serviceContainer ? serviceContainer.querySelector('.wrapper-holder') : null;
    const serviceSlides = wrapperHolder ? wrapperHolder.querySelectorAll('div') : [];  // Targets divs with IDs like slider-img-1
    const serviceDots = serviceContainer ? serviceContainer.querySelectorAll('.button-holder .button') : [];
    
    // Check if service slider exists
    if (!wrapperHolder || serviceSlides.length === 0) {
        console.log('No service slider found on this page');
        return;
    }
    
    console.log('✅ Service slider found! Total slides:', serviceSlides.length);
    
    let currentSlide = 0;
    let autoSlideTimer;
    const totalSlides = 5;  // Matches your 5 images; update if adding more (e.g., 6)
    const slideWidth = 100 / totalSlides;  // 20% per slide for 5
    
    // Move to specific slide (pauses CSS animation)
    function goToServiceSlide(slideIndex) {
        // Boundary checking with loop
        currentSlide = (slideIndex + totalSlides) % totalSlides;
        
        // Calculate and apply transform
        const moveAmount = -(currentSlide * slideWidth * 100);  // e.g., -20% for slide 1
        wrapperHolder.style.transform = `translateX(${moveAmount}%)`;
        wrapperHolder.style.animationPlayState = 'paused';  // Pause CSS auto-slide
        
        // Update active dot
        serviceDots.forEach(dot => dot.classList.remove('active'));
        if (serviceDots[currentSlide]) {
            serviceDots[currentSlide].classList.add('active');
        }
        
        console.log(`Service slider now showing slide ${currentSlide + 1} of ${totalSlides}`);
        
        // Optional: Target specific ID for effects, e.g., highlight
        // const targetSlide = document.getElementById(`slider-img-${currentSlide + 1}`);
        // if (targetSlide) targetSlide.style.border = '2px solid #00ffff';
    }
    
    // Next slide
    function nextServiceSlide() {
        goToServiceSlide(currentSlide + 1);
    }
    
    // Previous slide (if you add buttons later)
    function prevServiceSlide() {
        goToServiceSlide(currentSlide - 1);
    }
    
    // Start auto-slide timer (simulates your 42s CSS animation, ~8.4s per slide)
    function startServiceAutoSlide() {
        autoSlideTimer = setInterval(nextServiceSlide, 8400);  // Adjust timing as needed
        console.log('▶️ Service auto-slide started');
    }
    
    // Stop auto-slide
    function stopServiceAutoSlide() {
        clearInterval(autoSlideTimer);
        wrapperHolder.style.animationPlayState = 'running';  // Resume CSS if desired, but JS overrides
        console.log('⏸️ Service auto-slide paused');
    }
    
    // Bind dot clicks using data-slide attribute
    serviceDots.forEach((dot) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            stopServiceAutoSlide();
            const slideIndex = parseInt(this.dataset.slide);  // Matches HTML data-slide="0" etc.
            goToServiceSlide(slideIndex);
            setTimeout(startServiceAutoSlide, 3000);
        });
    });
    
    // Pause on hover
    if (serviceContainer) {
        serviceContainer.addEventListener('mouseenter', stopServiceAutoSlide);
        serviceContainer.addEventListener('mouseleave', startServiceAutoSlide);
    }
    
    // Optional: Add prev/next buttons (uncomment if you insert HTML)
    /*
    const servicePrev = serviceContainer.querySelector('.service-prev');
    const serviceNext = serviceContainer.querySelector('.service-next');
    if (servicePrev) servicePrev.addEventListener('click', () => { stopServiceAutoSlide(); prevServiceSlide(); startServiceAutoSlide(); });
    if (serviceNext) serviceNext.addEventListener('click', () => { stopServiceAutoSlide(); nextServiceSlide(); startServiceAutoSlide(); });
    */
    
    // Initialize
    goToServiceSlide(0);
    startServiceAutoSlide();
    
    console.log('✅ Service slider initialized and running!');
}


// ========== OLD SLIDER FUNCTIONS (for doctor pages) ==========
function setupSlider(images) {
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.innerHTML = images.map(img => 
            `<img src="${img.src}" alt="${img.alt}" class="doctor-img">`
        ).join('');
        activateSlider();
    }
}

function activateSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider img');
    
    if (slides.length > 0) {
        slides[currentSlide].classList.add('active');
        
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }
}

// ========== SLIDER FUNCTIONS ==========
function setupSlider(images) {
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.innerHTML = images.map(img => 
            `<img src="${img.src}" alt="${img.alt}" class="doctor-img">`
        ).join('');
        activateSlider();
    }
}

function activateSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider img');
    
    if (slides.length > 0) {
        slides[currentSlide].classList.add('active');
        
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }
}

// ========== COMPLETE FIXED NAVIGATION FUNCTIONS ==========

// Toggle Hamburger Menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    const backdrop = document.querySelector('.menu-backdrop');
    
    if (menu) {
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    if (backdrop) {
        backdrop.classList.toggle('active');
    }
}

// ✅ FIXED: Toggle Dropdown - works independently
function toggleDropdown(event) {
    // STOP event from reaching parent <a> tag
    event.preventDefault();
    event.stopPropagation();
    
    // Find the parent dropdown element
    const dropdownItem = event.target.closest('.dropdown');
    const dropdownContent = document.getElementById('about-dropdown');
    
    if (dropdownItem && dropdownContent) {
        // Toggle classes
        dropdownItem.classList.toggle('open');
        dropdownContent.classList.toggle('active');
        
        console.log('Dropdown toggled!'); // Debug log
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = event.target.closest('.dropdown');
    const aboutDropdown = document.getElementById('about-dropdown');
    
    // If click is NOT inside dropdown, close it
    if (!dropdown && aboutDropdown) {
        aboutDropdown.classList.remove('active');
        
        // Also remove open class from dropdown item
        const dropdownItem = document.querySelector('.dropdown');
        if (dropdownItem) {
            dropdownItem.classList.remove('open');
        }
    }
});

// Close mobile menu when backdrop is clicked
document.addEventListener('DOMContentLoaded', function() {
    const backdrop = document.querySelector('.menu-backdrop');
    
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            toggleMenu();
        });
    }
});


// ========== DOCTORS PAGE FUNCTIONS ==========
function searchSpecialization() {
    console.log('Search function called'); // Debug log
    
    const specializationInput = document.getElementById('specialization');
    
    if (!specializationInput) {
        console.error('Specialization select not found');
        alert('Error: Search form not found');
        return;
    }
    
    const specialization = specializationInput.value;
    console.log('Selected specialization:', specialization); // Debug log
    
    // Validate selection
    if (!specialization || specialization === '') {
        alert('Please select a specialization first');
        return;
    }
    
    // Close mobile menu if open
    const menu = document.getElementById('menu');
    if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
    
    // Close any open dropdowns
    const dropdown = document.getElementById('about-dropdown');
    if (dropdown && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
    }
    
    console.log('Redirecting to doctors.html'); // Debug log
    
    // Redirect to doctors page
    window.location.href = `doctors.html?specialization=${encodeURIComponent(specialization)}`;
}

function filterDoctors() {
    const value = findGetParameter('specialization');
    
    if (value != null) {
        // Hide all sections first
        $('#internal-medical-team').hide();
        $('#obstetrics-team').hide();
        $('#pediatrician').hide();
        $('#others').hide();
        $("#page1-content").hide();
        $("#page2-content").hide();
        
        // Show specific section based on specialization
        switch(value) {
            case 'internal-medical-team':
                $("#page1-content").show();
                $('#internal-medical-team').show();
                break;
            case 'obstetrics-team':
                $("#page1-content").show();
                $('#obstetrics-team').show();
                break;
            case 'pediatrician':
                $("#page2-content").show();
                $('#pediatrician').show();
                break;
            case 'others':
                $("#page2-content").show();
                $('#others').show();
                break;
        }
        
        // Hide page navigation buttons
        $(".page-btn").hide();
    }
}

function findGetParameter(parameterName) {
    let result = null;
    const params = new URLSearchParams(window.location.search);
    result = params.get(parameterName);
    return result;
}

// ========== MODAL FUNCTIONS ==========
// Open Split Modal
function openPackageModal(card) {
    const modal = document.getElementById('packageModal');
    const image = card.getAttribute('data-image');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    const price = card.getAttribute('data-price');
    
    document.getElementById('modalImage').src = image;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalPrice').textContent = price;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closePackageModal() {
    const modal = document.getElementById('packageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ESC Key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePackageModal();
    }
});

// ========== LIGHTBOX GALLERY FUNCTIONS ==========
// Store all image arrays for each event
const galleries = {
  bahay1: [
    'bahaynimaria/1.png',
    'bahaynimaria/2.png',
    'bahaynimaria/3.png',
    'bahaynimaria/4.png',
    'bahaynimaria/5.png',
    'bahaynimaria/6.png',
    'bahaynimaria/7.png',
    'bahaynimaria/8.png',
    'bahaynimaria/9.png',
    'bahaynimaria/10.png'
  ],
  dra: [
    'letrantalk/1.png',
    'letrantalk/2.png',
    'letrantalk/3.png',
    'letrantalk/4.png',
    'letrantalk/5.png',
    'letrantalk/6.png'
  ],
  medical: [
    'medicalmission/1.png',
    'medicalmission/2.png',
    'medicalmission/3.png',
    'medicalmission/4.png',
    'medicalmission/5.png',
    'medicalmission/6.png',
    'medicalmission/7.png',
    'medicalmission/8.png',
    'medicalmission/9.png',
    'medicalmission/10.png',
    'medicalmission/11.png',
    'medicalmission/12.png',
    'medicalmission/13.png'
  ],
  philcare: [
    'philcare/1.png',
    'philcare/2.png',
    'philcare/3.png',
    'philcare/4.png'
  ]
};

let currentGallery = [];
let currentIndex = 0;

function openLightbox(galleryName, index) {
  currentGallery = galleries[galleryName];
  currentIndex = index;
  
  const lightbox = document.getElementById('lightbox-premium');
  const img = document.getElementById('lightbox-img-premium');
  const counter = document.getElementById('lightbox-counter');
  const thumbContainer = document.getElementById('lightbox-thumbs');
  
  img.src = currentGallery[currentIndex];
  counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  
  // Generate thumbnails
  thumbContainer.innerHTML = '';
  currentGallery.forEach((src, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumb-item-premium' + (i === currentIndex ? ' active' : '');
    thumb.onclick = () => goToImage(i);
    
    const img = document.createElement('img');
    img.src = src;
    
    thumb.appendChild(img);
    thumbContainer.appendChild(thumb);
  });
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-premium');
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function changeImage(direction) {
  currentIndex += direction;
  
  if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  }
  
  updateLightboxImage();
}

function goToImage(index) {
  currentIndex = index;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img-premium');
  const counter = document.getElementById('lightbox-counter');
  
  img.src = currentGallery[currentIndex];
  counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  
  // Update active thumbnail
  document.querySelectorAll('.thumb-item-premium').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === currentIndex);
    if (i === currentIndex) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  const lightbox = document.getElementById('lightbox-premium');
  if (!lightbox || !lightbox.classList.contains('active')) return;
  
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
  if (e.key === 'Escape') closeLightbox();
});



// ========== SERVICES CATEGORY TAB SWITCHING ==========
document.addEventListener('DOMContentLoaded', function() {
    // Get all category buttons and content sections
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    // Add click event to each category button
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target category from data attribute
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all category content sections
            categoryContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Show the target category content
            const targetContent = document.getElementById(targetCategory);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
            }
        });
    });
    
    // Initialize: Show first category by default
    if (categoryContents.length > 0) {
        categoryContents[0].style.display = 'block';
    }
});


// ========== SERVICES IMAGE MODAL FUNCTIONS ==========
// Open fullscreen modal when service image is clicked
function openModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    
    if (modal && modalImg && imgElement) {
        modal.style.display = 'flex';
        modalImg.src = imgElement.src;
        modalImg.alt = imgElement.alt;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}


// Close the modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}


// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.addEventListener('click', function(event) {
            // Close if clicking on the modal background (not the image)
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});


// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal && modal.style.display === 'flex') {
            closeModal();
        }
    }
});

// ========== NEW HORIZONTAL CAROUSEL ==========
function initCarousel() {
    // Get elements
    const imagesHolder = document.querySelector('.images-holder');
    const slides = document.querySelectorAll('.images-holder > div');
    const dots = document.querySelectorAll('.imagebutton-holder .button');
    const prevBtn = document.querySelector('.nav-buttons .prev');
    const nextBtn = document.querySelector('.nav-buttons .next');
    
    // Check if carousel exists
    if (!imagesHolder || slides.length === 0) {
        console.log('No carousel found on this page');
        return;
    }
    
    console.log('✅ Carousel found! Total slides:', slides.length);
    
    let currentSlide = 0;
    let autoSlideTimer;
    const slideWidth = 100; // 100% per slide
    
    // Move to specific slide
    function goToSlide(slideIndex) {
        // Boundary checking
        if (slideIndex >= slides.length) {
            currentSlide = 0;
        } else if (slideIndex < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = slideIndex;
        }
        
        // Calculate position and move
        const moveAmount = -(slideWidth * currentSlide);
        imagesHolder.style.transform = `translateX(${moveAmount}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
        
        console.log(`Now showing slide ${currentSlide + 1} of ${slides.length}`);
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Start auto-slide
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 4000);
        console.log('▶️ Auto-slide started');
    }
    
    // Stop auto-slide
    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
        console.log('⏸️ Auto-slide paused');
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    // Dot indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });
    
    // Initialize
    goToSlide(0);
    startAutoSlide();
    
    console.log('✅ Carousel initialized and running!');
}



// ========== HEADER SCROLL EFFECT ==========
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.main-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});





// ========== NEW UPDATES FEB 2026 ==========




// ========== PAGE LOADER ==========
window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }
});




// ========== SCROLL PROGRESS BAR ==========
document.addEventListener('DOMContentLoaded', function() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});


// ========== SCROLL ANIMATIONS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Create Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate child cards if any
                const cards = entry.target.querySelectorAll('.link-card, .news-card');
                cards.forEach(card => {
                    card.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll(
        '.quick-links-section, .search-section, .latest-news, .location-section, .hmo-partners-section, .main-container, .description-container'
    );
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('✅ Scroll animations initialized!');
});


