document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registrationForm');
    const name = document.getElementById('name');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const loader = document.getElementById('loader');

    // Password requirement elements
    const lowercase = document.getElementById('lowercase');
    const uppercase = document.getElementById('uppercase');
    const number = document.getElementById('number');
    const specialCharacter = document.getElementById('special-character');
    const passwordLength = document.getElementById('password-length');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const genderError = document.createElement('small');
    genderError.classList.add('error-message');
    genderError.innerText = 'Gender is required';
    document.querySelector('.gender-details').appendChild(genderError);

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
            if (input.type === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                    showError(input, 'Invalid email format');
                    return false;
                }
            }
            hideError(input);
            return true;
        }
    }

    // Function to validate passwords match
    function validatePasswordsMatch(password, confirmPassword) {
        if (confirmPassword.value.trim() === '') {
            showError(confirmPassword, 'Confirm password is required');
            return false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            return false;
        } else {
            hideError(confirmPassword);
            return true;
        }
    }

    // Function to validate gender selection
    function validateGender() {
        let isGenderSelected = false;
        genderInputs.forEach(input => {
            if (input.checked) {
                isGenderSelected = true;
            }
        });

        if (!isGenderSelected) {
            genderError.style.display = 'block';
            return false;
        } else {
            genderError.style.display = 'none';
            return true;
        }
    }

    // Password validation
    function validatePasswordRequirements() {
        const passwordValue = password.value;
        const conditions = {
            lowercase: /[a-z]/.test(passwordValue),
            uppercase: /[A-Z]/.test(passwordValue),
            number: /[0-9]/.test(passwordValue),
            specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
            passwordLength: passwordValue.length >= 6 && passwordValue.length <= 20
        };

        const allValid = Object.values(conditions).every(condition => condition);

        updatePasswordCondition(lowercase, conditions.lowercase);
        updatePasswordCondition(uppercase, conditions.uppercase);
        updatePasswordCondition(number, conditions.number);
        updatePasswordCondition(specialCharacter, conditions.specialCharacter);
        updatePasswordCondition(passwordLength, conditions.passwordLength);

        return allValid;
    }

    // Update password condition UI
    function updatePasswordCondition(element, condition) {
        if (condition) {
            element.classList.add('right');
        } else {
            element.classList.remove('right');
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
    name.addEventListener('blur', () => validateInput(name, 'Name is required'));
    username.addEventListener('blur', () => validateInput(username, 'Username is required'));
    email.addEventListener('blur', () => validateInput(email, 'Email is required'));
    phone.addEventListener('blur', () => validateInput(phone, 'Phone number is required'));
    // password.addEventListener('blur', () => validateInput(password, 'Password is required'));
    password.addEventListener('blur', () => {
        const isValid = validateInput(password, 'Password is required');
        if (!isValid || !validatePasswordRequirements()) {
            showError(password, 'Please enter a valid password');
        }
    });
    confirmPassword.addEventListener('blur', () => validatePasswordsMatch(password, confirmPassword));
    genderInputs.forEach(input => {
        input.addEventListener('change', validateGender);
    });

    // Event listener for password input
    password.addEventListener('input', validatePasswordRequirements);

    // Form submit event listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateInput(name, 'Name is required');
        const isUsernameValid = validateInput(username, 'Username is required');
        const isEmailValid = validateInput(email, 'Email is required');
        const isPhoneValid = validateInput(phone, 'Phone number is required');
        // const isPasswordValid = validateInput(password, 'Password is required');
        const isPasswordValid = validateInput(password, 'Password is required') && validatePasswordRequirements();
        const isConfirmPasswordValid = validatePasswordsMatch(password, confirmPassword);
        const isGenderValid = validateGender();

        if (isPasswordValid) {
            hideError(password);
        } else {
            if (password.value.trim() === '') {
                showError(password, 'Password is required');
            }
            else {
                showError(password, 'Please enter a valid password');
            }
        }

        if (isNameValid && isUsernameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && isGenderValid) {
            showLoader();
            $.ajax({
                url: '/check-email-exists',
                type: 'POST',
                data: { email: email.value.trim() },
                success: function(responseEmail) {
                    if (responseEmail.isExist === true) {
                        hideLoader();
                        showError(email, 'Email is already Registered');
                    }
                    else {
                        $.ajax({
                            url: '/check-username-exists',
                            type: 'POST',
                            data: { username: username.value.trim() },
                            success: function(responseUsername) {
                                if (responseUsername.isExist === true) {
                                    hideLoader();
                                    showError(username, 'Username is already Taken');
                                } else {
                                    let gender = '';
                                    genderInputs.forEach(input => {
                                        if (input.checked) {
                                            gender = input.id;
                                        }
                                    });
                                    $.ajax({
                                        url: '/registration',
                                        type: 'POST',
                                        data: { name: name.value.trim(), username: username.value.trim(), email: email.value.trim(), phone: phone.value.trim(), password: password.value.trim(), gender: gender },
                                        success: function(response) {
                                            if (response.status === true) {
                                                hideLoader();
                                                showNotification('notificationInfo', response.message, '/login');
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
                                    hideError(username);
                                }
                            },
                            error: function(error) {
                                hideLoader();
                                console.error('Error:', error);
                                return false;
                            }
                        });
                        hideError(email);
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

$(document).ready(function() {
	$('#password').focus(function() {
		$('#password-tips').show();
	});
	$('#password').blur(function() {
		$('#password-tips').hide();
	});
});
