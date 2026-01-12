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

function filtered() {
  return assets.filter(
    (a) =>
      (!filterType.value || a.type === filterType.value) &&
      (!filterDept.value || a.dept === filterDept.value) &&
      JSON.stringify(a).toLowerCase().includes(search.value.toLowerCase())
  );
}

const total = document.getElementById("total");
const using = document.getElementById("using");
const other = document.getElementById("other");
const filterType = document.getElementById("filterType");

/* Data */
const depts = [
  "Ban Giám đốc",
  "PC-KSTT",
  "HCNS",
  "TCKT",
  "KDTV",
  "Mua hàng",
  "CNTT",
  "Khai thác",
  "Kỹ thuật",
  "XCĐ",
  "Cơ giới",
  "Logistics & GN",
];
const types = ["Laptop", "Desktop", "Khác"];
const statuses = ["Đang sử dụng", "Dự phòng", "Hỏng", "Bảo trì", "Khác"];

function initSelect(el, arr, all) {
  el.innerHTML = all ? `<option value="">${all}</option>` : "";
  arr.forEach((v) => (el.innerHTML += `<option>${v}</option>`));
}
initSelect(filterType, types, "Tất cả thiết bị");
initSelect(filterDept, depts, "Tất cả phòng ban");
initSelect(fType, types);
initSelect(fDept, depts);
initSelect(fStatus, statuses);

filterType.onchange =
  filterDept.onchange =
  search.oninput =
    () => {
      page = 1;
      render();
    };

function closeForm() {
  document.getElementById("formModal").classList.remove("active-flex");
  document.getElementById("formModalPrinter").classList.remove("active-flex");
  document.getElementById("closeBtn").classList.remove("active-flex");
}

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
