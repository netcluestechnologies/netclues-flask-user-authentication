document.addEventListener("DOMContentLoaded", () => {
    const emailid = document.getElementById('emailid');
    const sendOtpButton = document.getElementById('sendOtpButton');
    const sendOtpSection = document.getElementById('send-otp-section');
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.getElementById('verifyOtpButton');
    const notificationContainer = document.getElementById('notificationContainer');
    const loader = document.getElementById('loader');

    // Error message elements
    const emailidError = document.getElementById('emailidError');
    const otpError = document.getElementById('otpError');

    // Function to show error message
    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.innerText = message;
        errorElement.style.display = 'block';
    }

    // Function to hide error message
    function hideError(input) {
        const errorElement = input.nextElementSibling;
        errorElement.style.display = 'none';
    }

    // Function to validate input
    function validateInput(input, message) {
        if (input.value.trim() === '') {
            showError(input, message);
            return false;
        } else {
            hideError(input);
            return true;
        }
    }

    // Validate Email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to show notification
    function showNotification(notificationClass, message, redirectUrl = null) {
        const notification = document.createElement('div');
        notification.classList.add(notificationClass);
        notification.innerText = message;
        notificationContainer.appendChild(notification);

        // Show the notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            }, 500);
        }, (redirectUrl ? 1000 : 3000));
    }

    // Show loader
    function showLoader() {
        loader.style.display = 'flex';
    }

    // Hide loader
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Send OTP button click event
    sendOtpButton.addEventListener('click', () => {
        const isEmailValid = validateInput(emailid, 'Email ID is required') && validateEmail(emailid.value);

        if (isEmailValid) {
            // Sending OTP
            showLoader();
            $.ajax({
                url: '/sent-otp',
                type: 'POST',
                data: { email: emailid.value.trim() },
                success: function(response) {
                    if (response.status === true) {
                        hideLoader();
                        showNotification('notificationInfo', 'OTP sent to your Email ID...');
                        // Hide Send OTP button and show OTP section
                        sendOtpSection.style.display = 'none';
                        document.querySelectorAll('.otp-section').forEach(section => section.style.display = 'block');

                        // Disable email input
                        emailid.disabled = true;
                    }
                    else {
                        hideLoader();
                        showNotification('notificationError', 'Email ID is Not Exist !!!');
                    }
                }
            });
        } else {
            hideLoader();
            showError(emailid, 'Please enter a valid Email ID');
        }
    });

    // Verify OTP button click event
    verifyOtpButton.addEventListener('click', () => {
        const isOtpValid = validateInput(otpInput, 'OTP is required') && otpInput.value.trim().length === 6;

        if (isOtpValid) {
            // Verifying OTP
            showLoader();
            $.ajax({
                url: '/verify-otp',
                type: 'POST',
                data: { email: emailid.value.trim(), otp: otpInput.value.trim() },
                success: function(response) {
                    if (response.status === true) {
                        hideLoader();
                        showNotification('notificationInfo', response.message, '/home');
                    }
                    else {
                        hideLoader();
                        showNotification('notificationError', response.message);
                    }
                }
            });
        } else {
            hideLoader();
            showError(otpInput, 'Please enter a valid 6-digit OTP');
        }
    });
});
