console.log("Hello world!");


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  collection, 
  addDoc,
  orderBy,
  query, 
  where
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvHgvLEUoS1OKafcszVkGVLm_1ANS5848",
  authDomain: "test-131b1.firebaseapp.com",
  projectId: "test-131b1",
  storageBucket: "test-131b1.appspot.com",
  messagingSenderId: "440526704518",
  appId: "1:440526704518:web:9d79c0455ca880d9bd6607",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// HENTE verdier til element med ID='1'
// Import: getDoc, doc
async function getIdEn() {
  const docID1 = await getDoc(doc(db, 'boker', '1'));
  console.log("Bok 1 sin titel:: "+ docID1.data().titel + docID1.data().antall); // vi skal ha titel til bok med id=1
  console.log("Bok 1 sider: "+ docID1.data().side); // henter ut bok:1 sin verdi i sider
}


// Henter verdier i form i HTML 
document.getElementById('addDocForm').addEventListener('submit', async function(event){
  console.log("Kjører")
  event.preventDefault();

  const titel = document.getElementById('titel').value;
  const side = document.getElementById('side').value;
  const author = document.getElementById('author').value;
  const available = document.getElementById('available').checked;

  console.log("Kjører 3")
  const data = { titel : titel, side : side, author: author, available: available };

  // Sendre verdiene (data) inn i en ny funksjon 
  addNewDoc(data);
})

// Tar data (fra html) inn å legger det i databasen "boker"
async function addNewDoc(data){
  const docRef = await addDoc(collection(db, 'boker'),data);
  await getAll(); 
}

// Henter alle verdiene i databasen "boker"
document.addEventListener('DOMContentLoaded', (event) => {
  window.getAll = async function(orderByField = 'titel', orderByField2=document.getElementById('sortOrder').value) {
    // Tøm tabellens rader
    document.getElementById('bookTableBody').innerHTML = "";

    const querySnapshot = await getDocs(query(collection(db,'boker'), orderBy(orderByField, orderByField2)));
    querySnapshot.forEach((doc) => {
      addRowToTable(doc.data());
    });
  }

  // legger daten i en ny row
  function addRowToTable(data) {
    let table = document.getElementById('bookTableBody');
    let row = table.insertRow(-1);
    
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    
    cell1.innerHTML = data.titel;
    cell2.innerHTML = data.side;
    cell3.innerHTML = data.author;
    cell4.innerHTML = data.available ? 'Yes' : 'No';
  }

  // Kjør getAll når siden lastes
  window.getAll();
});


// -- Oppgave: --
/* Lag flere typer spørringer som foreksempel
  - henter konkrete forfattere
  - henter bøker med antall sider 400
  - henter bøker med 500 sider og mer 
  - henter bøker som starter på, eller inneholder gitte bokstaver og ord 
*/


window.getBooksByAuthor = async function(authorName) {
  const books = await getDocs(
    query(collection(db, "boker"), where("author", "==", authorName))
  );

  books.forEach((doc) => {
    console.log(doc.data());
  });
}

window.getBooksByState = async function(state) {
  const books = await getDocs(
    query(
      collection(db, "boker"), 
      where("available", "==", state)
    )
  );

  books.forEach((doc) => {
    console.log(doc.data());
  });
}
