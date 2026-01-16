// Chart instances
let typeChart = null;
let statusChart = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
  setupImportHandler();
  loadEquipmentData(); // Load data from database
});

// Initialize dashboard charts
function initDashboard() {
  updateDashboard();
  
  // Type Chart
  const typeCtx = document.getElementById('typeChart');
  if (typeCtx && typeCtx.getContext) {
    if (typeChart) typeChart.destroy();
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
    if (statusChart) statusChart.destroy();
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

// Update dashboard with data from database
async function updateDashboard() {
  try {
    // Get counts from all tables
    const pcRes = await fetch('http://localhost:3000/api/equipment?type=PC');
    const printerRes = await fetch('http://localhost:3000/api/equipment?type=Printer');
    const routerRes = await fetch('http://localhost:3000/api/equipment?type=Router');
    const wifiRes = await fetch('http://localhost:3000/api/equipment?type=WiFi');
    const switchRes = await fetch('http://localhost:3000/api/equipment?type=Switch');
    
    const pcData = await pcRes.json();
    const printerData = await printerRes.json();
    const routerData = await routerRes.json();
    const wifiData = await wifiRes.json();
    const switchData = await switchRes.json();
    
    const pcCount = pcData.success ? pcData.data.length : 0;
    const printerCount = printerData.success ? printerData.data.length : 0;
    const routerCount = routerData.success ? routerData.data.length : 0;
    const wifiCount = wifiData.success ? wifiData.data.length : 0;
    const switchCount = switchData.success ? switchData.data.length : 0;
    
    // Update counters
    const pcCountEl = document.getElementById('pcCount');
    const printerCountEl = document.getElementById('printerCount');
    const routerCountEl = document.getElementById('routerCount');
    const wifiCountEl = document.getElementById('wifiCount');
    const switchCountEl = document.getElementById('switchCount');
    
    if (pcCountEl) pcCountEl.innerText = pcCount;
    if (printerCountEl) printerCountEl.innerText = printerCount;
    if (routerCountEl) routerCountEl.innerText = routerCount;
    if (wifiCountEl) wifiCountEl.innerText = wifiCount;
    if (switchCountEl) switchCountEl.innerText = switchCount;
    
    // Calculate status counts
    const allData = [
      ...(pcData.success ? pcData.data : []),
      ...(printerData.success ? printerData.data : []),
      ...(routerData.success ? routerData.data : []),
      ...(wifiData.success ? wifiData.data : []),
      ...(switchData.success ? switchData.data : [])
    ];
    
    const statusCounts = {
      'Đang sử dụng': 0,
      'Dự phòng': 0,
      'Hỏng': 0,
      'Bảo trì': 0,
      'Khác': 0
    };
    
    allData.forEach(item => {
      const status = item.TrangThai || 'Khác';
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts['Khác']++;
      }
    });
    
    // Update charts if they exist
    if (typeChart) {
      typeChart.data.datasets[0].data = [pcCount, printerCount, routerCount, wifiCount, switchCount];
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
    
    console.log('Dashboard updated:', { pcCount, printerCount, routerCount, wifiCount, switchCount });
  } catch (err) {
    console.error('Error updating dashboard:', err);
  }
}

// Load statistics for each equipment type
async function loadTypeStats(type = 'PC') {
  try {
    const response = await fetch(`http://localhost:3000/api/equipment?type=${type}`);
    const result = await response.json();
    const data = result.success ? result.data : [];
    
    // Calculate counts
    const total = data.length;
    const using = data.filter(item => item.TrangThai === 'Đang sử dụng').length;
    const other = total - using;
    
    // Map type to element IDs
    const typeMap = {
      'PC': { total: 'pcTotal', using: 'pcUsing', other: 'pcOther' },
      'Printer': { total: 'printerTotal', using: 'printerUsing', other: 'printerOther' },
      'Router': { total: 'routerTotal', using: 'routerUsing', other: 'routerOther' },
      'WiFi': { total: 'wifiTotal', using: 'wifiUsing', other: 'wifiOther' },
      'Switch': { total: 'switchTotal', using: 'switchUsing', other: 'switchOther' }
    };
    
    const ids = typeMap[type];
    if (ids) {
      const totalEl = document.getElementById(ids.total);
      const usingEl = document.getElementById(ids.using);
      const otherEl = document.getElementById(ids.other);
      
      if (totalEl) totalEl.innerText = total;
      if (usingEl) usingEl.innerText = using;
      if (otherEl) otherEl.innerText = other;
    }
    
    console.log(`Stats for ${type}:`, { total, using, other });
  } catch (err) {
    console.error(`Error loading stats for ${type}:`, err);
  }
}

// Show/hide pages
function showPage(pageId, activeMenuId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active');
  }
  
  // Update active menu
  document.querySelectorAll('.submenu li').forEach(item => item.classList.remove('active'));
  if (activeMenuId) {
    const activeMenu = document.getElementById(activeMenuId);
    if (activeMenu) {
      activeMenu.classList.add('active');
    }
  }
  
  // Load equipment data based on page
  if (pageId === 'pcPage' || pageId === 'printerPage' || pageId === 'routerPage' || pageId === 'wifiPage' || pageId === 'switchPage') {
    let equipmentType = 'PC';
    if (pageId === 'printerPage') equipmentType = 'Printer';
    else if (pageId === 'routerPage') equipmentType = 'Router';
    else if (pageId === 'wifiPage') equipmentType = 'WiFi';
    else if (pageId === 'switchPage') equipmentType = 'Switch';
    
    loadEquipmentData(equipmentType);
    loadTypeStats(equipmentType);
  }
  
  // Initialize dashboard if showing default page
  if (pageId === 'defaultPage') {
    initDashboard();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.style.width === '280px') {
    sidebar.style.width = '80px';
  } else {
    sidebar.style.width = '280px';
  }
}

function toggleSub(el) {
  const submenu = el.nextElementSibling;
  const arrow = el.querySelector('.arrow');

  if (submenu.style.display === 'block') {
    submenu.style.display = 'none';
    arrow.classList.remove('fa-chevron-down');
    arrow.classList.add('fa-chevron-right');
  } else {
    submenu.style.display = 'block';
    arrow.classList.remove('fa-chevron-right');
    arrow.classList.add('fa-chevron-down');
  }
}

function openForm() {
  const form = document.getElementById('assetForm');
  form.reset();
  document.getElementById('formModal').classList.add('active-flex');
  // Initialize dropdowns for PC/Laptop form
  initializeTypeDropdown('assetForm', ['Desktop', 'Laptop', 'Macbook']);
  initializeDeptDropdown('assetForm');
  initializeStatusDropdown('assetForm');
}

function openFormPrt() {
  const form = document.getElementById('assetFormPrinter');
  form.reset();
  document.getElementById('formModalPrinter').classList.add('active-flex');
  // Initialize dropdowns for Printer form
  initializeTypeDropdown('assetFormPrinter', ['Máy in đen trắng', 'Máy in màu', 'Máy scan', 'Máy photocopy']);
  initializeDeptDropdown('assetFormPrinter');
  initializeStatusDropdown('assetFormPrinter');
}

function openFormRouter() {
  const form = document.getElementById('assetFormRouter');
  form.reset();
  document.getElementById('formModalRouter').classList.add('active-flex');
  // Initialize dropdowns for Router form
  initializeTypeDropdown('assetFormRouter', ['Router', 'Modem', 'Gateway']);
  initializeDeptDropdown('assetFormRouter');
  initializeStatusDropdown('assetFormRouter');
}

function openFormWifi() {
  const form = document.getElementById('assetFormWifi');
  form.reset();
  document.getElementById('formModalWifi').classList.add('active-flex');
  // Initialize dropdowns for Access Point form
  initializeTypeDropdown('assetFormWifi', ['Access Point', 'WiFi Mesh', 'Wireless Router']);
  initializeDeptDropdown('assetFormWifi');
  initializeStatusDropdown('assetFormWifi');
}

function openFormSwitch() {
  const form = document.getElementById('assetFormSwitch');
  form.reset();
  document.getElementById('formModalSwitch').classList.add('active-flex');
  // Initialize dropdowns for Switch form
  initializeTypeDropdown('assetFormSwitch', ['Managed Switch', 'Unmanaged Switch', 'PoE Switch']);
  initializeDeptDropdown('assetFormSwitch');
  initializeStatusDropdown('assetFormSwitch');
}

function closeForm() {
  document.getElementById('formModal').classList.remove('active-flex');
  document.getElementById('formModalPrinter').classList.remove('active-flex');
  document.getElementById('formModalRouter').classList.remove('active-flex');
  document.getElementById('formModalWifi').classList.remove('active-flex');
  document.getElementById('formModalSwitch').classList.remove('active-flex');
}

// Close modal when clicking outside the modal content
document.addEventListener('click', function(event) {
  const modals = ['formModal', 'formModalPrinter', 'formModalRouter', 'formModalWifi', 'formModalSwitch'];
  
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      modal.classList.remove('active-flex');
    }
  });
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

