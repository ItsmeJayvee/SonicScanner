const { Stream } = require("stream");

(()=>{

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBojI0YDrNZalZobJHPgQUmLoCGe8QjOac",
        authDomain: "sonicqrscanner.firebaseapp.com",
        databaseURL: "https://sonicqrscanner.firebaseio.com",
        projectId: "sonicqrscanner",
        storageBucket: "sonicqrscanner.appspot.com",
        messagingSenderId: "763781849620",
        appId: "1:763781849620:web:bdecd46867739d8717fd01"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    stopBtn.addEventListener('click', e=>{
        var video1 = document.getElementById('preview');
        stream = video1.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function(track){
            track.stop();
        });
        video1.srcObject = null;
    });

    startBtn.addEventListener('click', e=>{
        var scanner = new Instascan.Scanner({video : document.getElementById('preview'), scanPeriod: 5, mirror: true});
        scanner.addListener('scan', function(content){
            alert(content);
        });
        Instascan.Camera.getCameras().then(function(cameras){
            if(cameras.length > 0){
                scanner.start(cameras[0]);
            }
        })
    });

})();