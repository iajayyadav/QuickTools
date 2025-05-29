document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();
        const messageBox = document.getElementById("form-message");
        const submitButton = contactForm.querySelector('button[type="submit"]');

        // Basic validation
        if (!name || !email || !subject || !message) {
            messageBox.innerHTML = "❌ Please fill in all fields.";
            messageBox.classList.add("error");
            messageBox.classList.remove("success");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageBox.innerHTML = "❌ Please enter a valid email address.";
            messageBox.classList.add("error");
            messageBox.classList.remove("success");
            return;
        }

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-dots">Sending</span>';
        messageBox.innerHTML = "";
        messageBox.classList.remove("success", "error");

        // Replace this URL with your actual Formspree endpoint
        fetch("https://formspree.io/f/xyzwkgaa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message,
                _subject: `New message from ${name}: ${subject}` // Custom email subject
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            messageBox.innerHTML = "✅ Message sent successfully! We'll get back to you soon.";
            messageBox.classList.add("success");
            messageBox.classList.remove("error");
            contactForm.reset();
        })
        .catch(error => {
            console.error("Form submission error:", error);
            messageBox.innerHTML = "❌ Failed to send message. Please try again later.";
            messageBox.classList.add("error");
            messageBox.classList.remove("success");
        })
        .finally(() => {
            // Re-enable submit button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = "Send Message";
        });
    });
}); 