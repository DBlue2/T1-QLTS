const apiURL = "http://localhost:4000/DSTaiSan";

let editingAssetId = null; // ID của tài sản đang được chỉnh sửa
let currentPage = 1; // Trang hiện tại
let pageSize = 5;
let assets = [];

async function loadAssets() {
  try {
    const storedPageSize = localStorage.getItem("pageSize");
    if (storedPageSize) {
      pageSize = parseInt(storedPageSize, 10);
    }

    const response = await fetch(apiURL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    assets = await response.json();

    const pageSizeInput = document.getElementById("pageSizeInput");
    pageSizeInput.value = pageSize;
    renderTable();
  } catch (error) {
    console.error("Lỗi khi tải danh sách tài sản:", error);
    toastr.error("Không thể tải danh sách tài sản. Vui lòng thử lại!", "Lỗi");
  }
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
        <td>${asset.DT_QLTS_TS_NhapKho_TenNhanSu}</td>
        <td>
          <button class="btn btn-warning btn-sm m-1" onclick="openEditForm('${
            asset.id
          }')">Sửa</button>
          <button class="btn btn-danger btn-sm m-1" onclick="deleteAsset('${
            asset.id
          }')">Xóa</button>
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
  pageSize = parseInt(newSize, 10) || 5;
  currentPage = 1;

  localStorage.setItem("pageSize", pageSize);

  renderTable();
}

// Hàm mở form thêm mới tài sản
function openAddForm() {
  editingAssetId = null;
  resetForm();
  document.getElementById("addAssetModalLabel").textContent =
    "Thêm mới tài sản";
}

// Hàm mở form chỉnh sửa tài sản
async function openEditForm(assetId) {
  try {
    editingAssetId = assetId;
    const response = await fetch(`${apiURL}/${assetId}`);
    const asset = await response.json();

    document.getElementById("assetCode").value = asset.DT_QLTS_TS_MaTaiSan;
    document.getElementById("assetName").value = asset.DT_QLTS_TS_TenTaiSan;
    document.getElementById("unit").value = asset.DT_QLTS_TS_NhapKho_DonViTinh;
    document.getElementById("assetGroup").value = asset.DT_QLTS_TS_NhomTaiSan;
    document.getElementById("assetType").value = asset.DT_QLTS_TS_LoaiTaiSan;
    document.getElementById("brand").value = asset.DT_QLTS_TS_ThuongHieu;
    document.getElementById("useDate").value =
      asset.DT_QLTS_TS_NgayDuaVaoSuDung.split("T")[0];
    document.getElementById("importCode").value =
      asset.DT_QLTS_TS_NhapKho_MaNhanSu;
    document.getElementById("importName").value =
      asset.DT_QLTS_TS_NhapKho_TenNhanSu;
    document.getElementById("serialNumber").value =
      asset.DT_QLTS_TS_SerialNumber;
    document.getElementById("assetPBQL").value = asset.DT_QLTS_TS_PBQL;
    document.getElementById("currentRoom").value =
      asset.DT_QLTS_TS_PhongHienTai;
    document.getElementById("assetRoom").value =
      asset.DT_QLTS_TS_TenPhongHienTai;
    document.getElementById("assetCodeGroup").value =
      asset.DT_QLTS_TS_MaNhomThietBiDiKem;
    document.getElementById("assetOrigin").value = asset.DT_QLTS_TS_NguonGoc;
    document.getElementById("assetStatus").value = asset.DT_QLTS_TS_TinhTrang;
    document.getElementById("assetDescription").value = asset.DT_QLTS_TS_MoTa;
    document.getElementById("assetModel").value = asset.DT_QLTS_TS_Model;
    document.getElementById("manufactureYear").value =
      asset.DT_QLTS_TS_NamSanXuat;
    document.getElementById("assetFrom").value = asset.DT_QLTS_TS_XuatXu;
    document.getElementById("assetLength").value =
      asset.DT_QLTS_TS_KichThuoc_Dai;
    document.getElementById("assetWidth").value =
      asset.DT_QLTS_TS_KichThuoc_Rong;
    document.getElementById("assetHeight").value =
      asset.DT_QLTS_TS_KichThuoc_Cao;
    document.getElementById("fileAttachment").value =
      asset.DT_QLTS_TS_GiayToKemTheo_TenFile;
    document.getElementById("assetNote").value = asset.DT_QLTS_TS_TS_GhiChu;
    document.getElementById("storageCode").value =
      asset.DT_QLTS_TS_NhapKho_TenKho;
    document.getElementById("storageName").value =
      asset.DT_QLTS_TS_NhapKho_TenKho_Ten;

    document.getElementById("addAssetModalLabel").textContent =
      "Chỉnh sửa tài sản";
    const modal = new bootstrap.Modal(document.getElementById("addAssetModal"));
    modal.show();
  } catch (error) {
    console.error("Lỗi khi mở form chỉnh sửa tài sản:", error);
    toastr.error("Không thể mở thông tin tài sản. Vui lòng thử lại!", "Lỗi!");
  }
}

