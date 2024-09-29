const express = require('express');
const fs = require('fs').promises; // Sử dụng fs.promises để làm việc với async/await
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import thư viện UUID để tạo ID duy nhất cho mỗi khách hàng
const bcrypt = require('bcrypt'); // Import bcrypt để mã hóa mật khẩu
const mysql = require('mysql2');
// Tạo kết nối đến cơ sở dữ liệu MySQL bằng biến môi trường
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',   // Thay bằng host của bạn
    user: process.env.DB_USER || 'root',        // Thay bằng username của bạn
    password: process.env.DB_PASS || 'Nhcdz123#',    // Thay bằng password của bạn
    database: process.env.DB_NAME || 'petcare_db',// Thay bằng tên cơ sở dữ liệu của bạn
    port: 3306 // hoặc port khác nếu bạn dùng port đặc biệt
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

// Tạo ứng dụng Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Xử lý JSON cho các yêu cầu API
app.use(bodyParser.urlencoded({ extended: true })); // Xử lý dữ liệu từ form HTML

// Serve static files (cho phép truy cập vào file HTML, CSS, JS và hình ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// Hàm khởi tạo file nếu chưa tồn tại
const initializeFiles = async () => {
    const userFilePath = 'users.json';
    const customerFilePath = 'customers.json';

    try {
        await fs.access(userFilePath); // Kiểm tra xem file có tồn tại không
    } catch {
        await fs.writeFile(userFilePath, '[]'); // Nếu không tồn tại, tạo file trống
        console.log('Created users.json file');
    }

    try {
        await fs.access(customerFilePath);
    } catch {
        await fs.writeFile(customerFilePath, '[]');
        console.log('Created customers.json file');
    }
};

initializeFiles(); // Gọi hàm khởi tạo file khi server bắt đầu

// Route GET để phục vụ file index.html khi truy cập /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API để xử lý đăng ký người dùng
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo câu lệnh SQL để lưu người dùng
        const query = `INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`;
        
        // Thực hiện truy vấn MySQL
        db.query(query, [uuidv4(), username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting user data:', err);
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lưu dữ liệu người dùng!' });
            }
            res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xử lý đăng ký!' });
    }
});


// API để xử lý đăng nhập người dùng
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng trong MySQL
        const query = `SELECT * FROM users WHERE email = ?`;

        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng nhập!' });
            }

            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'Email không tồn tại!' });
            }

            const user = results[0];

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Mật khẩu không đúng!' });
            }

            // Đăng nhập thành công, trả về thông tin người dùng
            res.json({ success: true, message: 'Đăng nhập thành công!', user: { id: user.id, username: user.username, email: user.email } });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng nhập!' });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng theo email
        const query = `SELECT * FROM users WHERE email = ?`;

        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng nhập!' });
            }

            // Nếu không tìm thấy người dùng với email đã cung cấp
            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'Email không tồn tại!' });
            }

            const user = results[0];

            // So sánh mật khẩu đã nhập với mật khẩu được mã hóa trong cơ sở dữ liệu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Mật khẩu không đúng!' });
            }

            // Nếu mật khẩu hợp lệ, trả về thông tin người dùng
            res.json({
                success: true,
                user: {
                    id: user.id,            // Trả về user ID
                    username: user.username  // Trả về username
                }
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đăng nhập!' });
    }
});

app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM user_profiles WHERE user_id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng!' });
        }
        res.json({ success: true, data: result[0] });
    });
});

// Yêu cầu file db.js để sử dụng kết nối database petcare_db
app.get('/user-profile', (req, res) => {
    const userId = req.query.user_id;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'user_id không được cung cấp' });
    }

    const query = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(`Error fetching user profile for userId: ${userId}`, err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng!' });
        }
        res.json({ success: true, data: result[0] });
    });
});

