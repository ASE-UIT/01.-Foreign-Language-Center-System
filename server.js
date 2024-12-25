const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const router = express.Router()
const { clerkMiddleware, requireAuth, clerkClient } = require('@clerk/express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const moment = require('moment') // Để xử lý thời gian cho API schedule

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

// Định nghĩa schema cho Assignment
const assignmentSchema = new mongoose.Schema({
  score: { type: Number, min: 0, max: 10 },
  description: { type: String, singleline: true },
  comment: { type: String, singleline: true }
})

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
  scores: [assignmentSchema], // Thông tin điểm số của sinh viên
  paycheckIMG: {
    type: String,
    required: false,
    match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/ // Đảm bảo URL hợp lệ
  }
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
  ], // Danh sách id các giáo viên giảng dạy khóa học
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

// **************************************************************** API TEST CLERK *****************************************************************************

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

// **************************************************************** 5 API CHỨC NĂNG *****************************************************************************

// Học sinh có thể đăng ký vào khóa học
router.put('/enroll-course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params // Lấy courseId từ URL
    const { mongoID, userRole } = req.body // Lấy mongoID, userRole từ request body

    // Nếu không phải là sinh viên thì không thể đăng ký khóa học
    if (userRole !== 'student') {
      return res.status(403).json({ error: 'Only student can enroll course' })
    }

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

    // Trả về thông báo đăng ký thành công
    res.status(200).json({ message: 'Enroll course successfully' })
  } catch (err) {
    res.status(500).json({
      error: 'Error enrolling student in course',
      message: err.message
    })
  }
})

// Học sinh có quyền thanh toán học phí cho khóa học
router.put('/purchase-course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params // Lấy courseId từ URL
    const { mongoID, userRole, paycheckIMG } = req.body // Lấy mongoID, userRole, payCheckIMG từ request body

    // Nếu không phải là sinh viên thì không thể mua khóa học
    if (userRole !== 'student') {
      return res.status(403).json({ error: 'Only student can purchase course' })
    }

    // Tìm sinh viên theo mongoID
    const student = await Student.findOne({ mongoID })

    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    // Kiểm tra xem sinh viên đã thanh toán khóa học này chưa
    const isCoursePurchased = student.courses.some(
      course => course.courseID === courseId && course.isPaid
    )

    if (isCoursePurchased) {
      return res
        .status(400)
        .json({ error: 'Student already purchased this course' })
    }

    // Cập nhật payCheckIMG cho courseInfo của khóa học
    const courseInfo = student.courses.find(
      course => course.courseID === courseId
    )
    courseInfo.paycheckIMG = paycheckIMG

    // Lưu thông tin sinh viên
    await student.save()

    // Trả về thông báo đã cập nhật
    res.status(200).json({
      message:
        'Pay check received successfully. Please wait for the confirmation from our staff'
    })
  } catch (err) {
    res.status(500).json({
      error: 'Error purchasing course',
      message: err.message
    })
  }
})

// Học sinh có thể xem điểm của mình của khóa học nào đó
router.get('/scores/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params // Lấy courseId từ URL
    const { mongoID, userRole } = req.body // Lấy mongoID, userRole từ request body

    // Nếu không phải là sinh viên thì không thể xem điểm
    if (userRole !== 'student') {
      return res.status(403).json({ error: 'Only student can view scores' })
    }

    // Tìm sinh viên theo mongoID
    const student = await Student.findOne({ mongoID })

    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    // Tìm thông tin khóa học mà sinh viên đang học
    const courseInfo = student.courses.find(
      course => course.courseID === courseId
    )

    if (!courseInfo) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Trả về điểm của sinh viên
    res.status(200).json({ scores: courseInfo.scores })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error fetching scores', message: err.message })
  }
})

// Học sinh và giáo viên có thể xem các lớp học mình học/dạy
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

