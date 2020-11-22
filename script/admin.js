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
    var db      = firebase.firestore();

    $(document).ready(function(){
        $('.sidenav').sidenav();
        $('.modal').modal({
            dismissible: false
        });
    });

    var search = document.querySelector('#printSearch');
    var dqrCode = document.getElementById('dqr');

    function renderSearch(doc){
        let tr      = document.createElement('tr');
        let codeTD  = document.createElement('td');
        let nameTD  = document.createElement('td');
        let viewTD  = document.createElement('td');
        let view    = document.createElement('button');

        view.setAttribute('class', 'btn-flat waves-effect waves-light blue');
        codeTD.style.fontSize   = 'small';
        nameTD.style.fontSize   = 'small';
        codeTD.textContent      = doc.data().DQR;
        nameTD.textContent      = doc.data().fullName;
        view.textContent        = "VIEW";
        
        tr.appendChild(codeTD);
        tr.appendChild(nameTD);
        tr.appendChild(viewTD);
        viewTD.appendChild(view);
        search.appendChild(tr);

        view.addEventListener('click', e=>{
            $(document).ready(function(){
                $('#modalEmployee').modal('open');
            });
            if(doc.data().photo){
                profilePic.src = doc.data().photo
            }
            empdqrcode.value = doc.data().DQR;
            fullname.value = doc.data().fullName;
        });
    }
    
    dqr.addEventListener('keyup', function(event){
        if(event.keyCode === 13){
            db.collection('employees').where('DQR', '==', dqrCode.value.toUpperCase()).get().then(snapshot=>{
                if(snapshot.empty){
                    searchErr.classList.remove('hide');
                }else{
                    snapshot.forEach(doc=>{
                        searchErr.classList.add('hide');
                        renderSearch(doc);
                    });
                }
            });
        }
    });

    closeModal.addEventListener('click', e=>{
        empdqrcode.textContent = "";
        fullname.textContent = "";
        $(document).ready(function(){
            $('#modalEmployee').modal('close');
        });
    });

    uploadBtn.addEventListener('click', e=>{
        uploader.classList.remove('hide');
        fileButton.classList.remove('hide');
        uploadBtn.classList.add('hide');
    });

    var uploader = document.getElementById('uploader');
    var fileBtn  = document.getElementById('fileButton');

    fileBtn.addEventListener('change', function(e){
        var qrValue = document.getElementById('empdqrcode').value;
        var file = e.target.files[0];
        var storage = firebase.storage().ref('photos/' + file.name);
        var task = storage.put(file);
        task.on('state_changed',
        function progress(snapshot){
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        function error(){

        },
        function complete(){
            task.snapshot.ref.getDownloadURL().then(function(downloadURL){
                db.collection('employees').where('DQR', '==', qrValue).get().then(snapshot=>{
                    snapshot.forEach(doc=>{
                        db.collection('employees').doc(doc.id).update({
                            photo: downloadURL
                        }).then(function(){
                            profilePic.src = downloadURL;
                            uploader.classList.add('hide');
                            fileButton.classList.add('hide');
                            uploadBtn.classList.remove('hide');
                        });
                    });
                });
            });
        });
    });

    updateBtn.addEventListener('click', e=>{
        db.collection('employees').where('DQR', '==', empdqrcode.value).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection('employees').doc(doc.id).update({
                    fullName: fullname.value
                }).then(function(){
                    $(document).ready(function(){
                        $('#modalEmployee').modal('close');
                        $('#successModal').modal('open');
                    });
                    empdqrcode.value = "";
                    fullname.value = "";
                });
            });
        });
    });

    logoutBtn.addEventListener('click', e=>{
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          
        } else {
            window.location = 'index.html';
        }
      });
})();