// API để cập nhật thông tin cá nhân của người dùng
app.post('/update-profile', (req, res) => {
    const { user_id, name, phone, address, gender } = req.body;

    // Kiểm tra nếu profile của người dùng đã tồn tại
    const checkQuery = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(checkQuery, [user_id], (err, result) => {
        if (err) {
            console.error('Error checking profile:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi kiểm tra profile!' });
        }

        // Nếu không có profile, tạo mới
        if (result.length === 0) {
            const insertQuery = `INSERT INTO user_profiles (user_id, name, phone, gender, address) 
                                 VALUES (?, ?, ?, ?, ?)`;
            db.query(insertQuery, [user_id, name, phone, gender, address], (err, result) => {
                if (err) {
                    console.error('Error inserting profile:', err);
                    return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tạo profile!' });
                }
                res.json({ success: true, message: 'Profile đã được tạo thành công!' });
            });
        } else {
            app.post('/update-profile', (req, res) => {
                // Lấy dữ liệu từ body của request
                const { user_id, name, address, phone, gender } = req.body;
                
                // Thực hiện cập nhật thông tin vào database
                const updateQuery = 'UPDATE user_profiles SET name = ?, address = ?, phone = ?, gender = ? WHERE user_id = ?';
                db.query(updateQuery, [name, address, phone, gender, user_id], (err, result) => {
                    if (err) {
                        console.error('Error updating profile:', err);
                        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật profile!' });
                    }
                    res.json({ success: true, message: 'Thông tin đã được cập nhật thành công!' });
                });            
            });
        }
    });
});

app.post('/submit-form', (req, res) => {
    console.log(req.body); // In ra toàn bộ dữ liệu từ form để kiểm tra
    const { name, phone, email, pet, otherType, services, homeService, pickUpService, address } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !phone || !email || !pet) {
        return res.status(400).json({ success: false, message: "Tên, Số điện thoại, Email và Loại thú cưng là bắt buộc!" });
    }

    // Tạo ID cho khách hàng
    const customerId = uuidv4();

    // Kiểm tra nếu `services` là mảng, nếu không thì xử lý phù hợp
    let selectedServices = '';
    if (Array.isArray(services)) {
        selectedServices = services.join(', '); // Nếu là mảng, gộp các dịch vụ thành chuỗi
    } else if (typeof services === 'string') {
        selectedServices = services; // Nếu là chuỗi, sử dụng trực tiếp
    } else {
        selectedServices = ''; // Nếu không có giá trị, để trống
    }

    // Dữ liệu khách hàng sẽ được lưu vào cơ sở dữ liệu MySQL (bỏ cột created_at)
    const query = `INSERT INTO customers (id, name, phone, email, pet, otherType, services, homeService, pickUpService, address) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Đã bỏ cột 'message'
    // Thực hiện câu lệnh SQL
    db.query(query, [customerId, name, phone, email, pet, otherType, selectedServices, homeService, pickUpService, address], (err, result) => {
        if (err) {
            console.error('Error inserting customer data:', err);
            return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi ghi dữ liệu!" });
        }
        res.json({ success: true, message: "Dữ liệu đã được gửi và lưu thành công!" });
    });
});
// === API mới để lưu hóa đơn vào bảng invoices ===
// API để xử lý lưu dữ liệu vào bảng invoices
app.post('/save-invoice', (req, res) => {
    const { customer_name, customer_phone, customer_email, pet_type, services, total, payment_method } = req.body;

    // Tạo câu lệnh SQL để chèn dữ liệu vào bảng invoices
    const query = `
        INSERT INTO invoices (customer_name, customer_phone, customer_email, pet_type, services, total, payment_method)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Thực hiện truy vấn để lưu thông tin hóa đơn
    db.query(query, [customer_name, customer_phone, customer_email, pet_type, services, total, payment_method], (err, result) => {
        if (err) {
            console.error('Error inserting invoice data:', err);
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lưu hóa đơn!' });
        }
        console.log('Hóa đơn đã được lưu thành công vào MySQL');
        res.status(200).json({ success: true, message: 'Hóa đơn đã được lưu thành công!' });
    });
});


// Khởi động server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

