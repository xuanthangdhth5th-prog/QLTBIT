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
  
  // Remove active class from all submenu items
  const allSubmenuItems = document.querySelectorAll('.submenu li');
  allSubmenuItems.forEach(item => item.classList.remove('active'));
  
  // Add active class to clicked element
  if (e.classList.contains('submenu')) {
    e.classList.add('active');
  }
  
  switch (id) {
    case "pcSection":
      document.getElementById("pcSection").classList.add('active');
      showPC();
      break;
    case "themmoi":
      openForm();
      break;
    case "newprinter":
      openFormPrt();
      break;
    case "printerSection":
      document.getElementById("printerSection").classList.add('active');
      showPrinter();
      break;
    case "routerSection":
      document.getElementById("routerSection").classList.add('active');
      showRouter();
      break;
    case "wifiSection":
      document.getElementById("wifiSection").classList.add('active');
      showWifi();
      break;
    case "switchSection":
      document.getElementById("switchSection").classList.add('active');
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
  // Initialize dropdowns for PC/Laptop form
  initializeTypeDropdown('assetForm', ['Desktop', 'Laptop', 'Macbook']);
  initializeDeptDropdown('assetForm');
  initializeStatusDropdown('assetForm');
}
function openFormPrt() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalPrinter").classList.add("active-flex");
  // Initialize dropdowns for Printer form
  initializeTypeDropdown('assetFormPrinter', ['Máy in đen trắng', 'Máy in màu', 'Máy scan', 'Máy photocopy']);
  initializeDeptDropdown('assetFormPrinter');
  initializeStatusDropdown('assetFormPrinter');
}

function openFormRouter() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalRouter").classList.add("active-flex");
  // Initialize dropdowns for Router form
  initializeStatusDropdown('assetFormRouter');
}

function openFormWifi() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalWifi").classList.add("active-flex");
  // Initialize dropdowns for Access Point form
  initializeStatusDropdown('assetFormWifi');
}

function openFormSwitch() {
  document.getElementById("defaultPage").classList.remove("active");
  document.getElementById("formModalSwitch").classList.add("active-flex");
  // Initialize dropdowns for Switch form
  initializeStatusDropdown('assetFormSwitch');
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

// Initialize dropdowns when forms open
function initializeStatusDropdown(formId) {
  const statusSelect = document.querySelector(`#${formId} #fStatus`);
  if (statusSelect) {
    const statusOptions = ['Đang sử dụng', 'Dự phòng', 'Hỏng', 'Bảo trì', 'Khác'];
    statusSelect.innerHTML = '<option value="">-- Chọn tình trạng --</option>';
    statusOptions.forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      statusSelect.appendChild(option);
    });
  }
}

function initializeDeptDropdown(formId) {
  const deptSelect = document.querySelector(`#${formId} #fDept`);
  if (deptSelect) {
    const deptOptions = ['IT', 'Kế toán', 'Nhân sự', 'Quản lý', 'Khác'];
    deptSelect.innerHTML = '<option value="">-- Chọn phòng ban --</option>';
    deptOptions.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      deptSelect.appendChild(option);
    });
  }
}

function initializeTypeDropdown(formId, types) {
  const typeSelect = document.querySelector(`#${formId} #fType`);
  if (typeSelect) {
    typeSelect.innerHTML = '<option value="">-- Chọn loại --</option>';
    types.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type;
      typeSelect.appendChild(option);
    });
  }
}

// Handle Import Excel file
function handleImport() {
  const importFile = document.getElementById("importFile");
  if (!importFile.files || importFile.files.length == 0) {
    alert("Chọn file Excel!");
    return;
  }
  
  const file = importFile.files[0];
  
  // Check file format
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext !== "xls" && ext !== "xlsx") {
    alert("File không đúng định dạng Excel (.xls, .xlsx)");
    importFile.value = "";
    return;
  }
  
  // Read file with SheetJS
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Imported data:', json);
      alert('Import Excel thành công! ' + json.length + ' dòng được tải.');
      importFile.value = ""; // Reset input
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Lỗi khi đọc file: ' + error.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Export data to Excel
function exportExcel() {
  // Create sample data structure
  const headers = ['STT', 'Mã TB', 'Tên TB', 'Loại', 'Người dùng', 'Phòng ban', 'Trạng thái', 'Cấu hình', 'Ngày nhập', 'Ghi chú'];
  const data = [headers]; // Start with headers
  
  // Get data from current table
  const table = document.querySelector('table tbody');
  if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 1) { // Skip empty rows
        const rowData = [];
        cells.forEach(cell => {
          rowData.push(cell.textContent);
        });
        data.push(rowData);
      }
    });
  }
  
  // Create workbook and add data
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Thiết Bị");
  
  // Download file
  XLSX.writeFile(wb, `Danh_sach_thiet_bi_${new Date().toISOString().slice(0,10)}.xlsx`);
  alert('Export Excel thành công!');
}

// Download template
function downloadTemplate() {
  const templateHeaders = ['Mã TB', 'Tên TB', 'Loại', 'Người dùng', 'Phòng ban', 'Trạng thái', 'Cấu hình', 'Ngày nhập', 'Ghi chú'];
  const templateData = [
    templateHeaders,
    ['IT001', 'Dell Inspiron 15', 'Laptop', 'Nguyễn Văn A', 'IT', 'Đang sử dụng', 'i7/16GB/SSD', '2024-01-10', 'Máy tính xách tay'],
    ['IT002', 'HP Desktop', 'Desktop', 'Trần Thị B', 'Kế toán', 'Đang sử dụng', 'i5/8GB/SSD', '2024-01-15', '']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(templateData);
  ws['A1'].font = { bold: true, color: { rgb: 'FFFFFF' } };
  ws['A1'].fill = { fgColor: { rgb: 'EB8023' } };
  
  // Auto-adjust column widths
  ws['!cols'] = [
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 30 }
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mẫu");
  
  XLSX.writeFile(wb, 'Mau_nhap_thiet_bi.xlsx');
  alert('Tải file mẫu thành công!');
}

// Save item to database (simulated)
function saveItem() {
  const form = event.target.closest('form');
  if (!form) return;
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Validate required fields
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value) {
      field.style.borderColor = '#f44336';
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  
  if (!isValid) {
    alert('Vui lòng điền đủ các trường bắt buộc!');
    return;
  }
  
  console.log('Saving item:', data);
  alert('Lưu dữ liệu thành công!\n' + JSON.stringify(data, null, 2));
  
  // Reset form and close
  form.reset();
  closeForm();
}
