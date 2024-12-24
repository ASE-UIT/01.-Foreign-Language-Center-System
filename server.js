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

// **************************************************************** 4 API CHỨC NĂNG *****************************************************************************

//API thêm course
router.post('/add-course', async (req, res) => {
  const { name, description, classes, price, compareAtPrice, target, sumary, studentLimit, coverIMG, startDate, endDate} = req.body;

  try {
    // Kiểm tra xem các trường bắt buộc có đầy đủ không
    if (!name || !description || !classes || !price || !target || !sumary || !studentLimit || !coverIMG || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (compareAtPrice && compareAtPrice < price) {
      return res.status(400).json({ error: 'Compare-at price must be greater than or equal to price.' });
    }

    // Tạo object khóa học mới
    const newCourse = new Course({
      name,
      description,
      classes,
      price,
      compareAtPrice,
      target,
      sumary,
      studentLimit,
      coverIMG,
      startDate,
      endDate
    });

    // Lưu vào database
    await newCourse.save();

    // Trả về kết quả thành công
    res.status(201).json({
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API Thêm học sinh vào course
router.post('/add-student-to-course/:courseId/:studentId', async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    // 1. Kiểm tra xem khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // 2. Kiểm tra xem học sinh có tồn tại không
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 3. Kiểm tra xem học sinh đã có trong khóa học chưa
    if (course.studentList.includes(studentId)) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    // 4. Thêm học sinh vào danh sách học sinh của khóa học
    course.studentList.push(studentId);
    await course.save();

    // 5. Tạo object courseInfo cho học sinh và thêm vào danh sách courses của học sinh
    const courseInfo = {
      courseId: courseId,
      isPaid: true,  // Đặt isPaid là true vì học sinh đã thanh toán
      enrollDate: moment().format('DD MM YYYY')  // Định dạng ngày hôm nay
    };

    student.courses.push(courseInfo);
    await student.save();

    // 6. Trả về kết quả thành công
    res.status(200).json({
      message: 'Student successfully added to the course',
      courseId: courseId,
      studentId: studentId,
      courseInfo: courseInfo
    });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API Thêm giáo viên vào course
router.post('/add-teacher-to-course/:courseId/:teacherId', async (req, res) => {
  const { courseId, teacherId } = req.params;
  const { classSchedules } = req.body;  // classSchedules là mảng chứa thông tin lớp và buổi học muốn gán giáo viên

  try {
    // 1. Kiểm tra xem khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // 2. Kiểm tra xem giáo viên có tồn tại không
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // 3. Kiểm tra và thêm giáo viên vào danh sách giáo viên của khóa học
    if (!course.teachers) {
      course.teachers = [];
    }

    // Kiểm tra giáo viên đã có trong khóa học chưa
    if (course.teachers.includes(teacherId)) {
      return res.status(400).json({ error: 'Teacher already added to this course' });
    }
    
    // Thêm giáo viên vào khóa học
    course.teachers.push(teacherId);
    await course.save();

    // 4. Cập nhật thông tin lớp học, thêm giáo viên vào các buổi học cụ thể
    if (classSchedules && Array.isArray(classSchedules)) {
      for (const schedule of classSchedules) {
        const { classId, session } = schedule;

        // Tìm lớp học trong khóa học theo classId
        const classIndex = course.classes.findIndex(classItem => classItem.classId === classId);
        if (classIndex === -1) {
          return res.status(400).json({ error: `Class with ID ${classId} not found in this course` });
        }

        // Kiểm tra số buổi học trong lớp đó
        const classItem = course.classes[classIndex];
        if (session < 1 || session > classItem.schedule.length) {
          return res.status(400).json({ error: `Invalid session number for class ${classId}` });
        }

        // Thêm giáo viên vào buổi học đúng theo session
        classItem.schedule[session - 1].teachers.push(teacherId); // Lưu ý session là 1-based, nhưng mảng là 0-based
      }

      // Lưu lại thông tin khóa học với các thay đổi
      await course.save();
    }

    // 5. Trả về kết quả thành công
    res.status(200).json({
      message: 'Teacher successfully added to the course and assigned to sessions',
      courseId: courseId,
      teacherId: teacherId,
      classSchedules: classSchedules
    });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API xem thông tin course
router.get('/course-information/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    // Kiểm tra thông tin đầu vào
    if (!courseId) {
      return res.status(400).json({ message: "Thông tin khóa học không hợp lệ." });
    }

    // Tìm khóa học theo courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại." });
    }

    // Trả về thông tin chi tiết của khóa học
    return res.status(200).json({
      message: "Thông tin khóa học.",
      course: course
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi lấy thông tin khóa học." });
  }
});