// Hàm reset form
function resetForm() {
  document.getElementById("addAssetForm").reset();
}

// Hàm lưu tài sản
async function saveAsset(event) {
  event.preventDefault();

  try {
    const assetData = {
      DT_QLTS_TS_Chon: false,
      DT_QLTS_TS_MaTaiSan: parseInt(document.getElementById("assetCode").value),
      DT_QLTS_TS_TenTaiSan: document.getElementById("assetName").value,
      DT_QLTS_TS_NhapKho_DonViTinh: document.getElementById("unit").value,
      DT_QLTS_TS_NhomTaiSan: parseInt(
        document.getElementById("assetGroup").value
      ),
      DT_QLTS_TS_LoaiTaiSan: document.getElementById("assetType").value,
      DT_QLTS_TS_ThuongHieu: document.getElementById("brand").value,
      DT_QLTS_TS_NgayDuaVaoSuDung: document.getElementById("useDate").value,
      DT_QLTS_TS_NhapKho_MaNhanSu: document.getElementById("importCode").value,
      DT_QLTS_TS_NhapKho_TenNhanSu: document.getElementById("importName").value,
      DT_QLTS_TS_SerialNumber: document.getElementById("serialNumber").value,
      DT_QLTS_TS_PBQL: document.getElementById("assetPBQL").value,

      DT_QLTS_TS_PhongHienTai: document.getElementById("currentRoom").value,
      DT_QLTS_TS_TenPhongHienTai: document.getElementById("assetRoom").value,
      DT_QLTS_TS_MaNhomThietBiDiKem:
        document.getElementById("assetCodeGroup").value,
      DT_QLTS_TS_NguonGoc: document.getElementById("assetOrigin").value,
      DT_QLTS_TS_TinhTrang: document.getElementById("assetStatus").value,
      DT_QLTS_TS_MoTa: document.getElementById("assetDescription").value,
      DT_QLTS_TS_Model: document.getElementById("assetModel").value,
      DT_QLTS_TS_NamSanXuat: document.getElementById("manufactureYear").value,
      DT_QLTS_TS_XuatXu: document.getElementById("assetFrom").value,
      DT_QLTS_TS_KichThuoc_Dai: document.getElementById("assetLength").value,
      DT_QLTS_TS_KichThuoc_Rong: document.getElementById("assetWidth").value,
      DT_QLTS_TS_KichThuoc_Cao: document.getElementById("assetHeight").value,
      DT_QLTS_TS_GiayToKemTheo_TenFile:
        document.getElementById("fileAttachment").value,
      DT_QLTS_TS_TS_GhiChu: document.getElementById("assetNote").value,
      DT_QLTS_TS_NhapKho_TenKho: document.getElementById("storageCode").value,
      DT_QLTS_TS_NhapKho_TenKho_Ten:
        document.getElementById("storageName").value,
    };

    const response = await fetch(apiURL);
    const assets = await response.json();

    // Kiểm tra trùng mã tài sản
    const isDuplicateAssetCode = assets.some(
      (a) =>
        a.id !== editingAssetId &&
        a.DT_QLTS_TS_MaTaiSan === assetData.DT_QLTS_TS_MaTaiSan
    );

    // Kiểm tra trùng serial number
    const isDuplicateSerialNumber = assets.some(
      (a) =>
        a.id !== editingAssetId &&
        a.DT_QLTS_TS_SerialNumber === assetData.DT_QLTS_TS_SerialNumber
    );

    if (isDuplicateAssetCode) {
      toastr.error("Mã tài sản đã tồn tại!", "Cảnh báo!");
      return;
    }

    if (isDuplicateSerialNumber) {
      toastr.error("Serial Number đã tồn tại!", "Cảnh báo!");
      return;
    }

    if (editingAssetId) {
      await fetch(`${apiURL}/${editingAssetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });
      toastr.success("Cập nhật tài sản thành công!", "Success!");
    } else {
      // const response = await fetch(apiURL);
      // assetList = await response.json();

      const lastAsset = assets[assets.length - 1];
      const newID = parseInt(lastAsset.id) + 1;
      assetData.id = newID.toString();
      await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });
      toastr.success("Thêm mới tài sản thành công!", "Success!");
    }

    await loadAssets();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addAssetModal")
    );
    modal.hide();
  } catch (error) {
    console.error("Lỗi khi lưu tài sản:", error);
    toastr.error("Không thể lưu tài sản. Vui lòng thử lại!", "Lỗi!");
  }
}

async function deleteAsset(assetId) {
  if (confirm("Bạn có chắc chắn muốn xóa tài sản này?")) {
    await fetch(`${apiURL}/${assetId}`, { method: "DELETE" });
    toastr.success("Xóa tài sản thành công!", "Success!");
    loadAssets();
  } else {
    toastr.error("Xóa tài sản thất bại!", "Failed!");
  }
}

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

document.getElementById("addAssetForm").addEventListener("submit", saveAsset);

loadAssets();
