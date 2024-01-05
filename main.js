// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";

// Add SweetAlert2 CDN in the head of your HTML file
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>

// Your web app's Firebase configuration
// For Firebase JS SDK v9.0.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-AUTH-DOMAIN",
    databaseURL: "YOUR-DATABASE-URL",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-STORAGE-BUCKET",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID",
    measurementId: "YOUR-MEA-SURE-MENT-ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase(app)
const add_data = document.getElementById('add_data');
const notification = document.getElementById('notification')

function showMessage(message, type = "success") {
    Swal.fire({
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500,
    });
}

function AddStudents() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rollnumber = document.getElementById('rollnumber').value;

    set(ref(db, 'students/' + rollnumber), {
        name: name,
        email: email,
        rollnumber: rollnumber
    }).then(() => {
        showMessage("Added");
        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('rollnumber').value = "";
    }).catch((error) => {
        showMessage("Error adding data", "error");
        console.error("Error adding data:", error);
    });
}

add_data.addEventListener('click', AddStudents)

// Read Data

function ReadData() {
    const userRef = ref(db, "students/")

    get(userRef).then((snapshot) => {
        const data = snapshot.val();
        const table = document.querySelector('table')
        let html = '';

        for (const key in data) {
            const { name, email, rollnumber } = data[key];

            html += `
            <tr>
                <td>
                    ${name}
                    ${email}
                    ${rollnumber}
                </td>
                <td><button class"del" onclick="deleteData('${rollnumber}')">Delete</button></td>
                <td><button class"up" onclick="updateData('${rollnumber}')">Update</button></td>
            </tr>
            `
        }
        table.innerHTML = html
    })
}

ReadData()

// Delete Data

window.deleteData = function (rollnumber) {
    const userRef = ref(db, `students/${rollnumber}`);

    remove(userRef).then(() => {
        showMessage("Data Deleted Successfully");
        ReadData();
    }).catch((error) => {
        showMessage("Error deleting data", "error");
        console.error("Error deleting data:", error);
    });
}

// Update data

window.updateData = function (rollnumber) {
    const userRef = ref(db, `students/${rollnumber}`);

    get(userRef).then((item) => {
        document.getElementById('name').value = item.val().name;
        document.getElementById('email').value = item.val().email;
        document.getElementById('rollnumber').value = item.val().rollnumber;
    })

    document.querySelector('.update_data').classList.add('show')

    const update_btn = document.querySelector('#update_data')

    update_btn.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const rollnumber = document.getElementById('rollnumber').value;

        update(ref(db), {
            [`students/${rollnumber}/name`]: name,
            [`students/${rollnumber}/email`]: email,
            [`students/${rollnumber}/rollnumber`]: rollnumber,
        }).then(() => {
            showMessage("Data Updated");
            document.querySelector('.update_data').classList.remove('show');
            document.getElementById('name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('rollnumber').value = "";
            ReadData();
        }).catch((error) => {
            showMessage("Error updating data", "error");
            console.error("Error updating data:", error);
        });
    });
}
