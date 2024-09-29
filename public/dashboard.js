document.addEventListener('DOMContentLoaded', function () {
    // Các phần tử DOM
    const profileSection = document.getElementById('profileSection');
    const notificationsSection = document.getElementById('notificationsSection');
    const ordersSection = document.getElementById('ordersSection');
    const voucherSection = document.getElementById('voucherSection');
    const servicesSection = document.getElementById('servicesSection');
    const petHotelSection = document.getElementById('petHotelSection');
    const profileForm = document.getElementById('profileForm');
    const userButton = document.getElementById('userButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    // Kiểm tra xem userId có tồn tại trong localStorage không
    if (!userId) {
        window.location.href = 'index.html';  // Điều hướng về trang đăng nhập nếu không có userId
    }

    // Hàm ẩn tất cả các phần
    function hideAllSections() {
        profileSection.style.display = 'none';
        notificationsSection.style.display = 'none';
        ordersSection.style.display = 'none';
        voucherSection.style.display = 'none';
        servicesSection.style.display = 'none';
        petHotelSection.style.display = 'none';
    }

    // Hàm lấy thông tin người dùng từ API và điền vào form
    function loadUserData() {
        if (!userId) {
            console.error('Không tìm thấy userId trong localStorage');
            return;
        }

        fetch(`/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Lỗi mạng khi gọi API: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    const { username, name, address, phone, gender } = data.data;
                    document.getElementById('username').value = username || '';
                    document.getElementById('name').value = name || '';
                    document.getElementById('address').value = address || '';
                    document.getElementById('phone').value = phone || '';

                    // Chọn đúng giới tính nếu tồn tại
                    if (gender) {
                        const genderInput = document.querySelector(`input[name="gender"][value="${gender}"]`);
                        if (genderInput) {
                            genderInput.checked = true;
                        }
                    }
                } else {
                    console.error('Không thể tải thông tin người dùng: ', data.message || 'Lỗi không xác định');
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            });
    }

    // Xử lý cập nhật thông tin người dùng
    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const profileData = {
            user_id: userId,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            address: document.getElementById('address').value
        };

        fetch('/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thông tin đã được cập nhật thành công!');
                } else {
                    alert('Có lỗi xảy ra khi cập nhật thông tin!');
                }
            })
            .catch(error => console.error('Error updating profile:', error));
    });

    // Điều hướng trong dashboard
    document.getElementById('accountInfoLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        profileSection.style.display = 'block';
    });

    document.getElementById('notificationsLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        notificationsSection.style.display = 'block';
    });

    document.getElementById('ordersLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        ordersSection.style.display = 'block';
    });

    document.getElementById('voucherLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        voucherSection.style.display = 'block';
    });

    document.getElementById('servicesLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        servicesSection.style.display = 'block';
    });

    document.getElementById('currentServicesLink').addEventListener('click', function (event) {
        event.preventDefault();
        hideAllSections();
        petHotelSection.style.display = 'block';
    });

    // Đăng xuất người dùng
    document.getElementById('logoutLink').addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = '/'; // Chuyển hướng về trang chủ
    });

    // Hiển thị dropdown menu khi nhấn vào userButton
    userButton.addEventListener('click', function () {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Tải thông tin người dùng khi trang được load
    loadUserData();

    // Cập nhật tên người dùng trong dashboard
    if (username) {
        userButton.textContent = username; // Hiển thị tên người dùng
    } else {
        console.error('Không tìm thấy username trong localStorage');
    }

    // Sự kiện khi nhấn vào các mục sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Lấy username từ localStorage (hoặc từ API nếu có)
    const username = localStorage.getItem('username');

    // Nếu username tồn tại, gán vào input
    if (username) {
        document.getElementById('username').value = username;
    } else {
        console.error('Không tìm thấy username trong localStorage');
    }
})