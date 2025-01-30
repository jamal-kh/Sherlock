import Database from "../DB/DB.mjs";

const email = document.getElementById("email"),
      password = document.getElementById("password"),
      login = document.getElementById("loginBtn");



login.onclick = async () =>{
    if(email.value == "" || password.value == ""){
        alert("the email and password required");
        return;
    }


    const data = new Database("UserDB" , "users");

    
    const user = await data.get('email' , email.value)

    const confirmPassword = atob(user.password) === password.value;

    if(user && confirmPassword){
        window.location = "./index.html";

        const currentUser = new Database("currentUser" , "user");


        currentUser.insert(user)
    }


}