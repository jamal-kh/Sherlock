import Database from "../DB/DB.mjs";

const fullName = document.getElementById("fullName"),
      email = document.getElementById("email"),
      password = document.getElementById("password"),
      confirmPassword = document.getElementById("confirmPassword"),
      register = document.getElementById("register");

function showErrorMessage(element, message) {
    const existingError = element.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();

    const span = document.createElement("span");
    span.className = "error-message"; // Add a class for styling
    span.textContent = message;
    element.parentNode.appendChild(span);
}

confirmPassword.oninput = () => {
    if (password.value !== confirmPassword.value) {
        showErrorMessage(confirmPassword, "Passwords do not match.");
    } else {
        const existingError = confirmPassword.parentNode.querySelector(".error-message");
        if (existingError) existingError.remove();
    }
};

// Handle form submission
register.onclick = async (e) => {
    e.preventDefault(); 

    // Clear all existing error messages
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    // Perform validation
    if (fullName.value.trim() === "") {
        showErrorMessage(fullName, "Full name is required.");
        return;
    }

    if (email.value.trim() === "") {
        showErrorMessage(email, "Email is required.");
        return;
    }

    if (password.value.trim() === "") {
        showErrorMessage(password, "Password is required.");
        return;
    }

    if (password.value.length < 8) {
        showErrorMessage(password, "Password must be at least 8 characters long.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        showErrorMessage(confirmPassword, "Passwords do not match.");
        return;
    }

    // Create a new Database instance and insert user data
    try {
        const data = new Database("UserDB", "users");

        // Prepare user data
        const user = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            password: btoa(password.value.trim()), // Ideally, hash the password before storing
        };

        // Insert user data into the database
        const inserted = await data.insert(user);

        if(inserted){
            const currentUser = new Database("currentUser" , "user");


            currentUser.insert(user)

            window.location = "./index.html"
        }
    } catch (error) {
        // Handle potential errors from the database operation
        console.error("Error during registration:", error);
        alert("An error occurred while registering. Please try again.");
    }
};

