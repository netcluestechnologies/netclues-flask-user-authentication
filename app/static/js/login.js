document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    const username_emailid = document.getElementById('username_emailid');
    const password = document.getElementById('password');
    const loader = document.getElementById('loader');

    // Error message elements
    const username_emailidError = document.getElementById('username_emailidError');
    const passwordError = document.getElementById('passwordError');

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

    // Add blur event listeners for validation
    username_emailid.addEventListener('blur', () => validateInput(username_emailid, 'Username or Email ID is required'));
    password.addEventListener('blur', () => validateInput(password, 'Password is required'));

    // Form submit event listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isUsernameEmailidValid = validateInput(username_emailid, 'Username or Email ID is required');
        const isPasswordValid = validateInput(password, 'Password is required');

        if (isUsernameEmailidValid && isPasswordValid) {
            showLoader();
            $.ajax({
                url: '/login',
                type: 'POST',
                data: { username_emailid: username_emailid.value.trim(), password: password.value.trim() },
                success: function(response) {
                    if (response.status === true) {
                        hideLoader();
                        showNotification('notificationInfo', response.message, '/home');
                    }
                    else {
                        hideLoader();
                        showNotification('notificationError', response.message);
                    }
                },
                error: function(error) {
                    hideLoader();
                    console.error('Error:', error);
                    return false;
                }
            });
        }
    });
});