// API để xem lịch học của học sinh trong tuần
router.get('/schedule', async (req, res) => {
  const { mongoID, userRole } = req.query // Lấy mongoID và userRole từ query params

  try {
    let classesInWeek = [] // Mảng chứa lịch học trong tuần

    // Lấy tuần hiện tại
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD') // Chủ nhật tuần này
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD') // Thứ bảy tuần này

    if (userRole === 'student') {
      // Tìm sinh viên theo mongoID
      const student = await Student.findOne({ mongoID })

      if (!student) {
        return res.status(404).json({ error: 'Student not found' })
      }

      // Duyệt qua các khóa học của học sinh
      for (let courseInfo of student.courses) {
        const course = await Course.findOne({ courseID: courseInfo.courseID })

        if (course) {
          // Duyệt qua các lớp học của khóa học
          for (let classObj of course.classes) {
            const classSchedule = classObj.schedule.filter(scheduleTime => {
              const scheduleMoment = moment(scheduleTime, 'ddd HH:mm')
              return scheduleMoment.isBetween(
                startOfWeek,
                endOfWeek,
                null,
                '[]'
              )
            })

            if (classSchedule.length > 0) {
              classesInWeek.push({
                class: classObj.name,
                schedule: classSchedule
              })
            }
          }
        }
      }

      res.status(200).json({ schedules: classesInWeek })
    } else if (userRole === 'teacher') {
      // Tìm giáo viên theo mongoID
      const teacher = await Teacher.findOne({ mongoID })

      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' })
      }

      // Duyệt qua các khóa học của giáo viên
      for (let courseId of teacher.courses) {
        const course = await Course.findOne({ courseID: courseId })

        if (course) {
          // Duyệt qua các lớp học của khóa học
          for (let classObj of course.classes) {
            const classSchedule = classObj.schedule.filter(scheduleTime => {
              const scheduleMoment = moment(scheduleTime, 'ddd HH:mm')
              return scheduleMoment.isBetween(
                startOfWeek,
                endOfWeek,
                null,
                '[]'
              )
            })

            if (classSchedule.length > 0) {
              classesInWeek.push({
                class: classObj.name,
                schedule: classSchedule
              })
            }
          }
        }
      }

      res.status(200).json({ schedules: classesInWeek })
    } else {
      return res.status(400).json({ error: 'Invalid user role' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error', message: err.message })
  }
})

// **************************************************************** HA PHAN *****************************************************************************

// API để lấy danh sách tất cả các khóa học
router.get('/courses', async (req, res) => {
  try {
    // Lấy tất cả các khóa học từ cơ sở dữ liệu
    const courses = await Course.find({}); // Tìm tất cả các khóa học

    // Chọn các trường cần thiết để trả về
    const courseList = courses.map(course => ({
      name: course.name,
      description: course.description,
      rating: course.rating,
      totalVote: course.totalVote,
      studentLimit: course.studentLimit,
      currentStudent: course.currentStudent,
      id: course.courseID 
    }));

    // Trả về danh sách khóa học
    res.status(200).json(courseList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching courses', message: err.message });
  }
});

// API để kế toán xem toàn bộ lương của các nhân viên
router.get('/salaries', async (req, res) => {
  const { clerkUserId, userRole } = req.query; // Lấy clerkUserId và userRole từ query params

  try {
    // Kiểm tra vai trò
    if (userRole !== 'accountant') {
      return res.status(403).json({ error: 'Only accountants can view salaries' });
    }

    // Tìm người dùng theo clerkUserId
    const accountant = await Accountant.findOne({ clerkUserId: clerkUserId });

    if (!accountant) {
      return res.status(404).json({ error: 'Accountant not found' });
    }

    // Lấy toàn bộ collection Salary
    const salaries = await Salary.find({});

    // Trả về danh sách lương
    res.status(200).json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// API để nhân viên xem lương của mình
router.get('/salary', async (req, res) => {
  const { clerkUserId, mongoID, userRole } = req.query; // Lấy thông tin từ query params

  try {
    // Kiểm tra quyền truy cập
    const allowedRoles = ['teacher', 'accountant', 'manager', 'admin'];
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied: Invalid user role' });
    }

    // Tìm nhân viên theo mongoID
    let employee;
    if (userRole === 'teacher') {
      employee = await Teacher.findOne({ mongoID });
    } else if (userRole === 'accountant') {
      employee = await Accountant.findOne({ mongoID });
    } else if (userRole === 'manager') {
      employee = await Manager.findOne({ mongoID });
    } else if (userRole === 'admin') {
      employee = await Admin.findOne({ mongoID });
    } else {
      return res.status(403).json({ error: 'Access denied: Invalid user role' });
    }

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Kiểm tra quyền của user với `clerkUserId`
    if (employee.clerkUserId !== clerkUserId) {
      return res.status(403).json({ error: 'Access denied: You do not have permission to view this salary' });
    }

    // Lấy danh sách paycheck từ employee
    const paycheckList = employee.paycheckList;

    // Tìm các salary tương ứng với paycheckList
    const salaries = await Salary.find({ id: { $in: paycheckList } });

    // Trả về dữ liệu lương
    res.status(200).json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// API để giáo viên upload tài liệu cho học sinh
router.post('/upload-document', async (req, res) => {
  const { clerkUserId, userRole, classId, documentLink } = req.body; // Lấy thông tin từ request body

  // Xác thực người dùng
  if (userRole !== 'teacher') {
    return res.status(403).json({ message: 'Chưa' }); // Chỉ giáo viên mới có quyền upload tài liệu
  }

  try {
    // Tìm lớp học theo classId
    const classRoom = await Class.findOne({ classID: classId });
    if (!classRoom) {
      return res.status(404).json({ message: 'Chưa' }); // Lớp học không tồn tại
    }

    // Thêm tài liệu vào lớp học
    classRoom.documents.push(documentLink); // Thêm link tài liệu vào mảng documents
    await classRoom.save(); // Lưu thay đổi

    // Trả về kết quả
    return res.status(200).json({ message: 'Đã add thành công tài liệu' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Chưa' }); // Xử lý lỗi
  }
});

// API để kế toán xác nhận thanh toán học phí của học sinh cho khóa học
router.put('/confirm-payment', async (req, res) => {
  const { clerkUserId, userRole, courseId, studentId } = req.body; // Lấy thông tin từ request body

  try {
    // Kiểm tra vai trò
    if (userRole !== 'accountant') {
      return res.status(403).json({ error: 'Only accountants can confirm payments' });
    }

    // Tìm học sinh theo studentId
    const student = await Student.findOne({ mongoID: studentId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Tìm thông tin khóa học trong danh sách courses của học sinh
    const courseInfo = student.courses.find(course => course.courseID === courseId);

    if (!courseInfo) {
      return res.status(404).json({ error: 'Course not found in student records' });
    }

    // Cập nhật isPaid thành true
    courseInfo.isPaid = true;

    // Lưu thông tin sinh viên
    await student.save();

    // Cập nhật studentList của khóa học
    const course = await Course.findOne({ courseID: courseId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Thêm studentId vào studentList của khóa học
    if (!course.studentList.includes(studentId)) {
      course.studentList.push(studentId);
      await course.save();
    }

    // Trả về thông báo xác nhận thành công
    res.status(200).json({ message: 'Payment confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
