
document.addEventListener('DOMContentLoaded', () => {

//  document.addEventListener('mousedown', e => e.preventDefault());

  // SCROLL RESTORATION
 
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('scrollPos', window.scrollY);
  });

  const scrollPos = localStorage.getItem('scrollPos');
  if (scrollPos) {
    window.scrollTo(0, scrollPos);
  }

  // MOBILE MENU
 
  const menuBtn = document.querySelector('.menu-btn');
  const menuSm = document.querySelector('.menu-Sm');
  const menuClose = document.querySelector('.menu-close');

  if (menuBtn && menuSm && menuClose) {
    menuBtn.addEventListener('click', () => {
      menuSm.classList.remove('hidden');
      menuSm.classList.add('flex');

      setTimeout(() => {
        menuSm.classList.remove('opacity-0', 'pointer-events-none');
        menuSm.classList.add('opacity-100');
      }, 10);
    });

    menuClose.addEventListener('click', () => {
      menuSm.classList.remove('opacity-100');
      menuSm.classList.add('opacity-0', 'pointer-events-none');

      setTimeout(() => {
        menuSm.classList.remove('flex');
        menuSm.classList.add('hidden');
      }, 500);
    });
  }

  
  // INTERSECTION OBSERVER ANIMATIONS
  
  const observeEls = document.querySelectorAll('.observe');
  if (observeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.remove(
            'opacity-0', 'translate-y-20', '-translate-y-20',
            'translate-x-20', '-translate-x-20', 'scale-95', 'scale-105', 'blur-sm'
          );
          el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100', 'blur-0');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    observeEls.forEach(el => observer.observe(el));
  }

  
  // OPEN / CLOSE TOGGLES
 
  const openBtns = document.querySelectorAll('.open');
  const closeBtns = document.querySelectorAll('.close');
  const openTexts = document.querySelectorAll('.open-text');

  if (openBtns.length && closeBtns.length && openTexts.length) {
    openBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        openTexts[index].classList.remove('hidden');
        closeBtns[index].classList.remove('hidden');
        btn.classList.add('hidden');
        // openTexts[index].scrollIntoView({ behavior: 'smooth' });
      });
    });

    closeBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        openTexts[index].classList.add('hidden');
        btn.classList.add('hidden');
        openBtns[index].classList.remove('hidden');
        // openBtns[index].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

 
  // TESTIMONIAL SLIDER

  const track = document.getElementById("testimonialTrack");
  const cards = document.querySelectorAll(".testimonial-card");
  const dotsContainer = document.getElementById("testimonialDots");

  if (track && cards.length && dotsContainer) {
    let currentIndex = 0;
    const total = cards.length;
    let intervalId;

    function getCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function createDots() {
      dotsContainer.innerHTML = "";
      const cardsPerView = getCardsPerView();
      const pages = Math.ceil(total / cardsPerView);

      for (let i = 0; i < pages; i++) {
        const dot = document.createElement("button");
        dot.className = "w-3 h-3 rounded-full bg-gray-300 transition";
        dot.addEventListener("click", () => {
          currentIndex = i * cardsPerView;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const cardsPerView = getCardsPerView();
      const movePercent = 100 / cardsPerView;
      track.style.transform = `translateX(-${currentIndex * movePercent}%)`;

      const activePage = Math.floor(currentIndex / cardsPerView);
      [...dotsContainer.children].forEach((dot, i) => {
        dot.classList.toggle("bg-black", i === activePage);
        dot.classList.toggle("bg-gray-300", i !== activePage);
      });
    }

    function nextSlide() {
      const cardsPerView = getCardsPerView();
      const maxIndex = total - cardsPerView;
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateSlider();
    }

    function startAutoSlide() { intervalId = setInterval(nextSlide, 10000); }
    function stopAutoSlide() { clearInterval(intervalId); }

    track.addEventListener("mouseenter", stopAutoSlide);
    track.addEventListener("mouseleave", startAutoSlide);
    track.addEventListener("touchstart", stopAutoSlide);
    track.addEventListener("touchend", startAutoSlide);

    startAutoSlide();
    createDots();
    updateSlider();

    window.addEventListener("resize", () => {
      currentIndex = 0;
      createDots();
      updateSlider();
    });
  }

  
  // NEWSLETTER SUBSCRIBE
 
  const subscribeBtn = document.querySelector('.subscribe');
  const subscribeMessage = document.querySelector('.subscribe-message');
  const emailInput = document.querySelector('.email-input');

  if (subscribeBtn && subscribeMessage && emailInput) {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (email && email.includes('@')) {
        subscribeMessage.textContent = "Thank you for subscribing!";
        subscribeMessage.classList.remove('text-red-600');
        subscribeMessage.classList.add('text-green-600');
      } else {
        subscribeMessage.textContent = "Please enter a valid email address.";
        subscribeMessage.classList.remove('text-green-600');
        subscribeMessage.classList.add('text-red-600');
      }
    });
  }

  // BOOKING FORM VALIDATION
// Grab elements
const bookBtn = document.querySelector('.book-btn');
const form = document.querySelector('.booking-form');

const inputs = {
  firstname: form.querySelector('.firstname'),
  lastname: form.querySelector('.lastname'),
  email: form.querySelector('.email'),
  number: form.querySelector('.number'),
  date: form.querySelector('.date')
};

const serviceField = form.querySelector('.service');
const serviceDropdown = document.querySelector('.service-dropdown');
const errorMessages = form.querySelectorAll('.error-message');

// Toggle dropdown visibility
form.querySelector('.service-btn').addEventListener('click', () => {
  serviceDropdown.classList.toggle('hidden');
});

// When a service is selected
serviceDropdown.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', () => {
    serviceField.textContent = item.textContent;
    serviceDropdown.classList.add('hidden');

    // Remove service error if any
    const serviceError = serviceField.parentElement.querySelector('.error-message');
    if (serviceError) serviceError.textContent = '';
  });
});

