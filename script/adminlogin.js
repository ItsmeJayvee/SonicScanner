(()=>{

    var firebaseConfig = {
        apiKey: "AIzaSyBojI0YDrNZalZobJHPgQUmLoCGe8QjOac",
        authDomain: "sonicqrscanner.firebaseapp.com",
        databaseURL: "https://sonicqrscanner.firebaseio.com",
        projectId: "sonicqrscanner",
        storageBucket: "sonicqrscanner.appspot.com",
        messagingSenderId: "763781849620",
        appId: "1:763781849620:web:bdecd46867739d8717fd01"
    };

    firebase.initializeApp(firebaseConfig);

    var logEmail = document.getElementById('email');
    var logPass = document.getElementById('password');

    $(document).ready(function(){
        $('.modal').modal({
            dismissible: false
        });
    });

    loginBtn.addEventListener('click', e=>{
        if(email.value == "" && password.value == ""){
            emailErr.classList.remove('hide');
            passErr.classList.remove('hide');
        }else if(email.value == "" && password.value != ""){
            emailErr.classList.remove('hide');
            passErr.classList.add('hide');
        }else if(email.value != "" && password.value == ""){
            emailErr.classList.add('hide');
            passErr.classList.remove('hide');
        }else{
            emailErr.classList.add('hide');
            passErr.classList.add('hide');

            const emails    = logEmail.value;
            const passes    = logPass.value;
            const auth      = firebase.auth()
            const promise   = auth.signInWithEmailAndPassword(emails, passes);
            $(document).ready(function(){
                $('#loadingModal').modal('open');
            });
            promise.catch(function(error){
                loginErr.classList.remove('hide');
                loginErr.textContent = error.message;
            });
        }
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.location = 'admin.html';
        } else {
          
        }
      });
})();