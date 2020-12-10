// R0331 Javascript Syksy 2020 Kolmannen projektin JavaScript-koodi
// (c) Janne Lahdenperä 2020

var jsonObj; // Luodaan objekti, johon haettava tieto tallennetaan globaalina muuttujana. Näin siihen pääsee käsiksi kaikista funktioista

document.getElementById('testButton').addEventListener('click', testDate); // Luodaan sivun napille kuuntelija

// Funktio lähettää pyynnön webcal.fi-sivulle ja hakee sieltä tiedot kuluvan vuoden liputuspäivistä
function loadData() {
    var tempDate = new Date();  // Otetaan tämänhetkinen päiväys väliaikaiseen muuttujaan
    var currentDate = tempDate.toISOString().slice(0,10); // Muutetaan päiväys ISO-muotoon ja poimitaan siitä vuosi, kuukausi ja päivä
    
    // Haettavan json-tiedon osoite, kierrätetään se cors-anywhere palvelun kautta
    var url = "https://cors-anywhere.herokuapp.com/https://www.webcal.fi/cal.php?id=2&format=json&start_year=current_year&end_year=current_year&tz=Europe%2FHelsinki";
    var xmlhttp = new XMLHttpRequest(); // Muuttuja AJAX-pyyntöä varten
    xmlhttp.open("GET", url, true);   // Luodaan pyyntö aiemmin määriteltyyn osoitteeseen
    xmlhttp.send(); // Lähetetään pyyntö
  
    xmlhttp.onreadystatechange = function() { // Odotetaan vastausta
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) { // Saadaan kelvollinen vastaus
            jsonObj = JSON.parse(xmlhttp.responseText); // Luodaan vastauksesta JSON-olio
            checkDate(currentDate); // Katsotaan onko tänään liputuspäivä
        }
    }
}

// Funktio saa arvonaan päiväyksen ja tarkistaa onko se liputuspäivä
function checkDate(givenDate) {
    var result = "";    // Luodaan tyhjä merkkijono vastausta varten
    var foundResult = false; // Tarkastusmuuttuja vastauksen löytämistä varten

    for (var i = 0; i < jsonObj.length; i++) {  // Käydään olion kentät läpi
        if (jsonObj[i].date == givenDate) {     // Tarkestetaan täsmääkö joku olion päivämääristä funktiolle annettuun arvoon
            result += "Kyllä! Tänään on " + jsonObj[i].name.slice(4) + "!"; // Liputuspäivä löytyi! Kirjoitetaan se vastaukseen
            document.getElementById('result').style.backgroundColor = '#98FB98';
            foundResult = true; // Muutetaan tarkastusmuuttujan arvo
        }
    }

    if (foundResult == false) { // Annettu päivä ei ole liputuspäivä, ilmoitetaan siitä käyttäjälle
        result += "Ei, tänään ei ole virallista liputuspäivää.<br>Muista kuitenkin että liputukseen voi olla myös muita syitä.<br>";
        result += checkNextFlagDay(givenDate);  // Kerrotaan myös milloin on seuraava virallinen liputuspäivä
        document.getElementById('result').style.backgroundColor = '#FFC0CB';
    }

    document.getElementById('result').innerHTML = result;   // Laitetaan vastaus näkymään sivulle
}

// Funktio saa arvokseen päivämäärän ja kertoo sitä seuraavan liputuspäivän
function checkNextFlagDay(givenDate) {
    var result = "";    // Tyhjä merkkijono vastausta varten
    var testDate = new Date(givenDate); // Luodaan annetusta päivämäärästä olio vertailua varten
    
    for (var i = 0; i < jsonObj.length; i++) {  // Käydään olion kentät läpi
        var jsonDate = new Date(jsonObj[i].date);   // Tehdään päivämäärän sisältävästä merkkijonosta olio vertailua varten
        if (jsonDate > testDate) {  // Katsotaan läytyykö seuraavaa liputuspäivää
            result += "Seuraava virallinen liputuspäivä on " + jsonObj[i].name.slice(4) // Liputuspäivä löytyi, ilmoitetaan siitä
            + " " + jsonDate.getDate() + "." + (jsonDate.getMonth() + 1) + ".";
            return result;  // Palautetaan tulos kutsuneelle funktiolle
        }        
    }

    // Kuluvalta vuodelta ei löytynyt enää liputuspäiviä, kerrotaan siitä käyttäjälle
    return "Tänä vuonna ei ole enää virallisia liputuspäiviä.";
}

// Funktio sivulta löytyvän päiväyksen tarkastamiseen ja edelleen lähettämiseen
function testDate() {
    var dateValue = document.getElementById('customDate').value; // Haetaan päivämääräkentän arvo omaan muuttujaan
    var currentYear = new Date().getFullYear(); // Kuluva vuosi vertailua varten
    var checkedYear = new Date(dateValue).getFullYear();   // Päivämääräkentän vuosi vertailua varten
    if (dateValue === "") { // Kenttä on tyhjä, ilmoitetaan siitä käyttäjälle
        document.getElementById('result').innerHTML = "Annoit tyhjän arvon!";
        document.getElementById('result').style.backgroundColor = '#D3D3D3';
    } else if (checkedYear !== currentYear) {  // Palvelu toimii ainoastaan kuluvan vuoden päivämäärillä
        document.getElementById('result').innerHTML = "Sivu toimii tällä hetkellä vain vuoden " + currentYear + " päivämäärillä!";
        document.getElementById('result').style.backgroundColor = '#D3D3D3';
    } else {
        checkDate(dateValue); // Päiväys on kelvollinen, lähetetään se eteenpäin liputuspäiviä tarkastavalle funktiolle
    }
}

window.onload = loadData; // Sivun latautuessa ladataan tiedot verkosta muuttujaan