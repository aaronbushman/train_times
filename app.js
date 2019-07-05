$(function(){

    // firebase
    const config = {
        apiKey: "AIzaSyDVCJwi6x_sIlcC99dmchrBHI3GGSduMkM",
        authDomain: "traintimes-4043b.firebaseapp.com",
        databaseURL: "https://traintimes-4043b.firebaseio.com/",
        projectId: "traintimes-4043b",
        storageBucket: "traintimes-4043b.appspot.com",
        messagingSenderId: "803029831472"
    };
    firebase.initializeApp(config);

    const db = firebase.database();
    // ref db
    const dbRef = db.ref();

    // form values
    const $trName = $('#trainName');
    const $trDest = $('#trainDest');
    const $trDept = $('#firstDept');
    const $trFreq = $('#trainFreq');
    const $submit = $('#submitB');
    const $tbody = $('tbody');
    let trainObj = {};

    
    const getValues = (i) => {
        i.preventDefault();
        // time calc
        let firstTimeCon = moment($trDept.val(), "hh:mm").subtract(1, "years");
        
        let currentTime = moment();
        
        let diffTime = moment().diff(moment(firstTimeCon), "minutes");
        
        let tRemain = diffTime % $trFreq.val();
       
        let minTilTrain = $trFreq.val() - tRemain;
        
        let nextTrain = moment(moment().add(minTilTrain, "minutes")).format("hh:mm");

        // push values into an obj
        trainObj.trName = $trName.val();
        trainObj.trDest = $trDest.val();
        trainObj.trFreq = $trFreq.val();
        trainObj.trNextArr = nextTrain;
        trainObj.trMinsAway = minTilTrain;

        // clear inputs
        $trName.val('');
        $trDest.val('');
        $trDept.val('');
        $trFreq.val('');

        // push to db
        db.ref().push(trainObj);
    }

    // check for database changes
    dbRef.on('child_added', (snapshot) => {
        
        console.log(snapshot.val());
        // push to table
        $tbody.append(`
            <tr>
                <td>${snapshot.val().trName}</td>
                <td>${snapshot.val().trDest}</td>
                <td>${snapshot.val().trFreq}</td>
                <td>${snapshot.val().trNextArr}</td>
                <td>${snapshot.val().trMinsAway}</td>
            </tr>`);
    })

    $submit.on('click', getValues);

})