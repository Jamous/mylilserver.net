// JavaScript source code
var monthlyPayment = 1000;
var interest = [];
var daysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthCounter;
var finalDocumentToPrint = [];
var finalDocumentToSave = [];
var i = 1;
var currentMonth;
var currentDay;
var currentYear;
var currentDayPrintTH;// adds st,nd, rd, and th to the output print file.

function driver() { // Main method
    getDate();
    mathCompoundedMonthly(); // Uncoment to allow intrest every mont
    //mathCompoundedDaily(); // Uncoment to allow interst every day
    saveToFile();
}

function getDate() { // This method sets the date
    var currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentDay = currentDate.getDate();
    currentYear = currentDate.getFullYear();
}

function mathCompoundedMonthly() {

    var principal = document.getElementById("principal").value;
    var payment = document.getElementById("payment").value;
    var time = document.getElementById("time").value;
    var rate = document.getElementById("rate").value;
    var principlePlusIntrest = [];
    principlePlusIntrest[0] = principal;


    while (i < time) {
        
        if (principlePlusIntrest[i] <= 0) {
            alert("You have paid off your morage!");
            saveToFile();
        }
        if (currentDay == 1) {
            currentDayPrintTH = "1st";
        }
        else if (currentDay == 2) {
            currentDayPrintTH = "2nd";
        }
        else if (currentDay == 3) {
            currentDayPrintTH = "3rd";
        }
        else {
            currentDayPrintTH = currentDay + "th";
        }


        if (currentDay == daysPerMonth[currentMonth]) { // This loop is to subtract the payment, which is made on the last day of each month.
            principlePlusIntrest[i - 1] = principlePlusIntrest[i - 1] - payment;

            interest[i] = (principlePlusIntrest[i - 1] * rate);

            var principlePlusIntrestPlaceHolder = parseInt(principlePlusIntrest[i - 1], 10);
            var interestPlaceHolder = parseInt(interest[i]);
            principlePlusIntrest[i] = principlePlusIntrestPlaceHolder + interestPlaceHolder;

            finalDocumentToSave[i - 1] = "\n" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            finalDocumentToPrint[i - 1] = "<br>" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            if (principlePlusIntrest[i] <= 0) {
                alert("You have payed off your loan!!!!");
                i = time;
            }
            i++;
            if (currentMonth == 11) { // This if/else loop is to check if the year is about to end.
                currentMonth = 0;
                currentDay = 1;
                currentYear++;
            }
            else {
                currentMonth++;
                currentDay = 1;
            }
        }
        else { // This method is to compound intrest, which happens every day.
            interest[i] = (principlePlusIntrest[i - 1] * rate);

            principlePlusIntrest[i] = principlePlusIntrest[i - 1];
            finalDocumentToSave[i - 1] = "\n" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            finalDocumentToPrint[i - 1] = "<br>" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            currentDay++;
            i++;
        }
    }

}
function mathCompoundedDaily() {

    var principal = document.getElementById("principal").value;
    var payment = document.getElementById("payment").value;
    var time = document.getElementById("time").value;
    var rate = document.getElementById("rate").value;
    var principlePlusIntrest = [];
    principlePlusIntrest[0] = principal;


    while (i < time) {
        if (principlePlusIntrest[i] <= 0) {
            alert("You have paid off your morage!");
            saveToFile();
        }
        if (currentDay == 1) {
            currentDayPrintTH = "1st";
        }
        else if (currentDay == 2) {
            currentDayPrintTH = "2nd";
        }
        else if (currentDay == 3) {
            currentDayPrintTH = "3rd";
        }
        else {
            currentDayPrintTH = currentDay + "th";
        }


        if (currentDay == daysPerMonth[currentMonth]) { // This loop is to subtract the payment, which is made on the last day of each month.
            principlePlusIntrest[i - 1] = principlePlusIntrest[i - 1] - payment;

            interest[i] = (principlePlusIntrest[i - 1] * rate);

            var principlePlusIntrestPlaceHolder = parseInt(principlePlusIntrest[i - 1], 10);
            var interestPlaceHolder = parseInt(interest[i]);
            principlePlusIntrest[i] = principlePlusIntrestPlaceHolder + interestPlaceHolder;

            finalDocumentToSave[i - 1] = "\n" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            finalDocumentToPrint[i - 1] = "<br>" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            if (principlePlusIntrest[i] <= 0) {
                alert("You have payed off your loan!!!!");
                i = time;
            }

            i++;
            if (currentMonth == 11) { // This if/else loop is to check if the year is about to end.
                currentMonth = 0;
                currentDay = 1;
                currentYear++;
            }
            else {
                currentMonth++;
                currentDay = 1;
            }
        }
        else { // This method is to compound intrest, which happens every day.
            interest[i] = (principlePlusIntrest[i - 1] * rate);

            var principlePlusIntrestPlaceHolder = parseInt(principlePlusIntrest[i - 1], 10);
            var interestPlaceHolder = parseInt(interest[i]);
            principlePlusIntrest[i] = principlePlusIntrestPlaceHolder + interestPlaceHolder;  //principlePlusIntrest[i - 1] + interest[i];
            finalDocumentToSave[i - 1] = "\n" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            finalDocumentToPrint[i - 1] = "<br>" + month[currentMonth] + " " + currentDayPrintTH + " " + currentYear + ", Current amount owed: " + principlePlusIntrest[i];
            currentDay++;
            i++;
        }
    }
}

function saveToFile() {
    var textToSave = "Mortgage calculator";
    document.getElementById('passFinalValues').innerHTML = finalDocumentToPrint;
    textToSave += finalDocumentToSave;

    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'MortgageCalculatorDownload.txt';
    hiddenElement.click();

}
