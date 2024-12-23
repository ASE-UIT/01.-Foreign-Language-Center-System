const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const router = express.Router()
const { clerkMiddleware, requireAuth, clerkClient } = require('@clerk/express')
const { createProxyMiddleware } = require('http-proxy-middleware')
dotenv.config() // Load các biến môi trường từ file .env

const app = express()
const PORT = process.env.PORT || 5000

// Kiểm tra xem CLERK_SECRET_KEY và CLERK_PUBLISHABLE_KEY có tồn tại không
if (!process.env.CLERK_SECRET_KEY || !process.env.CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk API keys!')
}

// Cấu hình Clerk middleware với apiKey từ environment variables
app.use(clerkMiddleware({ apiKey: process.env.CLERK_SECRET_KEY }))

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
    type: String,
    unique: true
  }, // ID khóa học, tham chiếu tới model Course
  enrollDate: {
    type: String,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  },
  isPaid: {
    type: Boolean
  },
  paycheckIMG: {
    type: String,
    required: false,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/ // Đảm bảo URL hợp lệ
  }
})

// Định nghĩa schema cho Assignment
const assignmentSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 10 },
  description: { type: String, singleline: true },
  comment: { type: String, singleline: true }
})

// Định nghĩa schema cho Student
const studentSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    unique: true
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
  },
  mongoID: {
    type: String,
    unique: true
  },
  isActivated: {
    type: Boolean
  },
  courses: [courseInfoSchema], // Danh sách các khóa học mà học sinh tham gia
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
studentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mongoID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Cấu hình để trả về `mongoID` thay vì `_id` trong JSON
// studentSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret._id // Xóa `_id` khỏi kết quả trả về
//     ret.mongoID = ret.mongoID.toString() // Đảm bảo `mongoID` là kiểu chuỗi
//   }
// })

