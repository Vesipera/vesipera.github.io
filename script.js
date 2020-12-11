// R0331 Javascript Syksy 2020 Kolmannen projektin JavaScript-koodi
// (c) Janne Lahdenperä 2020

var jsonObj; // Luodaan objekti, johon haettava tieto tallennetaan globaalina muuttujana. Näin siihen pääsee käsiksi kaikista funktioista

// Funktio lähettää pyynnön webcal.fi-sivulle ja hakee sieltä tiedot kuluvan vuoden liputuspäivistä
function loadData() {
    var tempDate = new Date();  // Otetaan tämänhetkinen päiväys väliaikaiseen muuttujaan
    var currentYear = tempDate.getFullYear();
    var currentDate = tempDate.toISOString().slice(0,10); // Muutetaan päiväys ISO-muotoon ja poimitaan siitä vuosi, kuukausi ja päivä
    
    // Määritetään haettavan JSON-tiedon osoite kuluvan vuoden perusteella
    if (currentYear == 2020) {
        var url = "Liputuspäivät (2020).json";
    } else if (currentYear == 2021) {
        var url = "Liputuspäivät (2021).json";
    } else if (currentYear == 2022) {
        var url = "Liputuspäivät (2022).json";
    } else if (currentYear == 2023) {
        var url = "Liputuspäivät (2023).json";
    } else if (currentYear == 2024) {
        var url = "Liputuspäivät (2024).json";
    } else if (currentYear == 2025) {
        var url = "Liputuspäivät (2025).json";
    } else {
        // Virhetilanteessa ilmoitetaan käyttäjälle
        window.alert("Virhe liputuspäivätietojen hakemisessa!");
        return;
    }
    // Haetaan tarvittava tieto, asetetaan se muuttujaan ja viedään tarkastettavaksi
    $.getJSON(url, function(json) {
        jsonObj = json;
        checkDate(currentDate);
    });
}

// Funktio saa arvonaan päiväyksen ja tarkistaa onko se liputuspäivä
function checkDate(givenDate) {
    var result = "";    // Luodaan tyhjä merkkijono vastausta varten
    var foundResult = false; // Tarkastusmuuttuja vastauksen löytämistä varten

    for (var i = 0; i < jsonObj.length; i++) {  // Käydään olion kentät läpi
        if (jsonObj[i].date == givenDate) {     // Tarkastetaan täsmääkö joku olion päivämääristä funktiolle annettuun arvoon
            result += "<b>Kyllä! Tänään on " + jsonObj[i].name.slice(4) + "!</b>"; // Liputuspäivä löytyi! Kirjoitetaan se vastaukseen
            $('#result').css('background-color', '#98FB98');
            foundResult = true; // Muutetaan tarkastusmuuttujan arvo
        }
    }

    if (foundResult == false) { // Annettu päivä ei ole liputuspäivä, ilmoitetaan siitä käyttäjälle
        result += "Ei, tänään ei ole virallista liputuspäivää.<br>Muista kuitenkin että liputukseen voi olla myös muita syitä.<br>";
        result += checkNextFlagDay(givenDate);  // Kerrotaan myös milloin on seuraava virallinen liputuspäivä
        $('#result').css('background-color', '#FFC0CB');
    }

    $('#result').html(result); // Laitetaan vastaus näkymään sivulle
}

// Funktio saa arvokseen päivämäärän ja kertoo sitä seuraavan liputuspäivän
function checkNextFlagDay(givenDate) {
    var result = "";    // Tyhjä merkkijono vastausta varten
    var testDate = new Date(givenDate); // Luodaan annetusta päivämäärästä olio vertailua varten
    
    for (var i = 0; i < jsonObj.length; i++) {  // Käydään olion kentät läpi
        var jsonDate = new Date(jsonObj[i].date);   // Tehdään päivämäärän sisältävästä merkkijonosta olio vertailua varten
        if (jsonDate > testDate) {  // Katsotaan läytyykö seuraavaa liputuspäivää
            result += "<b>Seuraava virallinen liputuspäivä on " + jsonObj[i].name.slice(4) // Liputuspäivä löytyi, ilmoitetaan siitä
            + " " + jsonDate.getDate() + "." + (jsonDate.getMonth() + 1) + ".</b>";
            return result;  // Palautetaan tulos kutsuneelle funktiolle
        }        
    }

    // Kuluvalta vuodelta ei löytynyt enää liputuspäiviä, kerrotaan siitä käyttäjälle
    return "<b>Tänä vuonna ei ole enää virallisia liputuspäiviä!</b>";
}

// Funktio sivulta löytyvän päiväyksen tarkastamiseen ja edelleen lähettämiseen
function testDate() {
    var dateValue = $('#customDate').val(); // Haetaan päivämääräkentän arvo omaan muuttujaan
    var currentYear = new Date().getFullYear(); // Kuluva vuosi vertailua varten
    var checkedYear = new Date(dateValue).getFullYear();   // Päivämääräkentän vuosi vertailua varten
    if (dateValue === "") { // Kenttä on tyhjä, ilmoitetaan siitä käyttäjälle
        $('#result').html("Annoit tyhjän arvon!");
        $('#result').css('background-color', '#D3D3D3');
    } else if (checkedYear !== currentYear) {  // Palvelu toimii ainoastaan kuluvan vuoden päivämäärillä
        $('#result').html("Sivu toimii tällä hetkellä vain vuoden " + currentYear + " päivämäärillä!");
        $('#result').css('background-color', '#D3D3D3');
    } else {
        checkDate(dateValue); // Päiväys on kelvollinen, lähetetään se eteenpäin liputuspäiviä tarkastavalle funktiolle
    }
}

// Toiminnallisuus testaa-napille
$('#testButton').click(function() {
    testDate();
});

// Nappi näyttää ja piilottaa päivämäärän valinnan
$('#showButton').click(function() {
    $('#dateSelector').slideToggle();
});

$(document).ready(loadData()); // Sivun latautuessa ladataan tiedot verkosta muuttujaan