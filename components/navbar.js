import Database from "../DB/DB.mjs";

const navbar = document.getElementById("navbarCom");
const url = window.location.pathname.slice(1).split(".")[0];

const DB = new Database("currentUser" , 'user');

function handleLogout() {
    DB.deleteDatabase()
    // Redirect to login page
    window.location.href = 'login.html';
}

async function initNavbar() {
    let isLoggedIn = await DB.getAll();
    let userImage = isLoggedIn.length ? isLoggedIn[0].profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" : null;

    navbar.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-lg">
                <a class="navbar-brand" href="#">
                    <img src="./assets/download.jpg" alt="Logo" style="width: 50px;">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link ${url === 'index' ? 'active' : ''}" href="index.html">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${url === 'aboutus' ? 'active' : ''}" href="aboutus.html">About us</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${url === 'blog' ? 'active' : ''}" href="blog.html">Blog</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${url === 'contact' ? 'active' : ''}" href="contact.html">Contact</a>
                        </li>
                    </ul>
                    <div class="d-flex ms-lg-3 align-items-center gap-2">
                        ${
                            isLoggedIn.length
                            ? `<div class="d-flex align-items-center gap-2">
                                    <a href="profile.html" class="text-decoration-none">
                                        <img src="${userImage}" 
                                             alt="User Image" 
                                             class="rounded-circle" 
                                             style="width:40px; height:40px; object-fit: cover;">
                                    </a>
                                    <button class="btn btn-outline-danger" id="logoutBtn">
                                        <i class="fa-solid fa-right-from-bracket"></i>
                                    </button>
                               </div>`
                            : `<div class="d-flex gap-2">
                                    <a href="register.html" class="btn btn-outline-light">Register</a>
                                    <a href="login.html" class="btn btn-light">Log in</a>
                               </div>`
                        }
                    </div>
                </div>
            </div>
        </nav>
    `;

    // Attach event listener after rendering the navbar
    if (isLoggedIn.length) {
        document.getElementById("logoutBtn").addEventListener("click", handleLogout);
    }
}

initNavbar();
