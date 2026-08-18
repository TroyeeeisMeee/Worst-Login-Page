const allowedChars = /^[a-z0-9!@#$%^&*]+$/;

document.getElementById("submitUsername").addEventListener("click", function() {
    const typedUsername = document.getElementById("username1").value.toLowerCase();

    if (typedUsername === "") {
        alert("Please enter a username.");
        return;
    }
    if (!allowedChars.test(typedUsername)) {
        alert("Password can only contain letters, numbers, and: ! @ # $ % ^ & *");
        return;
    }
    

    sessionStorage.setItem("regUsername", typedUsername);
    document.getElementById("usernameSection").style.display = "none";
    document.getElementById("passwordSection").style.display = "block";
});

document.getElementById("submitPassword").addEventListener("click", function() {
    const typedPassword = document.getElementById("password1").value.toLowerCase();

    if (typedPassword === "") {
        alert("Please enter a password.");
        return;
    }

    if (!allowedChars.test(typedPassword)) {
        alert("Password can only contain letters, numbers, and: ! @ # $ % ^ & *");
        return;
    }

    const hasNumber = /[0-9]/.test(typedPassword);
    const hasSpecial = /[!@#$%^&*]/.test(typedPassword);
    const hasLength = typedPassword.length >= 8;

    if (!hasNumber || !hasSpecial || !hasLength) {
        alert("Password must be 8+ characters, include a number AND a special character (! @ # $ % ^ & *)");
        return;
    }

    sessionStorage.setItem("regPassword", typedPassword);
    alert("Registered! Now log in.");
    window.location.href = "login.html";
});