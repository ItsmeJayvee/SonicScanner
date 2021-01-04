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
        $('.datepicker').datepicker({
            format: 'mm/dd/yyyy'
        });
        $('select').formSelect();
    });

    var search = document.querySelector('#printSearch');
    var dqrCode = document.getElementById('dqr');
    var reportPrint = document.querySelector('#printReport');
    var siteViews = document.querySelector('#sitetableBody');

    function renderAllEmployees(doc){
        let tr      = document.createElement('tr');
        let codeTD  = document.createElement('td');
        let nameTD  = document.createElement('td');

        tr.setAttribute('data-id', doc.id);
        codeTD.style.fontSize   = 'small';
        nameTD.style.fontSize   = 'small';
        codeTD.textContent      = doc.data().DQR;
        nameTD.textContent      = doc.data().fullName;
        
        tr.appendChild(codeTD);
        tr.appendChild(nameTD);
        search.appendChild(tr);
    }
    
    function renderReport(doc){

        let tr          = document.createElement('tr');
        let tdSite      = document.createElement('td');
        let tdDate      = document.createElement('td');
        let tdTime      = document.createElement('td');
        let tdCode      = document.createElement('td');
        let tdName      = document.createElement('td');
        let tdRemarks   = document.createElement('td');

        tr.setAttribute('data-id', doc.id);
        tdSite.textContent      = doc.data().sitename;
        tdDate.textContent      = doc.data().month+'/'+doc.data().date+'/'+doc.data().year;
        tdTime.textContent      = doc.data().time;
        tdCode.textContent      = doc.data().DQR;
        tdName.textContent      = doc.data().fullname;
        tdRemarks.textContent   = doc.data().remarks;

        tr.appendChild(tdSite);
        tr.appendChild(tdDate);
        tr.appendChild(tdTime);
        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdRemarks);
        reportPrint.appendChild(tr);
    }

    function renderSitesView(doc){
        let tr = document.createElement('tr')
        let tdCode = document.createElement('td');
        let tdName = document.createElement('td');
        let tdView = document.createElement('td');
        let viewDiv = document.createElement('div');
        let leftDiv = document.createElement('div');
        let rightDiv = document.createElement('div');
        let view   = document.createElement('button');
        let deleteBtn = document.createElement('button');

        tr.setAttribute('id', doc.id);
        tdCode.textContent = doc.data().siteCode;
        tdName.textContent = doc.data().siteName;
        viewDiv.setAttribute('class', 'row');
        leftDiv.setAttribute('class', 'col s6 m6 l6 center-align');
        rightDiv.setAttribute('class', 'col s6 m6 l6 center-align');
        view.setAttribute('class', 'btn waves-effect waves-light blue');
        view.textContent = "View";
        deleteBtn.setAttribute('class', 'btn waves-effect waves-light red');
        deleteBtn.textContent = "Delete";
        tr.appendChild(tdCode);
        tr.appendChild(tdName);
        tr.appendChild(tdView);
        tdView.appendChild(viewDiv);
        viewDiv.appendChild(leftDiv);
        viewDiv.appendChild(rightDiv);
        leftDiv.appendChild(view);
        rightDiv.appendChild(deleteBtn);
        siteViews.appendChild(tr);

        view.addEventListener('click', e=>{
            $(document).ready(function(){
                $('#viewSite').modal('open');
            });
            modalSiteCodelabel.classList.add('active');
            modalSiteNamelabel.classList.add('active');
            db.collection('sites').doc(doc.id).get().then(function(doc){
                modalSiteCode.value = doc.data().siteCode;
                modalSiteName.value = doc.data().siteName;
                siteID.value = doc.id;
            });
        });

        deleteBtn.addEventListener('click', e=>{
            $(document).ready(function(){
                $('#deleteSite').modal('open');
            });
            getSiteHiddenId.value = doc.id;
        });

        yesDeleteSiteBtn.addEventListener('click', e=>{
            db.collection('sites').doc(getSiteHiddenId.value).delete().then(function(){
                $(document).ready(function(){
                    $('#deleteSite').modal('close');
                });
            });;
        });

        modalUpdateBtn.addEventListener('click', e=>{
            db.collection('sites').doc(siteID.value).update({
                siteCode: modalSiteCode.value,
                siteName: modalSiteName.value
            }).then(function(){
                successSiteUpdateModal.classList.remove('hide');
            });
        });
    }

    reportType.addEventListener('change', e=>{
        if(reportType.value == "Monthly"){
            monthlyReport.classList.remove('hide');
            dailyReport.classList.add('hide');
        }else{
            monthlyReport.classList.add('hide');
            dailyReport.classList.remove('hide');
        }
    });

    siteBtn.addEventListener('click', e=>{
        home.classList.add('hide');
        employeeDiv.classList.add('hide');
        siteDiv.classList.remove('hide');
        scansDiv.classList.add('hide');
    });

    employeeBtn.addEventListener('click', e=>{
        home.classList.add('hide');
        employeeDiv.classList.remove('hide');
        siteDiv.classList.add('hide');
        scansDiv.classList.add('hide');
    });

    reportBtn.addEventListener('click', e=>{
        home.classList.add('hide');
        employeeDiv.classList.add('hide');
        siteDiv.classList.add('hide');
        scansDiv.classList.remove('hide');
    });

    submitSiteBtn.addEventListener('click', e=>{
        if(sitecode.value == "" && sitename.value == ""){
            siteCodeErr.classList.remove('hide');
            siteNameErr.classList.remove('hide');
        }else if(sitecode.value != "" && sitename.value == ""){
            siteCodeErr.classList.add('hide');
            siteNameErr.classList.remove('hide');
        }else if(sitecode.value == "" && sitename.value != ""){
            siteCodeErr.classList.remove('hide');
            siteNameErr.classList.add('hide');
        }else{
            siteCodeErr.classList.add('hide');
            siteNameErr.classList.add('hide');
            db.collection('sites').add({
                siteCode: sitecode.value,
                siteName: sitename.value
            }).then(function(){
                sitecode.value = "";
                sitename.value = "";
                successSite.classList.remove('hide');
            });
        }
    });

    dqr.addEventListener('keyup', function(event){
        if(event.keyCode === 13){
            $(document).ready(function(){
                $("#loadingModal").modal('open');
            });
            db.collection('employees').where('DQR', '==', dqrCode.value.toUpperCase()).get().then(snapshot=>{
                if(snapshot.empty){
                    searchErr.classList.remove('hide');
                    printBtn.classList.add('hide');
                    printEmployeeDQR.classList.add('hide');
                    $(document).ready(function(){
                        $("#loadingModal").modal('close');
                    });
                }else{
                    snapshot.forEach(doc=>{
                        printEmployeeDQR.classList.remove('hide');
                        searchErr.classList.add('hide');
                        printQR.textContent = doc.data().DQR;
                        printNmae.textContent = doc.data().fullName;
                        printBtn.classList.remove('hide');
                        printBtn.addEventListener('click', e=>{
                            $(document).ready(function(){
                                $('#modalEmployee').modal('open');
                            });
                            documentID.value = doc.id;
                            empdqrcode.value = doc.data().DQR;
                            fullname.value = doc.data().fullName;
                            qrlabel.classList.add('active');
                            if(fullname.value != ""){
                                fnlabel.classList.add('active');
                            }
                        });
                        $(document).ready(function(){
                            $("#loadingModal").modal('close');
                        });
                    });
                }
            });
        }
    });

    closeModal.addEventListener('click', e=>{
        addempdqrcode.textContent = "";
        fullname.textContent = "";
        $(document).ready(function(){
            $('#modalEmployee').modal('close');
        });
    });

    closeaddEmployeeModal.addEventListener('click', e=>{
        empdqrcode.textContent = "";
        addfullname.textContent = "";
        $(document).ready(function(){
            $('#addEmployee').modal('close');
        });
    });

    addEmployeeBtn.addEventListener('click', e=>{
        $(document).ready(function(){
            $('#addEmployee').modal('open');
        });
    });

    addBtn.addEventListener('click', e=>{
        if(addempdqrcode.value == "" && addfullname.value == ""){
            errQr.classList.remove('hide');
            errName.classList.remove('hide');
        }else if(addempdqrcode.value != "" && addfullname.value == ""){
            errQr.classList.add('hide');
            errName.classList.remove('hide');
        }else if(addempdqrcode.value == "" && addfullname.value != ""){
            errQr.classList.remove('hide');
            errName.classList.add('hide');
        }else{
            errQr.classList.add('hide');
            errName.classList.add('hide');
            db.collection('employees').add({
                DQR: addempdqrcode.value,
                fullName: addfullname.value
            }).then(function(){
                $(document).ready(function(){
                    $('#addEmployee').modal('close');
                    $('#addSuccess').modal('open');
                });
                addempdqrcode.value = "";
                addfullname.value = "";
            });
        }
    });

    updateEmployeeBtn.addEventListener('click', e=>{
        console.log(documentID.value);
        db.collection('employees').doc(documentID.value).update({
            DQR: empdqrcode.value,
            fullName: fullname.value
        }).then(function(){
            console.log("updated!");
            $(document).ready(function(){
                $('#modalEmployee').modal('close');
                $('#successModal').modal('open');
            });
            empdqrcode.value = "";
            fullname.value = "";
            printEmployeeDQR.classList.add('hide');
        });
    });

    logoutBtn.addEventListener('click', e=>{
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
    });

    dateSubmit.addEventListener('click', e=>{
        printReport.innerHTML = "";
        if(reportType.value == "Monthly"){
            invalid.classList.add('hide');
            console.log(monthReport.value);
            db.collection('reports').where('month', '==', Number(monthReport.value)).orderBy('date').orderBy('year').orderBy('time').orderBy('sitename').get().then((snapshot)=>{
                if(snapshot.empty){
                    noScansErr.classList.remove('hide');
                    exprtExcelBtn.classList.add('hide');
                    printReport.innerHTML = "";
                }else{
                    noScansErr.classList.add('hide');
                    exprtExcelBtn.classList.remove('hide'); 
                    snapshot.forEach(doc=>{
                        renderReport(doc);
                    });
                }
            });
        }else if(reportType.value == "Daily"){
            invalid.classList.add('hide');
            var fulldate = reportDate.value;
            var getMonth = fulldate.charAt(0)+""+fulldate.charAt(1);
            var getDate = fulldate.charAt(3)+""+fulldate.charAt(4);
            var getYear = fulldate.charAt(6)+""+fulldate.charAt(7)+""+fulldate.charAt(8)+""+fulldate.charAt(9);
            console.log(getMonth+''+getDate+''+getYear);
            db.collection('reports').where('month', '==', Number(getMonth)).where('date', '==', Number(getDate)).where('year', '==', Number(getYear)).orderBy('time').orderBy('sitename').get().then((snapshot)=>{
                if(snapshot.empty){
                    noScansErr.classList.remove('hide');
                    exprtExcelBtn.classList.add('hide');
                    printReport.innerHTML = "";
                }else{
                    noScansErr.classList.add('hide');
                    exprtExcelBtn.classList.remove('hide');
                    snapshot.forEach(doc=>{
                        renderReport(doc);
                    });
                }
            });
        }else{
            invalid.classList.remove('hide');
        }
    });

    addnewsiteButton.addEventListener('click', e=>{
        siteTable.classList.add('hide');
        addNewSiteDiv.classList.remove('hide');
        addnewsiteButton.classList.add('hide');
    });

    backSubmitBtn.addEventListener('click', e=>{
        siteTable.classList.remove('hide');
        addNewSiteDiv.classList.add('hide');
        addnewsiteButton.classList.remove('hide');
        successSite.classList.add('hide');
    });

    viewAllEmployeeBtn.addEventListener('click', e =>{
        exportEmployeesDiv.classList.remove('hide');
        db.collection('employees').orderBy('fullName').get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
                renderAllEmployees(doc)
            });
        });
    });

    exportEmployeesBtn.addEventListener('click', e=>{
        var html = document.getElementById("employeeTable").outerHTML;
        export_table_to_csv1(html, "Employee_List_"+year+"/"+month+"/"+date+".csv");
    });

    function download_csv1(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function export_table_to_csv1(html, filename) {
        var csv = [];
        var rows = document.querySelectorAll("#employeeTable tr");
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            csv.push(row.join(","));		
        }
        download_csv1(csv.join("\n"), filename);
    }

    function download_csv(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function export_table_to_csv(html, filename) {
        var csv = [];
        var rows = document.querySelectorAll("#reportTable tr");
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");
            for (var j = 0; j < cols.length; j++) 
                row.push(cols[j].innerText);
            csv.push(row.join(","));		
        }
        download_csv(csv.join("\n"), filename);
    }

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var date = d.getDate();
    
    exprtExcelBtn.addEventListener("click", function () {
        var html = document.getElementById("reportTable").outerHTML;
        export_table_to_csv(html, "Scan_Report_"+year+"/"+month+"/"+date+".csv");
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection('sites').orderBy('siteCode').onSnapshot(snapshot=>{
                snapshot.docChanges().forEach(change=>{
                    if(change.type === 'added'){
                        renderSitesView(change.doc)
                    }else if(change.type === 'removed'){
                        let tr = siteViews.querySelector('#' + change.doc.id);
                        siteViews.removeChild(tr);
                    }
                });
            });
        } else {
            window.location = 'index.html';
        }
    });
})();