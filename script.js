let total = localStorage.getItem("total")
    ? parseInt(localStorage.getItem("total"))
    : 0;

let dataTabungan = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : [];

const tbody =
document.getElementById("dataTabungan");

function tampilkanData(){

    tbody.innerHTML = "";

    dataTabungan.forEach((item,index)=>{

        tbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.hari}</td>
            <td>${item.tanggal}</td>
            <td>${item.bulan}</td>
            <td>${item.tahun}</td>
            <td>
                Rp${item.nominal.toLocaleString('id-ID')}
            </td>

            <td>
                <button onclick="hapusData(${index})">
                    Hapus
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("total")
    .innerText =
    "Rp" + total.toLocaleString('id-ID');

    updateProgress();

    updateChart();
}

function tambahData(){

    const tanggalInput =
    document.getElementById("tanggal").value;

    const nominal =
    parseInt(
    document.getElementById("nominal").value
    );
const coin =
document.getElementById("coinSound");

coin.currentTime = 0;

coin.play();
    if(tanggalInput === "" || isNaN(nominal)){
        alert("Isi tanggal dan nominal!");
        return;
    }

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

    dataTabungan.push({
        hari,
        tanggal,
        bulan,
        tahun,
        nominal
    });

    total += nominal;

    localStorage.setItem(
        "data",
        JSON.stringify(dataTabungan)
    );

    localStorage.setItem(
        "total",
        total
    );

    tampilkanData();

    document.getElementById("tanggal").value="";
    document.getElementById("nominal").value="";
}

/* PROGRESS TANPA TARGET */
function updateProgress(){

    let persen = total / 100000;

    if(persen > 100){
        persen = 100;
    }

    document.getElementById("progress")
    .style.width = persen + "%";

    document.getElementById("persen")
    .innerText =
    "Total tabungan sekarang Rp "
    + total.toLocaleString('id-ID');
}

/* GRAFIK */
let chart;

function updateChart(){

    const ctx =
    document.getElementById("myChart");

    const labels =
    dataTabungan.map((d,i)=>
        "Data "+(i+1)
    );

    const nominal =
    dataTabungan.map(d=>d.nominal);

    if(chart){
        chart.destroy();
    }

 chart = new Chart(ctx, {

    type: 'line',

    data: {
        labels: labels,

        datasets: [{
            label: 'Tabungan Ade & Sarah 💛',

            data: nominal,

            borderWidth: 4,

            tension: 0.5,

            fill: true,

            pointRadius: 5,

            pointHoverRadius: 8
        }]
    },

    options: {

        responsive: true,

        plugins: {
            legend: {
                display: true
            }
        },

        scales: {

            y: {
                beginAtZero: true
            }

        }

    }
});
}

tampilkanData();
function hapusData(index){

    total -= dataTabungan[index].nominal;

    dataTabungan.splice(index,1);

    localStorage.setItem(
        "data",
        JSON.stringify(dataTabungan)
    );

    localStorage.setItem(
        "total",
        total
    );

    tampilkanData();
}