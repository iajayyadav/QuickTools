document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('.submit-btn');
    const inputs = form.querySelectorAll('input, textarea, select');

    // Add placeholder attributes for floating label effect
    inputs.forEach(input => {
        input.setAttribute('placeholder', ' '); // Space placeholder for floating label effect
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showMessage('Oops! Something went wrong. Please try again later.', 'error');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                if (!input.value.trim()) {
                    markInvalid(input);
                    isValid = false;
                } else if (input.type === 'email' && !emailRegex.test(input.value)) {
                    markInvalid(input);
                    isValid = false;
                } else {
                    markValid(input);
                }
            }
        });

        return isValid;
    }

    // Input validation styling
    function markInvalid(input) {
        input.style.borderColor = '#ff4c4c';
        input.style.backgroundColor = 'rgba(255, 76, 76, 0.05)';
    }

    function markValid(input) {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    }

    // Show form message
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        
        // Scroll to message if not in view
        if (!isElementInViewport(formMessage)) {
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Auto-hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.className = 'form-message';
                formMessage.style.opacity = '';
            }, 300);
        }, 5000);
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.hasAttribute('required')) {
                if (this.value.trim()) {
                    markValid(this);
                }
            }
        });

        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                if (!this.value.trim()) {
                    markInvalid(this);
                } else if (this.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        markInvalid(this);
                    } else {
                        markValid(this);
                    }
                } else {
                    markValid(this);
                }
            }
        });
    });
}); 