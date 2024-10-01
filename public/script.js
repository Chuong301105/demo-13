document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('header');

 // Hàm lấy màu ngẫu nhiên
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// Xử lý cuộn trang
window.addEventListener('scroll', function () {
    const nav = document.querySelector('header');
    if (window.scrollY > 50) {
        const randomColor = getRandomColor();
        nav.style.backgroundColor = randomColor; // Đổi màu ngẫu nhiên
        nav.classList.add('scrolled'); // Biến thành hình tròn khi cuộn
    } else {
        nav.style.backgroundColor = ''; // Trả về màu mặc định
        nav.classList.remove('scrolled'); // Trả về trạng thái ban đầu
        nav.classList.remove('nav-bar'); // Xóa class nav-bar nếu có khi cuộn lên trên
    }
});
// Xử lý click vào header khi ở trạng thái hình tròn
document.querySelector('header').addEventListener('click', function () {
    const nav = document.querySelector('header');
    if (nav.classList.contains('scrolled')) {
        nav.classList.remove('scrolled'); // Xóa class hình tròn
        nav.classList.add('nav-bar'); // Thêm class nav-bar để biến thành thanh nav
    }
});
    // Hiển thị modal đăng nhập/đăng ký
    const loginButton = document.getElementById('loginButton');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const body = document.querySelector('body');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        authModal.classList.add('active');
        body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal mở
    });

    closeModal.addEventListener('click', function () {
        authModal.classList.remove('active');
        body.style.overflow = 'auto'; // Cho phép cuộn lại
    });

    window.addEventListener('click', function (event) {
        if (event.target === authModal) {
            authModal.classList.remove('active');
            body.style.overflow = 'auto'; // Cho phép cuộn lại
        }
    });

    // Chuyển đổi giữa đăng nhập và đăng ký
    loginTab.addEventListener('click', function () {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    });

    registerTab.addEventListener('click', function () {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    });

    // Đăng nhập sang đăng ký và ngược lại
    document.getElementById('switchToRegister').addEventListener('click', function () {
        registerTab.click();
    });

    document.getElementById('switchToLogin').addEventListener('click', function () {
        loginTab.click();
    });

    // Hiển thị field loại thú cưng khác khi chọn "Khác"
    const petSelect = document.getElementById('pet');
    const otherPetType = document.getElementById('otherPetType');

    petSelect.addEventListener('change', function () {
        if (petSelect.value === 'others') {
            otherPetType.style.display = 'block';
        } else {
            otherPetType.style.display = 'none';
        }
    });

    // Hiển thị trường địa chỉ nếu khách chọn phục vụ tại nhà hoặc đón bé tại nhà
    const homeService = document.getElementById('homeService');
    const pickUpService = document.getElementById('pickUpService');
    const addressField = document.getElementById('addressField');

    function toggleAddressField() {
        if (homeService.value === 'yes' || pickUpService.value === 'yes') {
            addressField.style.display = 'block';
        } else {
            addressField.style.display = 'none';
        }
    }

    homeService.addEventListener('change', toggleAddressField);
    pickUpService.addEventListener('change', toggleAddressField);

    // Xử lý form dịch vụ
    const form = document.getElementById('serviceForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            pet: document.getElementById('pet').value,
            otherType: document.getElementById('otherType').value,
            services: [], // Mảng để lưu các dịch vụ đã chọn
            homeService: document.getElementById('homeService').value === 'yes' ? 'Có' : 'Không', // Thay đổi 'yes' thành 'Có'
            pickUpService: document.getElementById('pickUpService').value === 'yes' ? 'Có' : 'Không', // Thay đổi 'yes' thành 'Có'
            address: document.getElementById('address').value,
            inbox: document.getElementById('inbox').value
        };
    
        // Thu thập các dịch vụ đã chọn từ form
        const selectedServices = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        selectedServices.push(checkbox.value);
        });

        // Gộp các dịch vụ đã chọn thành một chuỗi phân cách bằng dấu phẩy
        formData.services = selectedServices.join(', ');
        console.log('Sending form data:', formData);

        // Gửi dữ liệu tới server
        fetch('/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Kiểm tra xem phản hồi HTTP có thành công hay không
            if (!response.ok) {
                throw new Error('Lỗi mạng');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);

            const responseMessage = document.getElementById('responseMessage');
            if (data.success) {
                responseMessage.textContent = 'Đã gửi thông tin thành công!';
                responseMessage.style.color = 'green';
                responseMessage.style.display = 'block';

                // Reset form sau khi gửi
               /* form.reset();
                addressField.style.display = 'none';
                otherPetType.style.display = 'none';
            } else {
                responseMessage.textContent = `Có lỗi xảy ra: ${data.message}`;
                responseMessage.style.color = 'red';
                responseMessage.style.display = 'block';*/
            }

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);
            const responseMessage = document.getElementById('responseMessage');
            responseMessage.textContent = 'Có lỗi xảy ra khi gửi thông tin! Hãy thử lại.';
            responseMessage.style.color = 'red';
            responseMessage.style.display = 'block';

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                responseMessage.style.display = 'none';
            }, 5000);
        });
    });
