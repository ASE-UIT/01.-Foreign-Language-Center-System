const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const router = express.Router()

dotenv.config() // Load các biến môi trường từ file .env

const app = express()
const PORT = process.env.PORT || 5000

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err))

// Định nghĩa schema cho CourseInfo
const courseInfoSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }, // ID khóa học, tham chiếu tới model Course
  enrollDate: {
    type: String,
    required: true,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  paycheckIMG: {
    type: String,
    required: false,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/ // Đảm bảo URL hợp lệ
  }
})

// Định nghĩa schema cho Student
const studentSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    required: true,
    unique: true
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin'],
    required: true
  },
  mongoID: {
    type: String,
    required: true,
    unique: true
  },
  courses: [courseInfoSchema] // Danh sách các khóa học mà học sinh đã tham gia
})

// Định nghĩa schema cho Teacher
const teacherSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    required: true,
    unique: true
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin'],
    required: true
  },
  mongoID: {
    type: String,
    required: true,
    unique: true
  },
  courses: [
    {
      type: [String],
      required: true
    }
  ], // Danh sách các id khóa học giảng dạy
  monthlySalary: {
    type: Number,
    required: true,
    min: 0
  },
  courseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  paycheckList: [
    {
      type: [String],
      required: true
    }
  ] // Danh sách các bill nhận lương
})

// Định nghĩa schema cho Class
const classSchema = new mongoose.Schema({
  classID: {
    type: String,
    required: true,
    unique: true
  }, // ID của lớp học
  type: {
    type: String,
    enum: ['repeat', 'oneTime'],
    required: true
  }, // Loại lớp học: lặp lại hay một lần
  schedule: {
    type: [String],
    required: true
  }, // Lịch học của lớp học
  name: {
    type: String,
    required: true
  }, // Tên buổi học
  description: {
    type: [[String]],
    required: true
  }, // Thông tin mô tả về buổi học
  teachers: {
    type: [[String]],
    required: true
  }, // Các giảng viên dạy lớp học này
  lessonList: {
    type: [String],
    required: true
  }, // Danh sách bài học trong lớp học
  progress: {
    type: Number,
    required: true,
    min: 1
  }, // Buổi học hiện tại là buổi thứ mấy
  documents: {
    type: [String],
    required: true,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Link tài liệu lớp học (phải là URL)
  isActive: {
    type: Boolean,
    required: true
  }, // Lớp học còn hoạt động hay không
  meeting: {
    type: String,
    required: true,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Đường dẫn vào meeting của lớp học
  coverIMG: {
    type: String,
    required: true,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Đường dẫn hình ảnh của lớp học
  startDate: {
    type: String,
    required: true,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  }, // Ngày bắt đầu lớp học
  endDate: {
    type: String,
    required: true,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  } // Ngày kết thúc lớp học
})

// Định nghĩa schema cho Course
const courseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  classes: [classSchema], // Danh sách lớp học trong khóa học (mảng ObjectId tham chiếu đến Class)
  teachers: [
    {
      type: [String],
      required: true
    }
  ], // Danh sách tên các giáo viên giảng dạy khóa học
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  totalVote: {
    type: Number,
    required: true,
    min: 0
  },
  target: {
    type: [String],
    required: true
  },
  sumary: {
    type: [String],
    required: true
  },
  studentList: {
    type: [String],
    required: true,
    unique: true
  }, // Danh sách các học sinh tham gia khóa học (lưu = id)
  studentLimit: {
    type: Number,
    required: true,
    min: 1
  },
  appliedNumber: {
    type: Number,
    required: true,
    min: 0
  },
  coverIMG: {
    type: String,
    required: true,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  },
  startDate: {
    type: String,
    required: true,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  },
  endDate: {
    type: String,
    required: true,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  }
})

// Định nghĩa schema cho Salary
const salarySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['teacher', 'accountant', 'manager', 'admin'],
    required: true
  },
  receiverID: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  }
})

// Định nghĩa schema cho Accountant
const accountantSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    required: true,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin'],
    required: true
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    required: true,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    required: true,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String],
    required: true // Danh sách các bill chuyển khoản
  }
})

// Định nghĩa schema cho Manager
const managerSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    required: true,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin'],
    required: true
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    required: true,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    required: true,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String],
    required: true // Danh sách các bill chuyển khoản
  }
})

