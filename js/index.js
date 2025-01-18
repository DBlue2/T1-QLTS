const apiURL = "http://localhost:4000/DSTaiSan";

let editingAssetId = null; // ID của tài sản đang được chỉnh sửa
let currentPage = 1; // Trang hiện tại
let pageSize = 5; // Số bản ghi trên mỗi trang
let assets = []; // Toàn bộ dữ liệu tài sản

// Hàm tải danh sách tài sản
async function loadAssets() {
  const response = await fetch(apiURL);
  assets = await response.json();
  renderTable();
}

// Hàm phân trang
function paginate(array, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

// Hàm render bảng
function renderTable() {
  const tableBody = document.getElementById("table-body");
  const paginatedAssets = paginate(assets, currentPage, pageSize);
  tableBody.innerHTML = "";

  paginatedAssets.forEach((asset, index) => {
    const row = `
      <tr>
        <td>${(currentPage - 1) * pageSize + index + 1}</td>
        <td><input type="checkbox"></td>
        <td>${asset.DT_QLTS_TS_MaTaiSan}</td>
        <td>${asset.DT_QLTS_TS_TenTaiSan}</td>
        <td>${asset.DT_QLTS_TS_NhapKho_DonViTinh}</td>
        <td>${asset.DT_QLTS_TS_NhomTaiSan}</td>
        <td>${asset.DT_QLTS_TS_LoaiTaiSan}</td>
        <td>${asset.DT_QLTS_TS_ThuongHieu}</td>
        <td>${asset.DT_QLTS_TS_NgayDuaVaoSuDung.split("T")[0]}</td>
        <td>${asset.DT_QLTS_TS_NhapKho_MaNhanSu}</td>
        <td>${asset.DT_QLTS_TS_NhapKho_TenKho_Ten}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="openEditForm('${asset.id}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAsset('${asset.id}')">Xóa</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  renderPagination();
}

// Hàm render thanh phân trang
function renderPagination() {
  const totalPages = Math.ceil(assets.length / pageSize);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = "btn btn-outline-primary btn-sm mx-1";
    if (i === currentPage) button.classList.add("active");
    button.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationContainer.appendChild(button);
  }
}

// Hàm thay đổi số bản ghi hiển thị trên mỗi trang
function changePageSize(newSize) {
  pageSize = parseInt(newSize, 10) || 5; // Mặc định là 5 nếu không hợp lệ
  currentPage = 1; // Reset về trang đầu tiên
  renderTable();
}

// Hàm mở form thêm mới tài sản
function openAddForm() {
  editingAssetId = null;
  resetForm();
  document.getElementById("addAssetModalLabel").textContent = "Thêm mới tài sản";
}

// Hàm mở form chỉnh sửa tài sản
async function openEditForm(assetId) {
  editingAssetId = assetId;
  const response = await fetch(`${apiURL}/${assetId}`);
  const asset = await response.json();

  document.getElementById("assetCode").value = asset.DT_QLTS_TS_MaTaiSan;
  document.getElementById("assetName").value = asset.DT_QLTS_TS_TenTaiSan;
  document.getElementById("unit").value = asset.DT_QLTS_TS_NhapKho_DonViTinh;
  document.getElementById("assetGroup").value = asset.DT_QLTS_TS_NhomTaiSan;
  document.getElementById("assetType").value = asset.DT_QLTS_TS_LoaiTaiSan;
  document.getElementById("brand").value = asset.DT_QLTS_TS_ThuongHieu;
  document.getElementById("useDate").value = asset.DT_QLTS_TS_NgayDuaVaoSuDung.split("T")[0];
  document.getElementById("importCode").value = asset.DT_QLTS_TS_NhapKho_MaNhanSu;
  document.getElementById("importName").value = asset.DT_QLTS_TS_NhapKho_TenKho_Ten;
  document.getElementById("serialNumber").value = asset.DT_QLTS_TS_SerialNumber;

  document.getElementById("addAssetModalLabel").textContent = "Chỉnh sửa tài sản";
  const modal = new bootstrap.Modal(document.getElementById("addAssetModal"));
  modal.show();
}

// Hàm reset form
function resetForm() {
  document.getElementById("addAssetForm").reset();
}


// Hàm lưu tài sản
async function saveAsset(event) {
  event.preventDefault();

  const assetData = {
    DT_QLTS_TS_Chon: false,
    DT_QLTS_TS_MaTaiSan: document.getElementById("assetCode").value,
    DT_QLTS_TS_TenTaiSan: document.getElementById("assetName").value,
    DT_QLTS_TS_NhapKho_DonViTinh: document.getElementById("unit").value,
    DT_QLTS_TS_NhomTaiSan: parseInt(document.getElementById("assetGroup").value),
    DT_QLTS_TS_LoaiTaiSan: document.getElementById("assetType").value,
    DT_QLTS_TS_ThuongHieu: document.getElementById("brand").value,
    DT_QLTS_TS_NgayDuaVaoSuDung: document.getElementById("useDate").value,
    DT_QLTS_TS_NhapKho_MaNhanSu: document.getElementById("importCode").value,
    DT_QLTS_TS_NhapKho_TenKho_Ten: document.getElementById("importName").value,
    DT_QLTS_TS_SerialNumber: document.getElementById("serialNumber").value,
  };

  // Kiểm tra trùng mã tài sản hoặc serial number
  const response = await fetch(apiURL);
  const assets = await response.json();

  const isDuplicate =
    assets.some(
      (a) =>
        (editingAssetId === null && a.DT_QLTS_TS_MaTaiSan === assetData.DT_QLTS_TS_MaTaiSan) ||
        (a.DT_QLTS_TS_SerialNumber === assetData.DT_QLTS_TS_SerialNumber &&
          a.id !== editingAssetId)
    );

  if (isDuplicate) {
    alert("Mã tài sản hoặc Serial Number đã tồn tại!");
    return;
  };

  if (editingAssetId) {
    await fetch(`${apiURL}/${editingAssetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assetData),
    });
  } else {
    await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assetData),
    });
  }

  loadAssets();
  const modal = bootstrap.Modal.getInstance(document.getElementById("addAssetModal"));
  modal.hide();
}

// Hàm xóa tài sản
async function deleteAsset(assetId) {
  if (confirm("Bạn có chắc chắn muốn xóa tài sản này?")) {
    await fetch(`${apiURL}/${assetId}`, { method: "DELETE" });
    loadAssets();
  }
}

// Gắn sự kiện
document.getElementById("addAssetForm").addEventListener("submit", saveAsset);

// Tải danh sách tài sản khi trang được tải
loadAssets();
