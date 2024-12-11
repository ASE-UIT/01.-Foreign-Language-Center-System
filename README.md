# 01.-Foreign-Language-Center-System

## 👥 **CÁC ROLE TRONG HỆ THỐNG**

| **ROLE**               | **Flag (khi tạo user)** |
| ---------------------- | ----------------------- |
| **HocVien**            | 2                       |
| **PhuHuynh**           | 1                       |
| **GiaoVien**           | 3                       |
| **KeToan**             | 4                       |
| **NhanVienTuyenSinh**  | 5                       |
| **NhanVienHoTroHocVu** | 6                       |
| **BanLanhDao**         | 7                       |
| **BanDieuHanh**        | 8                       |
| **BanDieuHanhHeThong** | 9                       |
| **ChuCongTy**          | 10                      |

## 🚀 **Run the Project**

1. **Open Terminal**  
   Launch the terminal or command prompt.

2. **Navigate to the Desired Directory**  
    Move to the directory where you want to clone the project:

   ```bash
    cd <your-desired-directory>

   ```

3. **Clone the Project**
   Clone the project from GitHub:

   ```bash
    git clone https://github.com/ASE-UIT/01.-Foreign-Language-Center-System.git

   ```

4. **Move to the Project Directory**
   Change to the project directory:

   ```bash
    cd .\webprj\

   ```

5. **Run Docker Compose**
   Build and start the Docker containers using Docker Compose:
   ```bash
    docker-compose up --build
   ```

## 🚀 **LƯU Ý**

### 1. **Khi chạy lần đầu tiên**

Sử dụng tài khoản mặc định (được tạo với role là ChuCongTy) để đăng nhập
<br> Email: `admin@gmail.com` <br> Password: `admin`

### 2. **Token sau khi đăng nhập thành công**

Sau khi đăng nhập thành công, bạn sẽ nhận được một **Bearer Token**. Token này cần được sử dụng để xác thực khi gọi các API yêu cầu quyền truy cập.

#### 🔓 **Danh sách các endpoint KHÔNG yêu cầu quyền truy cập:**

```bash
/api/users
/auth/login
/auth/introspect
/auth/logout
/auth/refresh
/api/users/changePass
```

### 3. **Cần phải tạo 1 trung tâm (chi nhánh) trước**

#### **HTTP Method**:

`POST`

#### **Endpoint**:

`/center`

---

#### **Example Request**:

```json
{
  "userId": 1,
  "name": "Trung Tâm Ngoại Ngữ VSTO",
  "address": "100 Nguyễn Huệ",
  "ward": "Phường 6",
  "district": "Quận 1",
  "city": "TP HCM",
  "email": "contactVSTO@abctraining.com"
}
```

#### **Response nếu thành công**:

```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "name": "Trung Tâm Ngoại Ngữ VSTO",
    "address": "100 Nguyễn Huệ",
    "ward": "Phường 6",
    "district": "Quận 1",
    "city": "TP HCM",
    "email": "contactVSTO@abctraining.com"
  }
}
```

## 🚀 **APIs**

- Một vài API cơ bản:

| **HTTP Method** | **Endpoint**               | **Description**                                                                                                                                               |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST            | `/auth/login`              | API đăng nhập gồm email, password. Khi đăng nhập thành công sẽ trả về token và role. Nếu là phụ huynh thì sẽ thêm danh sách child (mỗi child gồm id và name). |
| POST            | `/auth/logout`             | API đăng xuất gồm 1 token.                                                                                                                                    |
| POST            | `/timeslot/addList`        | API thêm list các giờ học của trung tâm. Cần được thêm trước khi thêm khóa học.                                                                               |
| POST            | `/api/room/addList`        | API thêm danh sách phòng gồm roomName và centerId                                                                                                             |
| POST            | `/api/courses/add`         | Thêm 1 khóa học vào trung tâm (chi nhánh nào đó).                                                                                                             |
| POST            | `/api/users`               | Tạo 1 tài khoản user, sử dụng flag để đặt role cho user.                                                                                                      |
| GET             | `/api/users/my-info`       | Lấy info của người đang login thông qua token                                                                                                                 |
| PUT             | `/api/users/changePass`    | Đổi mật khẩu: gồm email, oldPass, newPass, reNewPass                                                                                                          |
| PUT             | `/api/users/schedule/{id}` | Lấy lịch học trong tuần hiện tại của hocvien qua id user                                                                                                      |
| POST            | `/api/registrations`       | Đăng ký khóa học gồm studentId, parentId và courseId                                                                                                          |
| POST            | `/center`                  | Thêm trung tâm                                                                                                                                                |
| GET             | `/center/{id}`             | Lấy info của trung tâm theo id                                                                                                                                |
| GET             | `/center-statistic/{id}`   | Lấy thống kê của trung tâm theo id                                                                                                                            |
| POST            | `/api/chatcenter/send`     | Gửi tin nhắn giữa học viên/ phụ huynh với trung tâm                                                                                                           |
| GET             | `/api/chatcenter/messages` | Lấy toàn bộ tin nhắn giữa học viên/ phụ huynh tới trung tâm qua id user                                                                                       |
| POST            | `/api/chat/messages`       | Gửi tin nhắn vào bảng chat của khóa học                                                                                                                       |
| GET             | `/api/chat/courses/{courseId}/messages`  | Lấy toàn bộ tin nhắn trong khóa học qua course id                                                                                               |
