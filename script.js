// Chart instances
let typeChart = null;
let statusChart = null;

// Initialize dashboard charts
function initDashboard() {
  updateDashboard();
  
  // Type Chart
  const typeCtx = document.getElementById('typeChart');
  if (typeCtx && typeCtx.getContext) {
    typeChart = new Chart(typeCtx, {
      type: 'doughnut',
      data: {
        labels: ['PC/Laptop', 'Printer', 'Router', 'Access Point', 'Switch'],
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#667eea',
            '#f5576c',
            '#00f2fe',
            '#43e97b',
            '#ffa502'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 13 }
            }
          }
        }
      }
    });
  }

  // Status Chart
  const statusCtx = document.getElementById('statusChart');
  if (statusCtx && statusCtx.getContext) {
    statusChart = new Chart(statusCtx, {
      type: 'bar',
      data: {
        labels: ['Đang sử dụng', 'Dự phòng', 'Hỏng', 'Bảo trì', 'Khác'],
        datasets: [{
          label: 'Số lượng',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#43e97b',
            '#f5a623',
            '#f44336',
            '#ff9800',
            '#9c27b0'
          ],
          borderRadius: 5
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              padding: 15
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}

// Update dashboard with data
function updateDashboard() {
  // Sample data - replace with real data from your assets array
  const typeCounts = {
    'Laptop': 0,
    'Desktop': 0,
    'Printer': 0,
    'Router': 0,
    'Khác': 0
  };
  
  const statusCounts = {
    'Đang sử dụng': 0,
    'Dự phòng': 0,
    'Hỏng': 0,
    'Bảo trì': 0,
    'Khác': 0
  };

  // Update counters
  document.getElementById('pcCount').innerText = '0';
  document.getElementById('printerCount').innerText = '0';
  document.getElementById('routerCount').innerText = '0';
  document.getElementById('wifiCount').innerText = '0';
  document.getElementById('switchCount').innerText = '0';

  // Update charts if they exist
  if (typeChart) {
    typeChart.data.datasets[0].data = [
      typeCounts['Laptop'] || 0,
      typeCounts['Printer'] || 0,
      typeCounts['Router'] || 0,
      typeCounts['Khác'] || 0,
      0
    ];
    typeChart.update();
  }

  if (statusChart) {
    statusChart.data.datasets[0].data = [
      statusCounts['Đang sử dụng'] || 0,
      statusCounts['Dự phòng'] || 0,
      statusCounts['Hỏng'] || 0,
      statusCounts['Bảo trì'] || 0,
      statusCounts['Khác'] || 0
    ];
    statusChart.update();
  }
}

function showPC() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("pcPage").classList.add("active");
}
function toggleDeviceMenu() {
  const menu = document.getElementById("deviceMenu");
  const title = document.querySelector(".menu-title");

  if (menu.style.display === "block") {
    menu.style.display = "none";
    title.innerHTML = "▶ Thiết bị";
  } else {
    menu.style.display = "block";
    title.innerHTML = "▼ Thiết bị";
  }
}

function onClickSection(e) {
  console.log(e.id);
  const id = e.id;
  switch (id) {
    case "pcSection":
      showPC();
      break;
    case "themmoi":
      openForm();
      break;
    case "newprinter":
      openFormPrt();
      break;
    case "printerSection":
      showPrinter();
      break;
    case "routerSection":
      showRouter();
      break;
    case "wifiSection":
      showWifi();
      break;
    case "switchSection":
      showSwitch();
      break;
    default:
      document.getElementById("defaultPage").classList.add("active");
      document.getElementById("pcPage").classList.remove("active");
      document.getElementById("printerPage").classList.remove("active");
      document.getElementById("routerPage").classList.remove("active");
      document.getElementById("wifiPage").classList.remove("active");
      document.getElementById("switchPage").classList.remove("active");
      document.getElementById("formModal").classList.remove("active-flex");
      initDashboard();
      break;
  }
}

function showPC() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("pcPage").classList.add("active");
  document.getElementById("printerPage").classList.remove("active");
  document.getElementById("routerPage").classList.remove("active");
  document.getElementById("wifiPage").classList.remove("active");
  document.getElementById("switchPage").classList.remove("active");
}
function showPrinter() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("printerPage").classList.add("active");
  document.getElementById("pcPage").classList.remove("active");
  document.getElementById("routerPage").classList.remove("active");
  document.getElementById("wifiPage").classList.remove("active");
  document.getElementById("switchPage").classList.remove("active");
}
function showRouter() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("routerPage").classList.add("active");
  document.getElementById("pcPage").classList.remove("active");
  document.getElementById("printerPage").classList.remove("active");
  document.getElementById("wifiPage").classList.remove("active");
  document.getElementById("switchPage").classList.remove("active");
}
function showWifi() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("wifiPage").classList.add("active");
  document.getElementById("pcPage").classList.remove("active");
  document.getElementById("printerPage").classList.remove("active");
  document.getElementById("routerPage").classList.remove("active");
  document.getElementById("switchPage").classList.remove("active");
}
function showSwitch() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("switchPage").classList.add("active");
  document.getElementById("pcPage").classList.remove("active");
  document.getElementById("printerPage").classList.remove("active");
  document.getElementById("routerPage").classList.remove("active");
  document.getElementById("wifiPage").classList.remove("active");
}
function toggleSidebar() {
  document.getElementById("sidebar").style.width = "100px";
}
function toggleSub(el) {
  const submenu = el.nextElementSibling;
  const arrow = el.querySelector(".arrow");

  if (submenu.style.display === "block") {
    submenu.style.display = "none";
    arrow.classList.remove("fa-chevron-down");
    arrow.classList.add("fa-chevron-right");
  } else {
    submenu.style.display = "block";
    arrow.classList.remove("fa-chevron-right");
    arrow.classList.add("fa-chevron-down");
  }
}
function openForm() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModal").classList.add("active-flex");
}
function openFormPrt() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalPrinter").classList.add("active-flex");
}