// Định nghĩa hàm calculateTotal() bên ngoài, để có thể sử dụng lại ở các hàm khác
function calculateTotal() {
    let total = 0; // Biến tổng ban đầu
    // Lấy tất cả các dịch vụ được chọn từ form
    const services = document.querySelectorAll('input[name="services"]:checked');
    
    // Duyệt qua các dịch vụ đã chọn và cộng giá tương ứng
    services.forEach(service => {
        if (service.value === 'Spa') total += 500000; // Giá dịch vụ Spa
        if (service.value === 'Training') total += 700000; // Giá dịch vụ Huấn luyện
        if (service.value === 'Boarding') total += 800000; // Giá dịch vụ Giữ thú cưng
    });
    
    return total; // Trả về tổng số tiền
}
 // Lắng nghe sự kiện 'submit' của form
document.getElementById('serviceForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn việc submit form

    // Hàm tính tổng chi phí dựa trên dịch vụ đã chọn
    function calculateTotal() {
        let total = 0; // Biến tổng ban đầu
        // Lấy tất cả các dịch vụ được chọn từ form
        const services = document.querySelectorAll('input[name="services"]:checked');
        
        // Duyệt qua các dịch vụ đã chọn và cộng giá tương ứng
        services.forEach(service => {
            if (service.value === 'Spa') total += 500000; // Giá dịch vụ Spa
            if (service.value === 'Training') total += 700000; // Giá dịch vụ Huấn luyện
            if (service.value === 'Boarding') total += 800000; // Giá dịch vụ Giữ thú cưng
        });
        
        return total; // Trả về tổng số tiền
    }

    // Hiển thị thông tin dịch vụ và tổng tiền trong biên lai (modal)
    function displayReceipt() {
        let total = calculateTotal();  // Tính tổng chi phí
        let summary = '';  // Khởi tạo biến summary để lưu thông tin dịch vụ đã chọn
        
        // Lấy tất cả các dịch vụ đã chọn
        const services = document.querySelectorAll('input[name="services"]:checked');
        
        // Duyệt qua các dịch vụ đã chọn và thêm vào chuỗi summary
        services.forEach(service => {
            if (service.value === 'Spa') summary += 'Spa: 500,000 VND<br>';
            if (service.value === 'Training') summary += 'Huấn luyện: 700,000 VND<br>';
            if (service.value === 'Boarding') summary += 'Giữ thú cưng: 800,000 VND<br>';
        });
    
        // Cập nhật thông tin trong modal
        document.getElementById('service-summary').innerHTML = summary;
        document.getElementById('total').textContent = total.toLocaleString() + ' VND';

        // Hiển thị modal với lớp show (sử dụng CSS để điều khiển hiển thị)
        document.getElementById('receipt-modal').classList.add('show');
    }

    // Hiển thị hóa đơn sau khi nhấn submit
    displayReceipt();
});