// Setup import file handler
function setupImportHandler() {
  const importInput = document.getElementById('importFile');
  if (importInput) {
    importInput.addEventListener('change', function() {
      handleImport();
    });
  }
}

// Handle Import Excel file
function handleImport() {
  const importFile = document.getElementById('importFile');
  if (!importFile.files || importFile.files.length === 0) {
    alert('Vui lòng chọn file Excel!');
    return;
  }
  
  const file = importFile.files[0];
  
  // Check file format
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext !== 'xls' && ext !== 'xlsx') {
    alert('File không đúng định dạng Excel (.xls, .xlsx)');
    importFile.value = '';
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
      
      console.log('Dữ liệu import:', json);
      alert('Import Excel thành công! ' + json.length + ' dòng được tải.');
      importFile.value = ''; // Reset input
    } catch (error) {
      console.error('Lỗi khi đọc file:', error);
      alert('Lỗi khi đọc file: ' + error.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Export data to Excel
function exportExcel() {
  // Create sample data structure based on current page
  const activePage = document.querySelector('.page.active');
  let headers = ['STT', 'Mã TB', 'Tên TB', 'Loại', 'Người dùng', 'Phòng ban', 'Trạng thái', 'Ghi chú'];
  
  if (activePage && activePage.id === 'printerPage') {
    headers = ['STT', 'Mã TB', 'Tên TB', 'Hãng/Model', 'Loại máy', 'Địa điểm', 'Phòng ban', 'Trạng thái', 'Ghi chú'];
  } else if (activePage && activePage.id === 'routerPage') {
    headers = ['STT', 'Mã TB', 'Tên TB', 'Hãng', 'Model', 'IP WAN', 'IP LAN', 'Vị trí', 'Ngày lắp', 'Trạng thái', 'Ghi chú'];
  }
  
  const data = [headers];
  
  // Get data from current table
  const table = document.querySelector('table tbody');
  if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 1) {
        const rowData = [];
        cells.forEach((cell, cellIndex) => {
          if (cellIndex < headers.length) {
            rowData.push(cell.textContent.trim());
          }
        });
        if (rowData.some(cell => cell !== '')) {
          data.push(rowData);
        }
      }
    });
  }
  
  // Create workbook and add data
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Thiết Bị');
  
  // Style header row
  ws['!cols'] = Array(headers.length).fill({ wch: 18 });
  
  // Download file
  const fileName = `Danh_sach_thiet_bi_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
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
  XLSX.utils.book_append_sheet(wb, ws, 'Mẫu');
  
  XLSX.writeFile(wb, 'Mau_nhap_thiet_bi.xlsx');
}

// Save item to database
async function saveItem() {
  const form = event.target.closest('form');
  if (!form) return;
  
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
  
  // Determine equipment type from form ID
  let equipmentType = 'PC';
  if (form.id === 'assetFormPrinter') {
    equipmentType = 'Printer';
  } else if (form.id === 'assetFormRouter') {
    equipmentType = 'Router';
  } else if (form.id === 'assetFormWifi') {
    equipmentType = 'WiFi';
  } else if (form.id === 'assetFormSwitch') {
    equipmentType = 'Switch';
  }
  
  // Get form data from elements by ID - support both name and id
  const maTB = form.querySelector('#fCode')?.value || '';
  const tenTB = form.querySelector('#fName')?.value || '';
  const loaiTB = form.querySelector('#fType')?.value || '';
  const phongBan = form.querySelector('#fDept')?.value || '';
  const trangThai = form.querySelector('#fStatus')?.value || 'Đang sử dụng';
  const ghiChu = form.querySelector('#fNote')?.value || '';
  
  // PC-specific fields
  const nguoiDung = form.querySelector('#fUser')?.value || '';
  const cauHinh = form.querySelector('#fConfig')?.value || '';
  const ngayNhap = form.querySelector('#fDate')?.value || new Date().toISOString().split('T')[0];
  
  // Printer-specific fields
  const diaDiemDat = form.querySelector('[id*="fUser"]')?.value || '';
  
  // Router-specific fields
  const hang = form.querySelector('#fBrand')?.value || '';
  const model = form.querySelector('#fModel')?.value || '';
  const ipWan = form.querySelector('#fIpWan')?.value || '';
  const ipLan = form.querySelector('#fIpLan')?.value || '';
  const viTriLapDat = form.querySelector('#fLocation')?.value || form.querySelector('#fPlacement')?.value || '';
  const ngayLapDat = form.querySelector('#fDate')?.value || '';
  
  // WiFi-specific fields
  const ssid = form.querySelector('#fSsid')?.value || '';
  const ipQuanLyField = form.querySelector('#fIp')?.value || '';
  
  // Switch-specific fields
  const soPort = form.querySelector('#fPort')?.value || '0';
  const soCong = form.querySelector('#fUplink')?.value || '0';
  const poe = form.querySelector('#fPoe')?.value || '';
  
  // Validate data not empty
  if (!maTB || !tenTB || !loaiTB || !phongBan) {
    alert('Lỗi: Mã TB, Tên TB, Loại TB, Phòng ban không được trống!');
    return;
  }
  
  const data = {
    maTB: maTB,
    tenTB: tenTB,
    loaiTB: loaiTB,
    phongBan: phongBan,
    trangThai: trangThai,
    ghiChu: ghiChu,
    equipmentType: equipmentType, // Add equipment type explicitly
    // PC fields
    nguoiDung: nguoiDung,
    cauHinh: cauHinh,
    ngayNhap: ngayNhap,
    // Printer fields
    diaDiemDat: diaDiemDat,
    // Router fields
    hang: hang,
    model: model,
    ipWan: ipWan,
    ipLan: ipLan,
    viTriLapDat: viTriLapDat,
    ngayLapDat: ngayLapDat,
    // WiFi fields
    ssid: ssid,
    ipQuanLy: ipQuanLyField,
    // Switch fields
    soPort: soPort,
    soCong: soCong,
    poe: poe
  };
  
  console.log('Dữ liệu gửi:', data);
  console.log('Form ID:', form.id);
  
  try {
    const response = await fetch('http://localhost:3000/api/equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('✓ Lưu dữ liệu thành công!');
      form.reset();
      closeForm();
      
      // Determine equipment type from form ID
      let equipmentType = 'PC';
      if (form.id === 'assetFormPrinter') {
        equipmentType = 'Printer';
      } else if (form.id === 'assetFormRouter') {
        equipmentType = 'Router';
      } else if (form.id === 'assetFormWifi') {
        equipmentType = 'WiFi';
      } else if (form.id === 'assetFormSwitch') {
        equipmentType = 'Switch';
      }
      
      loadEquipmentData(equipmentType); // Reload data with correct type
    } else {
      alert('❌ Lỗi: ' + result.message);
    }
  } catch (err) {
    console.error('Error saving equipment:', err);
    alert('❌ Lỗi kết nối đến server: ' + err.message);
  }
}

// Load equipment data from database
async function loadEquipmentData(type = 'PC') {
  try {
    const response = await fetch(`http://localhost:3000/api/equipment?type=${encodeURIComponent(type)}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Equipment data for', type, ':', result.data);
      // Update table with fetched data
      displayEquipmentData(result.data, type);
    }
  } catch (err) {
    console.error('Error loading equipment:', err);
  }
}