// Định nghĩa schema cho Admin
const adminSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    required: true,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin'],
    required: true
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    required: true,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    required: true,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String],
    required: true // Danh sách các bill chuyển khoản
  }
})

// Tạo model từ schema
const Student = mongoose.model('Student', studentSchema)
const CourseInfo = mongoose.model('CourseInfo', courseInfoSchema)
const Teacher = mongoose.model('Teacher', teacherSchema)
const Course = mongoose.model('Course', courseSchema)
const Class = mongoose.model('Class', classSchema)

const Salary = mongoose.model('Salary', salarySchema)
const Accountant = mongoose.model('Accountant', accountantSchema)
const Manager = mongoose.model('Manager', managerSchema)
const Admin = mongoose.model('Admin', adminSchema)

// Middleware
app.use(cors()) // Enable CORS
app.use(express.json()) // Enable JSON body parsing

// Sử dụng router
app.use('/api', router)

// Các route API
app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB API!')
})

// Lắng nghe server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// API để tạo sinh viên mới
router.post('/students', async (req, res) => {
  try {
    const { clerkUserID, userRole, mongoID, courses } = req.body

    // Kiểm tra xem dữ liệu đầu vào có hợp lệ không
    if (!clerkUserID || !userRole || !mongoID || !courses) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newStudent = new Student({ clerkUserID, userRole, mongoID, courses })
    await newStudent.save()
    res.status(201).json(newStudent) // Trả về thông tin sinh viên mới tạo
  } catch (err) {
    console.error(err) // In chi tiết lỗi ra console
    res
      .status(400)
      .json({ error: 'Error creating student', message: err.message }) // Trả về lỗi chi tiết
  }
})

// API để lấy danh sách sinh viên
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find()
    res.status(200).json(students)
  } catch (err) {
    res.status(500).json({ error: 'Error fetching students' })
  }
})

// API để tạo khóa học mới
router.post('/courseinfo', async (req, res) => {
  try {
    const { courseID, enrollDate, isPaid, paycheckIMG } = req.body

    // Kiểm tra nếu thông tin khóa học đã có trong MongoDB (hoặc có thể kiểm tra thêm)
    const newCourseInfo = new CourseInfo({
      courseID,
      enrollDate,
      isPaid,
      paycheckIMG
    })

    await newCourseInfo.save() // Lưu dữ liệu vào MongoDB
    res.status(201).json(newCourseInfo) // Trả về khóa học mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating course info', message: err.message })
  }
})

// API để lấy danh sách tất cả khóa học
router.get('/courseinfo', async (req, res) => {
  try {
    const courses = await CourseInfo.find() // Lấy tất cả dữ liệu từ collection CourseInfo
    res.status(200).json(courses) // Trả về danh sách khóa học
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching course info', message: err.message })
  }
})

// API để lấy thông tin một khóa học theo `courseID`
router.get('/courseinfo/:id', async (req, res) => {
  try {
    const course = await CourseInfo.findById(req.params.id) // Tìm khóa học theo ID
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.status(200).json(course) // Trả về khóa học tìm được
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching course info', message: err.message })
  }
})

// API để cập nhật thông tin khóa học
router.put('/courseinfo/:id', async (req, res) => {
  try {
    const updatedCourse = await CourseInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Trả về đối tượng mới đã cập nhật
    )

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.status(200).json(updatedCourse) // Trả về khóa học đã cập nhật
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error updating course info', message: err.message })
  }
})

// API để xóa khóa học
router.delete('/courseinfo/:id', async (req, res) => {
  try {
    const deletedCourse = await CourseInfo.findByIdAndDelete(req.params.id) // Xóa khóa học theo ID
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.status(200).json({ message: 'Course deleted successfully' }) // Trả về thông báo xóa thành công
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error deleting course info', message: err.message })
  }
})

// API để tạo Teacher mới
router.post('/teachers', async (req, res) => {
  try {
    const {
      clerkUserID,
      userRole,
      mongoID,
      courses,
      monthlySalary,
      courseSalary,
      paycheckList
    } = req.body
    const newTeacher = new Teacher({
      clerkUserID,
      userRole,
      mongoID,
      courses,
      monthlySalary,
      courseSalary,
      paycheckList
    })
    await newTeacher.save()
    res.status(201).json(newTeacher) // Trả về teacher mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating teacher', message: err.message })
  }
})