// Click outside closes dropdown
document.addEventListener('click', (e) => {
  if (!serviceField.parentElement.contains(e.target)) {
    serviceDropdown.classList.add('hidden');
  }
});

// Booking validation
bookBtn.addEventListener('click', (e) => {
  e.preventDefault(); // stop page reload

  let hasError = false;

  // Clear previous error messages
  errorMessages.forEach(msg => msg.textContent = '');

  // First Name
  if (!inputs.firstname.value.trim()) {
    inputs.firstname.nextElementSibling.textContent = 'First Name is required';
    hasError = true;
  }

  // Last Name
  if (!inputs.lastname.value.trim()) {
    inputs.lastname.nextElementSibling.textContent = 'Last Name is required';
    hasError = true;
  }

  // Email
  if (!inputs.email.value.trim() || !inputs.email.value.includes('@')) {
    inputs.email.nextElementSibling.textContent = 'Valid Email is required';
    hasError = true;
  }

  // Phone Number
  if (!inputs.number.value.trim()) {
    inputs.number.nextElementSibling.textContent = 'Phone Number is required';
    hasError = true;
  }

  // Appointment Date
  if (!inputs.date.value) {
    inputs.date.nextElementSibling.textContent = 'Appointment Date is required';
    inputs.date.nextElementSibling.style.color = 'red';
    hasError = true;
  }

  // Service selection
  if (serviceField.textContent === 'Select Service') {
    let serviceError = serviceField.parentElement.querySelector('.error-message');
    if (!serviceError) {
      // If no <p> exists, create one
      serviceError = document.createElement('p');
      serviceError.className = 'error-message text-red-600 font-jost';
      serviceField.parentElement.appendChild(serviceError);
    }
    serviceError.textContent = 'Please select a service';
    hasError = true;
  }

  if (!hasError) {
    // Show green success message without clearing inputs
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Booking confirmed!';
    successMessage.className = 'text-green-600 font-jost mt-2';
    
    // Remove old success message if any
    const oldMessage = form.querySelector('.text-green-600');
    if (oldMessage) oldMessage.remove();

    form.appendChild(successMessage);
  }
});

});