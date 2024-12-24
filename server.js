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

//API xóa student khỏi course
router.delete("/delete/:courseId/:studentId", async (req, res) => {
  const { courseId, studentId } = req.params;
  const { clerkUserId, userRole } = req.query;

  try {
    // Kiểm tra quyền hạn: Chỉ kế toán và nhân viên hỗ trợ học vụ được phép truy cập
    if (!["accountant", "manager"].includes(userRole)) {
      return res.status(403).json({ error: 'Access denied. Invalid permissions.' });
    }

    let user;
    switch (userRole) {
      case 'accountant':
        user = await Accountant.findOne({ clerkUserID: clerkUserId });
        break;
      case 'manager':
        user = await Manager.findOne({ clerkUserID: clerkUserId });
        break;
    }

    if (!user) {
      return res.status(404).json({ error: 'Requesting user not found.' });
    }

    // Kiểm tra xem student có tồn tại không
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Kiểm tra xem course có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Xóa courseId khỏi danh sách courseInfo của học sinh
    student.courses = student.courses.filter(info => info.courseID.toString() !== courseId.toString());
    await student.save();

    // Xóa studentId khỏi danh sách studentList của khóa học
    course.studentList = course.studentList.filter(id => id.toString() !== studentId.toString());
    await course.save();

    // Cập nhật số học sinh trong course
    course.currentStudent = course.studentList.length;
    await course.save();

    // Trả về phản hồi thành công
    res.status(200).json({ message: 'Student access to course removed successfully.' });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API xem thông tin của học sinh
router.get('/information/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { clerkUserId, userRole } = req.query;

  try {
    // Kiểm tra quyền hạn: Chỉ kế toán và nhân viên hỗ trợ học vụ được phép truy cập
    if (!["accountant", "manager"].includes(userRole)) {
      return res.status(403).json({ error: 'Access denied. Invalid permissions.' });
    }

    let user;
    switch (userRole) {
      case 'accountant':
        user = await Accountant.findOne({ clerkUserID: clerkUserId });
        break;
      case 'manager':
        user = await Manager.findOne({ clerkUserID: clerkUserId });
        break;
    }

    if (!user) {
      return res.status(404).json({ error: 'Requesting user not found.' });
    }

    // Tìm thông tin học sinh trong database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Lấy thêm thông tin từ Clerk
    const clerkInfo = await clerkClient.users.getUser(student.clerkUserID);

    if (!clerkInfo) {
      return res.status(404).json({ error: 'Student Clerk information not found.' });
    }

    // Gộp thông tin từ MongoDB và Clerk
    const studentInfo = {
      ...student.toObject(),
      clerkInfo: clerkInfo,
    };

    // Trả về thông tin học sinh
    res.status(200).json({ student: studentInfo });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API xem điểm của học sinh
router.get('/result/:courseId/:studentId', async (req, res) => {
  const { courseId, studentId } = req.params;
  const { clerkUserId, userRole } = req.query;

  try {
    // Kiểm tra quyền hạn: Chỉ giáo viên hoặc nhân viên quản lý học vụ được phép truy cập
    if (!["teacher", "manager"].includes(userRole)) {
      return res.status(403).json({ error: 'Access denied. Invalid permissions.' });
    }

    let user;
    switch (userRole) {
      case 'teacher':
        user = await Teacher.findOne({ clerkUserID: clerkUserId });
        // Kiểm tra giáo viên chỉ có thể xem điểm của khóa học mình dạy
        if (!user.courses.includes(courseId)) {
          return res.status(403).json({ error: 'Teacher not assigned to this course.' });
        }
        break;
      case 'manager':
        user = await Manager.findOne({ clerkUserID: clerkUserId });
        break;
    }

    if (!user) {
      return res.status(404).json({ error: 'Requesting user not found.' });
    }

    // Tìm thông tin học sinh trong database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // Tìm thông tin courseInfo cho student
    const courseInfo = student.courses.find(course => 
      course.courseID.toString() === courseId.toString()
    );

    if (!courseInfo) {
      return res.status(404).json({ error: 'Student is not enrolled in this course.' });
    }

    // Trả về phần scores của courseInfo
    res.status(200).json({ scores: courseInfo.scores });

  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

//API quản lý lịch dạy giáo viên
router.put('/teacher-schedule/:courseId/:classId/:teacherId', async (req, res) => {
  const { courseId, classId, teacherId } = req.params;
  const { clerkUserId, schedules } = req.body;

  try {
    // Kiểm tra quyền hạn: Chỉ nhân viên hỗ trợ học vụ hoặc quản lý mới có thể thay đổi lịch dạy
    const manager = await Manager.findOne({ clerkUserID: clerkUserId });
    if (!manager) {
      return res.status(403).json({ error: 'Access denied. Manager role required.' });
    }

    // Tìm khóa học và lớp học theo ID
    const course = await Course.findById(courseId);
    const classObj = await Class.findById(classId);

    if (!course || !classObj) {
      return res.status(404).json({ error: 'Course or Class not found.' });
    }

    // Tìm giáo viên
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Thêm khóa học cho giáo viên nếu chưa tồn tại
    if (!teacher.courses.includes(courseId)) {
      teacher.courses.push(courseId);
    }

    // Đổi ngày thành số
    const getDayNumber = (dayName) => {
      const days = {
        'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 
        'Fri': 5, 'Sat': 6, 'Sun': 0
      };
      return days[dayName];
    };

    // Đổi string sang moment cho ngày bắt đầu và kết thúc
    const startDate = moment(classObj.startDate, 'DD MM YYYY');
    const endDate = moment(classObj.endDate, 'DD MM YYYY');
    
    // Tạo mảng teachers trong class nếu chưa có
    if (!classObj.teachers) {
      classObj.teachers = [];
    }

    // Xử lý lịch dạy
    schedules.forEach(schedule => {
      // Phân tích chuỗi lịch (ví dụ: "Thu 15:30 17:30")
      const [day, startTime, endTime] = schedule.split(' ');
      const dayNumber = getDayNumber(day);

      // Tìm tất cả các ngày giữa ngày bắt đầu và ngày kết thúc khớp với ngày trong tuần hiện tại
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        if (currentDate.day() === dayNumber) {
          // Tìm chỉ số buổi học dựa trên ngày
          const lessonIndex = Math.floor(currentDate.diff(startDate, 'days') / 7);
          
          // Đảm bảo mảng `teachers` có đủ kích thước
          while (classObj.teachers.length <= lessonIndex) {
            classObj.teachers.push([]);
          }

          // Thêm giáo viên vào buổi học cụ thể nếu chưa được thêm
          if (!classObj.teachers[lessonIndex].includes(teacherId)) {
            classObj.teachers[lessonIndex].push(teacherId);
          }
        }
        currentDate.add(1, 'days');
      }
    });

    // Lưu lại dữ liệu
    await course.save();
    await classObj.save();
    await teacher.save();

    res.status(200).json({ 
      message: 'Teacher schedule updated successfully',
      updatedTeachers: classObj.teachers
    });
  } catch (err) {
    console.error(err);
    // Xử lý lỗi server
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