// Khi nhấn nút "Order"
document.getElementById('order-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định

    // Thu thập dữ liệu từ form
    const paymentMethod = document.getElementById('payment-method').value;

    // Gửi thông tin hóa đơn về SQL
    saveInvoice().then(() => {
        if (paymentMethod === 'online') {
            // Thanh toán online qua PayPal
            calculateAndPay(); // Chuyển hướng đến trang thanh toán PayPal
        } else {
            // Thanh toán tiền mặt
            alert('Đặt hàng thành công với thanh toán tiền mặt.');
        }

        // Ẩn biên lai khi hoàn tất đặt hàng
        document.getElementById('receipt-modal').classList.remove('show');
    }).catch(error => {
        console.error('Lỗi khi lưu hóa đơn:', error);
        alert('Có lỗi xảy ra khi lưu hóa đơn!');
    });
});

// Hàm lưu hóa đơn vào MySQL
function saveInvoice() {
    // Thu thập dữ liệu từ form và biên lai
    const invoiceData = {
        customer_name: document.getElementById('name').value,
        customer_phone: document.getElementById('phone').value,
        customer_email: document.getElementById('email').value,
        pet_type: document.getElementById('pet').value,
        services: getSelectedServices(), // Hàm lấy dịch vụ đã chọn
        total: calculateTotal(), // Tính tổng chi phí
        payment_method: document.getElementById('payment-method').value // Lấy phương thức thanh toán
    };

    // Gửi dữ liệu tới server (API save-invoice)
    return fetch('/save-invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        if (!data.success) {
            throw new Error('Error from server: ' + data.message);
        }
        console.log('Invoice saved successfully:', data);
    });
}

// Hàm lấy các dịch vụ đã chọn
function getSelectedServices() {
    const selectedServices = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });
    return selectedServices.join(', '); // Trả về chuỗi các dịch vụ đã chọn
}

