// FIREBASE
import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBAOwhsFOpIoc-8qAq9otKallKaG2qQ0Qo",
  authDomain: "tabungan-cinta.firebaseapp.com",
  databaseURL: "https://tabungan-cinta-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tabungan-cinta",
  storageBucket: "tabungan-cinta.firebasestorage.app",
  messagingSenderId: "943179599825",
  appId: "1:943179599825:web:c638eee37126c11af5daf0",
  measurementId: "G-B0Z6SFTYYV"
};

// INIT
const app =
initializeApp(firebaseConfig);

const db =
getDatabase(app);

const dataRef =
ref(db,"tabungan");

let total = 0;

let chart;

// TAMPILKAN DATA REALTIME
onValue(dataRef,(snapshot)=>{

    const data = snapshot.val();

    const tbody =
    document.getElementById("dataTabungan");

    tbody.innerHTML = "";

    total = 0;

    let labels = [];

    let nominalData = [];

    let no = 1;

    for(let id in data){

        const item = data[id];

        total += item.nominal;

        labels.push("Data "+no);

        nominalData.push(item.nominal);

        tbody.innerHTML += `
        <tr>
            <td>${no}</td>
            <td>${item.hari}</td>
            <td>${item.tanggal}</td>
            <td>${item.bulan}</td>
            <td>${item.tahun}</td>

            <td>
            Rp${item.nominal.toLocaleString('id-ID')}
            </td>

            <td>
                <button onclick="hapusData('${id}')">
                    Hapus
                </button>
            </td>
        </tr>
        `;

        no++;
    }

    document.getElementById("total")
    .innerText =
    "Rp"+total.toLocaleString('id-ID');

    document.getElementById("persen")
    .innerText =
    "Total tabungan sekarang Rp "
    + total.toLocaleString('id-ID');

    updateChart(labels,nominalData);
});

// TAMBAH DATA
window.tambahData = function(){

    const tanggalInput =
    document.getElementById("tanggal").value;

    const nominal =
    parseInt(
    document.getElementById("nominal").value
    );

    if(tanggalInput === "" || isNaN(nominal)){
        alert("Isi tanggal dan nominal!");
        return;
    }

    const coin =
    document.getElementById("coinSound");

    coin.currentTime = 0;

    coin.play();

    const tanggalObj =
    new Date(tanggalInput);

    const hari =
    tanggalObj.toLocaleDateString(
        'id-ID',
        {weekday:'long'}
    );

    const tanggal =
    tanggalObj.getDate();

    const bulan =
    tanggalObj.toLocaleDateString(
        'id-ID',
        {month:'long'}
    );

    const tahun =
    tanggalObj.getFullYear();

    push(dataRef,{
        hari,
        tanggal,
        bulan,
        tahun,
        nominal
    });

    document.getElementById("tanggal").value="";
    document.getElementById("nominal").value="";
}

// HAPUS DATA
window.hapusData = function(id){

    remove(ref(db,"tabungan/"+id));
}

// GRAFIK
function updateChart(labels,nominal){

    const ctx =
    document.getElementById("myChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{

        type:'line',

        data:{
            labels:labels,

            datasets:[{
                label:'Tabungan Ade & Sarah 💛',

                data:nominal,

                borderWidth:4,

                tension:0.5,

                fill:true,

                pointRadius:5
            }]
        },

        options:{
            responsive:true
        }
    });
}