function openFormRouter() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalRouter").classList.add("active-flex");
}

function openFormWifi() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalWifi").classList.add("active-flex");
}

function openFormSwitch() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalSwitch").classList.add("active-flex");
}

function closeForm() {
  document.getElementById("formModal").classList.remove("active-flex");
  document.getElementById("formModalPrinter").classList.remove("active-flex");
  document.getElementById("formModalRouter").classList.remove("active-flex");
  document.getElementById("formModalWifi").classList.remove("active-flex");
  document.getElementById("formModalSwitch").classList.remove("active-flex");
}

// Close modal when clicking outside the modal content
document.addEventListener('click', function(event) {
  const formModal = document.getElementById('formModal');
  const formModalPrinter = document.getElementById('formModalPrinter');
  const formModalRouter = document.getElementById('formModalRouter');
  const formModalWifi = document.getElementById('formModalWifi');
  const formModalSwitch = document.getElementById('formModalSwitch');
  
  if (event.target === formModal) {
    formModal.classList.remove('active-flex');
  }
  if (event.target === formModalPrinter) {
    formModalPrinter.classList.remove('active-flex');
  }
  if (event.target === formModalRouter) {
    formModalRouter.classList.remove('active-flex');
  }
  if (event.target === formModalWifi) {
    formModalWifi.classList.remove('active-flex');
  }
  if (event.target === formModalSwitch) {
    formModalSwitch.classList.remove('active-flex');
  }
});

// function handleImport() {
//     document.getElementById("excelInput").click();
// }

function handleImport() {
  const fileSelect = document.getElementById("importFile");
  fileSelect.click();
}

function handleImport() {
  const importFile = document.getElementById("importFile");
  if (!importFile.files || importFile.files.length == 0)
    return alert("Chọn file Excel!");
  const file = importFile.files[0];

  // 2. Kiểm tra định dạng file
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext !== "xls" && ext !== "xlsx") {
    alert("File không đúng định dạng Excel (.xls, .xlsx)");
    importFile.value = ""; // reset input
    return;
  }
}