// Hàm thanh toán qua PayPal
function calculateAndPay() {
    let total = calculateTotal(); // Sử dụng hàm calculateTotal() để lấy tổng chi phí

    // Chuyển đổi sang USD, ví dụ tỷ giá là 23,000 VND = 1 USD
    const exchangeRate = 23000;
    const totalInUSD = (total / exchangeRate).toFixed(2);

    // Tạo liên kết PayPal với số tiền đã tính
    const paypalLink = `https://paypal.me/petcare172/${totalInUSD}`;

    // Chuyển hướng đến PayPal để thanh toán
    window.location.href = paypalLink;
}
    // Xử lý form đăng ký tài khoản
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const registerResponseMessage = document.getElementById('registerResponseMessage');

        // Reset màu sắc của thông báo mỗi khi gửi form
        registerResponseMessage.style.color = ''; // Trả về màu mặc định (không đỏ)

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            registerResponseMessage.textContent = 'Mật khẩu và xác nhận mật khẩu không khớp!';
            registerResponseMessage.style.color = 'red'; // Thông báo lỗi
            return;
        }

        // Gửi dữ liệu đăng ký tới server
        const registerData = {
            username: username,
            email: email,
            password: password
        };

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi mạng khi đăng ký');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                registerResponseMessage.textContent = 'Đăng ký thành công!';
                registerResponseMessage.style.color = 'green';
                registerResponseMessage.style.display = 'block';
        
                // Kiểm tra form tồn tại trước khi gọi reset
                const registerFormElement = document.querySelector('#registerForm form');
                console.log(registerFormElement); // Log ra phần tử để kiểm tra
                if (registerFormElement && typeof registerFormElement.reset === 'function') {
                    registerFormElement.reset(); // Reset form sau khi đăng ký thành công
                }
                // Ẩn modal sau khi đăng ký thành công
                setTimeout(() => {
                    authModal.classList.remove('active');
                    body.style.overflow = 'auto'; // Cho phép cuộn lại
                    registerResponseMessage.style.display = 'none'; // Ẩn thông báo sau 5 giây
                }, 1000);
            } else {
                registerResponseMessage.textContent = `Đăng ký thất bại: ${data.message}`;
                registerResponseMessage.style.color = 'red';
                registerResponseMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            registerResponseMessage.textContent = 'Có lỗi xảy ra khi gửi thông tin!';
            registerResponseMessage.style.color = 'red'; // Thông báo lỗi
            registerResponseMessage.style.display = 'block';

            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                registerResponseMessage.style.display = 'none';
            }, 5000);
        });
    });

   // Xử lý form đăng nhập
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn form tự động reload

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const loginData = {
        email: email,
        password: password
    };

    // Gửi yêu cầu đăng nhập đến API
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('username', data.user.username);

            // Chuyển hướng đến trang dashboard.html
            window.location.href = 'dashboard.html';
        } else {
            alert('Đăng nhập thất bại: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Lỗi mạng khi đăng nhập:', error);
    });

    // Gửi dữ liệu tới máy chủ bằng Fetch API
    fetch('/submit-inbox', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // Chuyển đổi formData thành JSON
    })
    .then(response => {
        // Kiểm tra nếu server phản hồi thành công
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Parsed response:', data);
        if (data.success) {
            alert('Dữ liệu đã được gửi thành công!');
        } else {
            alert('Đã xảy ra lỗi khi gửi dữ liệu.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi kết nối tới máy chủ.');
    });

})})
document.addEventListener('DOMContentLoaded', function() {
    const bookButton = document.querySelector('.book-button');  // Nút "Book ngay"
    const serviceForm = document.getElementById('serviceForm');  // Form dịch vụ
    const mainContent = document.getElementById('mainContent'); // Phần nội dung trang
    const navbar = document.querySelector('.navbar'); // Thanh điều hướng (navbar)

    if (bookButton) {
        bookButton.addEventListener('click', function(event) {
            event.preventDefault();
            serviceForm.style.display = 'block';  // Hiển thị form khi nhấn nút "Book ngay"
            mainContent.classList.add('blur-background');  // Làm mờ nội dung trang
            navbar.classList.add('blur-background');  // Làm mờ thanh điều hướng
        });
    }

    // Đóng form và xóa hiệu ứng mờ khi cần
    const closeButton = document.querySelector('.close-form'); // Giả sử có nút đóng form

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            serviceForm.style.display = 'none';  // Ẩn form
            mainContent.classList.remove('blur-background');  // Gỡ lớp mờ khỏi nội dung trang
            navbar.classList.remove('blur-background');  // Gỡ lớp mờ khỏi thanh điều hướng
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const bookButton = document.querySelector('.book-button');  // Nút "Book ngay"
    const serviceForm = document.getElementById('serviceForm');  // Form dịch vụ
    const receiptModal = document.getElementById('receipt-modal');  // Modal receipt
    const mainContent = document.getElementById('mainContent');  // Phần nội dung trang
    const navbar = document.querySelector('.navbar');  // Thanh điều hướng (navbar)
    const orderButton = document.getElementById('order-btn');  // Nút "Order"

    // Hiển thị form và làm mờ nội dung khi nhấn "Book ngay"
    if (bookButton) {
        bookButton.addEventListener('click', function(event) {
            event.preventDefault();
            serviceForm.style.display = 'block';  // Hiển thị form dịch vụ
            mainContent.classList.add('blur-background');  // Làm mờ nội dung trang
            navbar.classList.add('blur-background');  // Làm mờ thanh điều hướng
        });
    }

    // Khi nhấn nút "Order" trong receipt form
    if (orderButton) {
        orderButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Ẩn cả form dịch vụ và receipt form
            serviceForm.style.display = 'none';
            receiptModal.style.display = 'none';

            // Gỡ bỏ hiệu ứng mờ
            mainContent.classList.remove('blur-background');
            navbar.classList.remove('blur-background');
        });
    }

    // Nếu bạn có nút để đóng form và receipt, hãy sử dụng logic tương tự để ẩn form và bỏ lớp mờ
    const closeButton = document.querySelector('.close-form'); // Giả sử có nút đóng form

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            serviceForm.style.display = 'none';  // Ẩn form dịch vụ
            receiptModal.style.display = 'none';  // Ẩn receipt form

            // Gỡ lớp mờ khỏi nội dung trang và navbar
            mainContent.classList.remove('blur-background');
            navbar.classList.remove('blur-background');
        });
    }
});

    