// Định nghĩa schema cho Teacher
const teacherSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    unique: true
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
  },
  mongoID: {
    type: String,
    unique: true
  },
  courses: {
    type: [String]
  }, // Danh sách các id khóa học giảng dạy
  monthlySalary: {
    type: Number,
    min: 0
  },
  courseSalary: {
    type: Number,
    min: 0
  },
  paycheckList: [
    {
      type: [String]
    }
  ] // Danh sách các bill nhận lương
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
teacherSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mongoID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Class
const classSchema = new mongoose.Schema({
  classID: {
    type: String,
    unique: true
  }, // ID của lớp học
  schedule: {
    type: [String]
  }, // Lịch học của lớp học
  name: {
    type: String
  }, // Tên buổi học
  description: {
    type: [[String]]
  }, // Thông tin mô tả về buổi học
  teachers: {
    type: [[String]]
  }, // Các giảng viên dạy lớp học này
  lessonList: {
    type: [String]
  }, // Danh sách bài học trong lớp học
  progress: {
    type: Number,
    min: 1
  }, // Buổi học hiện tại là buổi thứ mấy
  documents: {
    type: [String],
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Link tài liệu lớp học (phải là URL)
  isActive: {
    type: Boolean
  }, // Lớp học còn hoạt động hay không
  meeting: {
    type: String,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Đường dẫn vào meeting của lớp học
  coverIMG: {
    type: String,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  }, // Đường dẫn hình ảnh của lớp học
  startDate: {
    type: String,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  }, // Ngày bắt đầu lớp học
  endDate: {
    type: String,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  } // Ngày kết thúc lớp học
})

// `pre-save` hook để gán giá trị `_id` vào `classID` trước khi lưu tài liệu
classSchema.pre('save', function (next) {
  if (this.isNew) {
    this.classID = this._id // Gán giá trị `_id` vào `classID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Course
const courseSchema = new mongoose.Schema({
  courseID: {
    type: String,
    unique: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  classes: [classSchema], // Danh sách lớp học trong khóa học (mảng ObjectId tham chiếu đến Class)
  teachers: [
    {
      type: [String]
    }
  ], // Danh sách tên các giáo viên giảng dạy khóa học
  price: {
    type: Number,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  totalVote: {
    type: Number,
    min: 0
  },
  target: {
    type: [String]
  },
  sumary: {
    type: [String]
  },
  studentList: {
    type: [String],
    unique: true
  }, // Danh sách các học sinh tham gia khóa học (lưu = id)
  studentLimit: {
    type: Number,
    min: 1
  },
  appliedNumber: {
    type: Number,
    min: 0
  },
  currentStudent: {
    type: Number,
    min: 0,
    max: this.studentLimit
  },
  coverIMG: {
    type: String,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
  },
  startDate: {
    type: String,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  },
  endDate: {
    type: String,
    match: /^\d{2} \d{2} \d{4}$/ // Kiểm tra định dạng ngày "dd mm yyyy"
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
courseSchema.pre('save', function (next) {
  if (this.isNew) {
    this.courseID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Salary
const salarySchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['teacher', 'accountant', 'manager', 'admin']
  },
  receiverID: {
    type: String
  },
  value: {
    type: Number,
    min: 0
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
teacherSchema.pre('save', function (next) {
  if (this.isNew) {
    this.id = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Accountant
const accountantSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String] // Danh sách các bill chuyển khoản
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
accountantSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mongoID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Manager
const managerSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String] // Danh sách các bill chuyển khoản
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
managerSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mongoID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Định nghĩa schema cho Admin
const adminSchema = new mongoose.Schema({
  clerkUserID: {
    type: String,
    unique: true
  }, // ID người dùng trên hệ thống Clerk
  role: {
    type: String,
    enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
  }, // Vai trò của người dùng
  mongoID: {
    type: String,
    unique: true
  }, // ID MongoDB của đối tượng
  monthlySalary: {
    type: Number,
    min: 0 // Lương hàng tháng
  },
  paycheckList: {
    type: [String] // Danh sách các bill chuyển khoản
  }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
adminSchema.pre('save', function (next) {
  if (this.isNew) {
    this.mongoID = this._id // Gán giá trị `_id` vào `mongoID`
  }
  next() // Tiếp tục với quá trình lưu tài liệu
})

// Tạo model từ schema
const Student = mongoose.model('Student', studentSchema)
const CourseInfo = mongoose.model('CourseInfo', courseInfoSchema)

const Assignment = mongoose.model('Assignment', assignmentSchema)

const Teacher = mongoose.model('Teacher', teacherSchema)
const Course = mongoose.model('Course', courseSchema)
const Class = mongoose.model('Class', classSchema)

const Salary = mongoose.model('Salary', salarySchema)
const Accountant = mongoose.model('Accountant', accountantSchema)
const Manager = mongoose.model('Manager', managerSchema)
const Admin = mongoose.model('Admin', adminSchema)

// Middleware
// Cấu hình CORS để cho phép frontend gửi yêu cầu từ một domain khác
const corsOptions = {
  origin: ['http://localhost:5173'], // Địa chỉ của frontend React (frontend URL)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header cần thiết
  credentials: true // Quan trọng nếu bạn cần gửi cookies/tokens
}

app.use(cors(corsOptions))
app.use(express.json()) // Enable JSON body parsing

// Sử dụng router
app.use('/api', router)

// Lắng nghe server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// API để tạo sinh viên mới
router.post('/students', async (req, res) => {
  try {
    const { clerkUserID, userRole, mongoID, courses } = req.body

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

// API cập nhật thông tin sinh viên
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params // Lấy ID từ URL
    const updateData = req.body // Lấy dữ liệu từ request body

    // Tìm và cập nhật sinh viên
    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true, // Trả về đối tượng đã cập nhật
      runValidators: true // Chạy các validator khi cập nhật
    })

    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    res.status(200).json(student) // Trả về sinh viên đã cập nhật
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error updating student', message: err.message })
  }
})

// API đăng ký khóa học cho sinh viên
router.put('/enroll-course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params // Lấy courseId từ URL
    const { mongoID } = req.body // Lấy mongoID từ request body

    // Tìm sinh viên theo mongoID
    const student = await Student.findOne({ mongoID })

    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    // Kiểm tra xem sinh viên đã đăng ký khóa học này chưa
    const isCourseEnrolled = student.courses.some(
      course => course.courseID === courseId
    )

    if (isCourseEnrolled) {
      return res
        .status(400)
        .json({ error: 'Student already enrolled in this course' })
    }

    // Tạo 1 courseInfo mới với courseID và isPaid = false, paycheckIMG = rỗng
    const newCourseInfo = new CourseInfo({
      courseID: courseId,
      isPaid: false,
      paycheckIMG: '' // Không cần thiết phải có giá trị nếu không có ảnh
    })

    // Thêm courseInfo mới vào danh sách courses của sinh viên
    student.courses.push(newCourseInfo)

    // Lưu thông tin sinh viên
    await student.save()

    // Trả về sinh viên đã cập nhật
    res.status(200).json(student)
  } catch (err) {
    res.status(500).json({
      error: 'Error enrolling student in course',
      message: err.message
    })
  }
})

// API để tạo bài tập mới
router.post('/assignments', async (req, res) => {
  try {
    const { score, description, comment } = req.body
    const newAssignment = new Assignment({ score, description, comment })
    await newAssignment.save()
    res.status(201).json(newAssignment) // Trả về bài tập mới tạo
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Error creating assignment', message: err.message })
  }
})

// API để lấy danh sách bài tập
router.get('/assignments', async (req, res) => {
  try {
    const assignments = await Assignment.find()
    res.status(200).json(assignments) // Trả về danh sách bài tập
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching assignments', message: err.message })
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
    const { id } = req.params
    const updateData = req.body

    // Tìm và cập nhật thông tin khóa học
    const courseInfo = await CourseInfo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    if (!courseInfo) {
      return res.status(404).json({ error: 'Course info not found' })
    }

    res.status(200).json(courseInfo) // Trả về thông tin khóa học đã cập nhật
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

// API để cập nhật thông tin giáo viên
router.put('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Tìm và cập nhật giáo viên
    const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' })
    }

    res.status(200).json(teacher) // Trả về giáo viên đã cập nhật
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error updating teacher', message: err.message })
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

// API để lấy class của giáo viên hoặc học sinh đó
router.get('/classes', async (req, res) => {
  const { mongoID, userRole } = req.query // Lấy mongoID và userRole từ query params

  try {
    if (userRole === 'student') {
      // Tìm học sinh theo mongoID và lấy danh sách các khóa học của học sinh đó
      const student = await Student.findOne({ mongoID })

      if (!student) {
        return res.status(404).json({ error: 'Student not found' })
      }

      // Tìm các khóa học mà học sinh tham gia (dựa trên `courses`)
      const courseIds = student.courses.map(course => course.courseID) // Lấy tất cả `courseID` của học sinh
      const courses = await Course.find({
        courseID: { $in: courseIds } // Tìm khóa học có `courseID` nằm trong danh sách
      })

      // Tập hợp tất cả các lớp học từ các khóa học này
      const allClasses = courses.reduce((acc, course) => {
        return [...acc, ...course.classes] // Gộp tất cả lớp học từ các khóa học
      }, [])

      return res.status(200).json(allClasses) // Trả về danh sách lớp học mà học sinh tham gia
    } else if (userRole === 'teacher') {
      // Tìm giáo viên theo mongoID và lấy danh sách các khóa học của giáo viên đó
      const teacher = await Teacher.findOne({ mongoID })

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' })
      }

      // Lấy danh sách các `courseId` của giáo viên (dựa trên `courses`)
      const courseIds = teacher.courses // `courses` là mảng `courseID` chuỗi của giáo viên
      const courses = await Course.find({
        courseID: { $in: courseIds } // Tìm khóa học có `courseID` trong danh sách của giáo viên
      })

      // Tập hợp tất cả các lớp học từ các khóa học này
      const allClasses = courses.reduce((acc, course) => {
        return [...acc, ...course.classes] // Gộp tất cả lớp học từ các khóa học
      }, [])

      return res.status(200).json(allClasses) // Trả về danh sách lớp học mà giáo viên dạy
    } else {
      return res.status(400).json({ error: 'Invalid role' }) // Nếu role không hợp lệ
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error', message: err.message })
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

// API để cập nhật khóa học
router.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Tìm và cập nhật khóa học
    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.status(200).json(course) // Trả về khóa học đã cập nhật
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error updating course', message: err.message })
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

// API để cập nhật private metadata cho người dùng
app.put('/api/update-metadata', async (req, res) => {
  const { clerkUserId, metadata } = req.body // Lấy thông tin từ request body

  try {
    // Cập nhật private metadata cho người dùng
    await clerkClient.users.updateUserMetadata(clerkUserId, {
      privateMetadata: metadata
    })

    // Trả về phản hồi thành công
    res.status(200).json({ message: 'Metadata updated successfully' })
  } catch (error) {
    // Xử lý lỗi
    res
      .status(500)
      .json({ error: 'Failed to update metadata', message: error.message })
  }
})