// Display equipment data in table
function displayEquipmentData(data, type = 'PC') {
  if (!data || data.length === 0) {
    console.log('No data to display for type:', type);
    return;
  }
  
  // Find the correct table based on type
  let tableId = 'pcTable';
  if (type.toLowerCase().includes('printer')) {
    tableId = 'printerTable';
  } else if (type.toLowerCase().includes('router')) {
    tableId = 'routerTable';
  } else if (type.toLowerCase().includes('wifi') || type.toLowerCase().includes('access point')) {
    tableId = 'wifiTable';
  } else if (type.toLowerCase().includes('switch')) {
    tableId = 'switchTable';
  }
  
  const table = document.getElementById(tableId);
  if (!table) {
    console.log('Table not found:', tableId);
    return;
  }
  
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    console.log('Table body not found for table:', tableId);
    return;
  }
  
  // Xóa hết dữ liệu cũ
  tbody.innerHTML = '';
  
  // Thêm dữ liệu mới dựa trên loại thiết bị
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    let rowHTML = `<td>${index + 1}</td><td>${item.MaTB || ''}</td>`;
    
    if (type.toLowerCase().includes('pc') || type.toLowerCase().includes('laptop')) {
      // PC/Laptop columns
      rowHTML += `
        <td>${item.TenTB || ''}</td>
        <td>${item.LoaiTB || ''}</td>
        <td>${item.NguoiDung || ''}</td>
        <td>${item.PhongBan || ''}</td>
        <td>${item.TrangThai || ''}</td>
        <td>${item.CauHinh || ''}</td>
        <td>${new Date(item.NgayNhap || new Date()).toLocaleDateString('vi-VN')}</td>
        <td>${item.GhiChu || ''}</td>
      `;
    } else if (type.toLowerCase().includes('printer')) {
      // Printer columns
      rowHTML += `
        <td>${item.TenTB || ''}</td>
        <td>${item.Hang || ''}</td>
        <td>${item.Model || ''}</td>
        <td>${item.DiaDiemDat || ''}</td>
        <td>${item.PhongBan || ''}</td>
        <td>${item.TrangThai || ''}</td>
        <td>${item.GhiChu || ''}</td>
      `;
    } else if (type.toLowerCase().includes('router')) {
      // Router columns
      rowHTML += `
        <td>${item.TenTB || ''}</td>
        <td>${item.Hang || ''}</td>
        <td>${item.Model || ''}</td>
        <td>${item.IpWan || ''}</td>
        <td>${item.IpLan || ''}</td>
        <td>${item.ViTriLapDat || ''}</td>
        <td>${item.NgayLapDat ? new Date(item.NgayLapDat).toLocaleDateString('vi-VN') : ''}</td>
        <td>${item.TrangThai || ''}</td>
        <td>${item.GhiChu || ''}</td>
      `;
    } else if (type.toLowerCase().includes('wifi') || type.toLowerCase().includes('access point')) {
      // WiFi columns
      rowHTML += `
        <td>${item.SSID || ''}</td>
        <td>${item.ThietBiAP || ''}</td>
        <td>${item.Hang || ''}</td>
        <td>${item.Model || ''}</td>
        <td>${item.IpQuanLy || ''}</td>
        <td>${item.ViTriLapDat || ''}</td>
        <td>${item.TrangThai || ''}</td>
        <td>${item.GhiChu || ''}</td>
      `;
    } else if (type.toLowerCase().includes('switch')) {
      // Switch columns
      rowHTML += `
        <td>${item.Hang || ''}</td>
        <td>${item.Model || ''}</td>
        <td>${item.IpQuanLy || ''}</td>
        <td>${item.SoPort || ''}</td>
        <td>${item.SoCong || ''}</td>
        <td>${item.ViTriLapDat || ''}</td>
        <td>${item.PoE || ''}</td>
        <td>${item.TrangThai || ''}</td>
        <td>${item.GhiChu || ''}</td>
      `;
    }
    
    row.innerHTML = rowHTML;
    tbody.appendChild(row);
  });
  
  console.log('Displayed', data.length, 'rows for type:', type);
}
