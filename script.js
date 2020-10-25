// R0331 Javascript Syksy 2020 Ensimmäisen projektin JavaScript-koodi
// (c) Janne Lahdenperä 2020

var toDoList = [];  // Luodaan tehtävässä käytetty tehtävälista

// Funktio lisää tehtävän listalle, funktiossa ei suoriteta erillistä validointia,
// koska HTML5 tekee sen automaattisesti
function addTask() {
    var newTask = document.createElement('div');    // Luodaan lisättävä div-elementti
    var elementText = document.getElementById('taskText').value;    // Asetetaan elementin teksti lomakkeen kentästä
    newTask.innerHTML = elementText;
    newTask.classList.add('taskField');     // Annetaan elementille id-arvo tyylimäärittelyjä varten
    var importance = document.getElementById('choice').value; // Haetaan elementin tärkeysaste lomakkeesta
    if (importance === 'High') {
        newTask.style.backgroundColor = "#ff3333";  // Asetetaan elementin taustaväri valinnan mukaiseksi
        newTask.value = 1;      // Annetaan elementille lukuarvo 1-3 järjestysfunktiota varten    
    }
    if (importance === 'Medium') {
        newTask.style.backgroundColor = "orange";
        newTask.value = 2;
    }
    if (importance === 'Low') {
        newTask.style.backgroundColor = "#00b300";
        newTask.value = 3;
    }

    var newButton = document.createElement('button');   // Luodaan elementille poistonappi
    newButton.setAttribute('type', 'button');
    newButton.setAttribute('class', 'btn-light');       // Asetetaan napin ulkonäkö
    newButton.setAttribute('onclick', 'removeTask(this.value)');    // Asetetaan napille klikkaustoiminto, napin value-arvo asetetaan kun rivi tulostetaan
    newButton.innerHTML = 'X';                  // Laitetaan nappiin punainen X (väri määritellään css:n puolella)
    newTask.appendChild(newButton);           // Liitetään nappi mukaan elementtiin
    toDoList.push(newTask);                 // Laitetaan uusi elementti listalle
    showList();                           // Tulostetaan lista näytölle
    document.getElementById('taskText').value = "";     // Tyhjennetään syöttökenttä
    document.forms.taskForm.taskText.focus();           // Asetetaan focus kenttään
    return false;                       // Palautetaan false, jotta formin submittaus ei lataa sivua uudestaan
}

// Funktio tulostaa listan näytölle sille varattuun paikkaan
function showList() {
    document.getElementById('resultArea').innerHTML = "";   // Tyhjennetään tulostusalue siellä mahdollisesti olevasta sisällöstä
    for (var i = 0; i < toDoList.length; i++) {         // Käydään tehtävälista läpi
        toDoList[i].children[0].value = i;              // Asetetaan nappielementin arvoksi listan alkion numero (tarvitaan elementtiä poistaessa)
        document.getElementById('resultArea').appendChild(toDoList[i]); // Tulostetaan elementti listan viimeiseksi
    }
}

// Funktio tyhjentää listan
function emptyField() {
    toDoList = [];      // Tyhjennetään lista
    showList();     // Tulostetaan tyhjä lista näytölle
}

// Funktio poistaa listalta nappia vastaavan arvon
function removeTask(removeValue) {
    var removed = parseInt(removeValue);    // Otetaan painetun napin arvo ulos kokonaislukuna
    for (var i = removed; i < toDoList.length - 1; i++) {   // Käydään lista läpi poistettavasta alkiosta loppuun 
        toDoList [i] = toDoList[i + 1];     // Siirretään kaikkia alkioita yksi askel listalla ylöspäin
    }
    toDoList.pop();     // Poistetaan listan viimeinen alkio
    showList();       // Tulostetaan lista
}

// Funktio järjestää listan tärkeysjärjestykseen, järjestämisessä apuna käytetään alkion luonnissa niille annettuja value-arvoja
function orderList() {
    toDoList.sort(function(a, b){return a.value - b.value});    // Käytetään JavaScriptin valmista sort()-algoritmia, annetaan sille käytettävät vertailuluvut
    showList();     // Tulostetaan lista
}

// Funktio tallentaa listan Local Storageen. Tallennettaessa luodaan kaksi erillistä listaa,
// toisessa on listan elementtien html ja toisessa listan elementtien value-arvot 
function saveList() {
    var listText = [];      // Luodaan tarvittavat listat
    var listValues = [];
    for (var i = 0; i < toDoList.length; i++) { // Käydään ToDo-lista läpi
        listText.push(toDoList[i].innerHTML);   // Asetetaan elementin html tallennettavaan listaan
        listValues.push(toDoList[i].value)  // Asetetaan elementin value toiseen tallennettavaan listaan
    }   
    localStorage.setItem("savedText", JSON.stringify(listText));    // Tallennetaan ensimmäinen lista JSON-stringinä
    localStorage.setItem("savedValues", JSON.stringify(listValues));    // Tallennetaan toinen lista JSON-stringinä
}

// Funktio lataa tallennetut listat Local Storagesta ja rakentaa niiden arvojen pohjalta uuden listan
function loadList() {
    if (localStorage.getItem("savedText") === null ||       // Suoritetaan lataus ainoastaan jos tallennettua dataa on olemassa
            localStorage.getItem("savedValues") === null) { 
        return false;       // Jos tallennettua dataa ei löydy, poistutaan funktiosta
    }
    var retrievedText = localStorage.getItem("savedText");      // Haetaan elementtien html-teksti
    var retrievedValues = localStorage.getItem("savedValues");  // Haetaan elementtien value-arvot
    var textArray = JSON.parse(retrievedText);      // Parsitaan molemmat arvot taulukkomuotoon
    var valueArray = JSON.parse(retrievedValues);
    toDoList = [];      // Tyhjennetään tehtävälista
    for (var i = 0; i < textArray.length; i++) {        // Käydään haettu tekstitaulukko läpi
        var newTask = document.createElement('div');    // Luodaan uusi div-elementti
        newTask.innerHTML = textArray[i];       // Asetetaan elementin sisältö
        newTask.classList.add('taskField');     // Annetaan elementille tyylimäärittely-id
        newTask.value = valueArray[i];          // Asetetaan elementin value-arvo
        if (newTask.value == 1) {
            newTask.style.backgroundColor = "#ff3333";  // Asetetaan elementin taustaväri value-arvon mukaan
        }
        if (newTask.value == 2) {
        newTask.style.backgroundColor = "orange";
        }
        if (newTask.value == 3) {
        newTask.style.backgroundColor = "#00b300";
        }
        toDoList.push(newTask); // Lisätään elementti listalle
    }
    showList(); // Tulostetaan lista
}

window.onload = loadList;   // Sivun latautuessa ladataan lista näytölle, jos sellainen löytyy