// API để lấy tất cả Teacher
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.status(200).json(teachers) // Trả về danh sách teachers
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching teachers', message: err.message })
  }
})

// API để tạo Class mới
router.post('/classes', async (req, res) => {
  try {
    const {
      classID,
      type,
      schedule,
      name,
      description,
      teachers,
      lessonList,
      progress,
      documents,
      isActive,
      meeting,
      coverIMG,
      startDate,
      endDate
    } = req.body
    const newClass = new Class({
      classID,
      type,
      schedule,
      name,
      description,
      teachers,
      lessonList,
      progress,
      documents,
      isActive,
      meeting,
      coverIMG,
      startDate,
      endDate
    })
    await newClass.save()
    res.status(201).json(newClass) // Trả về class mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating class', message: err.message })
  }
})

// API để lấy tất cả Class
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.find()
    res.status(200).json(classes) // Trả về danh sách classes
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching classes', message: err.message })
  }
})

// API để tạo Course mới
router.post('/courses', async (req, res) => {
  try {
    const {
      courseID,
      name,
      description,
      classes,
      teachers,
      price,
      compareAtPrice,
      rating,
      totalVote,
      target,
      sumary,
      studentList,
      studentLimit,
      appliedNumber,
      coverIMG,
      startDate,
      endDate
    } = req.body
    const newCourse = new Course({
      courseID,
      name,
      description,
      classes,
      teachers,
      price,
      compareAtPrice,
      rating,
      totalVote,
      target,
      sumary,
      studentList,
      studentLimit,
      appliedNumber,
      coverIMG,
      startDate,
      endDate
    })
    await newCourse.save()
    res.status(201).json(newCourse) // Trả về course mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating course', message: err.message })
  }
})

// API để lấy tất cả Course
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
    res.status(200).json(courses) // Trả về danh sách courses
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching courses', message: err.message })
  }
})

// API để tạo Salary mới
router.post('/salaries', async (req, res) => {
  try {
    const { id, description, type, receiverID, value } = req.body
    const newSalary = new Salary({ id, description, type, receiverID, value })
    await newSalary.save()
    res.status(201).json(newSalary) // Trả về salary mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating salary', message: err.message })
  }
})

// API để lấy tất cả Salary
router.get('/salaries', async (req, res) => {
  try {
    const salaries = await Salary.find()
    res.status(200).json(salaries) // Trả về danh sách salaries
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching salaries', message: err.message })
  }
})

// API để tạo Accountant mới
router.post('/accountants', async (req, res) => {
  try {
    const { clerkUserID, role, mongoID, monthlySalary, paycheckList } = req.body
    const newAccountant = new Accountant({
      clerkUserID,
      role,
      mongoID,
      monthlySalary,
      paycheckList
    })
    await newAccountant.save()
    res.status(201).json(newAccountant) // Trả về accountant mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating accountant', message: err.message })
  }
})

// API để lấy tất cả Accountant
router.get('/accountants', async (req, res) => {
  try {
    const accountants = await Accountant.find()
    res.status(200).json(accountants) // Trả về danh sách accountants
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching accountants', message: err.message })
  }
})

// API để tạo Manager mới
router.post('/managers', async (req, res) => {
  try {
    const { clerkUserID, role, mongoID, monthlySalary, paycheckList } = req.body
    const newManager = new Manager({
      clerkUserID,
      role,
      mongoID,
      monthlySalary,
      paycheckList
    })
    await newManager.save()
    res.status(201).json(newManager) // Trả về manager mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating manager', message: err.message })
  }
})

// API để lấy tất cả Manager
router.get('/managers', async (req, res) => {
  try {
    const managers = await Manager.find()
    res.status(200).json(managers) // Trả về danh sách managers
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching managers', message: err.message })
  }
})

// API để tạo Admin mới
router.post('/admins', async (req, res) => {
  try {
    const { clerkUserID, role, mongoID, monthlySalary, paycheckList } = req.body
    const newAdmin = new Admin({
      clerkUserID,
      role,
      mongoID,
      monthlySalary,
      paycheckList
    })
    await newAdmin.save()
    res.status(201).json(newAdmin) // Trả về admin mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating admin', message: err.message })
  }
})

// API để lấy tất cả Admin
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find()
    res.status(200).json(admins) // Trả về danh sách admins
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching admins', message: err.message })
  }
})
