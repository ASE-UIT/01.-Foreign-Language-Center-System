const express = require('express')
const upload = require('./multer');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path');
const router = express.Router()
const { clerkMiddleware, clerkClient } = require('@clerk/express')
const moment = require('moment')

const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


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
    .connect(process.env.MONGO_URI)
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
    courseInfoID: {
        type: String,
        unique: true,
    },
    courseID: {
        type: String,
    },
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
        // match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/ // Đảm bảo URL hợp lệ
    }
})

const courseTeachingSchema = new mongoose.Schema({
    courseID: {
        type: String,
    }
})

// `pre-save` hook để gán giá trị `_id` vào `mongoID` trước khi lưu tài liệu
courseInfoSchema.pre('save', function (next) {
    if (this.isNew) {
        this.courseInfoID = this._id // Gán giá trị `_id` vào `mongoID`
    }
    next() // Tiếp tục với quá trình lưu tài liệu
})

const studentSchema = new mongoose.Schema({
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
    isActivated: {
        type: Boolean
    },
    courses: [courseInfoSchema],
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
        type: [courseTeachingSchema]
    }, // Danh sách các id khóa học giảng dạy
    monthlySalary: {
        type: Number,
        min: 0
    },
    courseSalary: {
        type: Number,
        min: 0
    },
    paycheckList: [String]
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
    classes: [classSchema],
    teachers: [
        {
            type: [String]
        }
    ],
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
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
    },
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
        // match: /^(http|https):\/\/[^\s$.?#].[^\s]*$/
    },
    startDate: {
        type: String,
        match: /^\d{2} \d{2} \d{4}$/
    },
    endDate: {
        type: String,
        match: /^\d{2} \d{2} \d{4}$/
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

// **************************************************************** ADD REQUEST SCHEMA - Giang *****************************************************************************
const requestSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    clerkUserID: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'accountant', 'manager', 'admin']
    }
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
const Request = mongoose.model('Request', requestSchema)
const courseTeaching = mongoose.model('courseTeaching', courseTeachingSchema)

// Middleware
// Cấu hình CORS để cho phép frontend gửi yêu cầu từ một domain khác
const corsOptions = {
    origin: ['http://localhost:3000'], // Địa chỉ của frontend React (frontend URL)
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
    const { clerkUserID, metadata } = req.body // Lấy thông tin từ request body

    try {
        // Cập nhật private metadata cho người dùng
        await clerkClient.users.updateUserMetadata(clerkUserID, {
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


app.get('/api/get-role', async (req, res) => {
    const { clerkUserID } = req.query;

    try {
        if (!clerkUserID) {
            return res.status(400).json({
                error: 'Missing clerkUserID parameter'
            });
        }

        const user = await clerkClient.users.getUser(clerkUserID);
        const userRole = user.privateMetadata.userRole;
        const mongoID = user.privateMetadata.mongoID;
        const isActivated = user.privateMetadata.isActivated;

        return res.status(200).json({
            userRole: userRole,
            mongoID: mongoID,
            isActivated: isActivated
        });

    } catch (error) {
        console.error('Error getting user role:', error);
        return res.status(500).json({
            error: 'Failed to get user role',
            message: error.message
        });
    }
});


const getMetadata = async (clerkUserID) => {
    try {
        if (!clerkUserID) {
            throw new Error('Missing clerkUserID parameter');
        }

        const user = await clerkClient.users.getUser(clerkUserID);
        const userRole = user.privateMetadata.userRole;
        const mongoID = user.privateMetadata.mongoID;
        const isActivated = user.privateMetadata.isActivated;

        return {
            userRole: userRole,
            mongoID: mongoID,
            isActivated: isActivated
        };
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

router.get('/my-classes', async (req, res) => {
    try {
        const { clerkUserID } = req.query;

        const userOnClerk = await getMetadata(clerkUserID);

        const studentID = userOnClerk.mongoID;
        const role = userOnClerk.userRole;

        let student;

        if (role === "student")
            student = await Student.findOne({ _id: studentID });
        else if (role === "teacher")
            student = await Teacher.findOne({ _id: studentID });

        if (!student) {
            return res.status(404).json({ error: 'Student|Teacher not found', id: studentID });
        }

        const courses = await Course.find({
            courseID: { $in: student.courses.map((course) => course.courseID) }
        });

        const userClasses = courses.map((course) => {
            return {
                courseID: course.courseID,
                name: course.name,
                coverIMG: course.coverIMG,
                classes: course.classes
            };
        });

        return res.status(200).json(userClasses);
    } catch (error) {
        console.error('Error fetching my classes:', error);
        return res.status(500).json({ error: 'Failed to fetch my classes' });
    }
});

// **************************************************************** 5 API CHỨC NĂNG - Nguyên *****************************************************************************

// Học sinh có thể đăng ký vào khóa học
router.put('/enroll-course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params // Lấy courseId từ URL
        const { clerkUserID } = req.body;

        const userOnClerk = await getMetadata(clerkUserID);

        const mongoID = userOnClerk.mongoID;
        const userRole = userOnClerk.userRole;

        // const { mongoID, userRole } = req.body // Lấy mongoID, userRole từ request body

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

router.put('/purchase-course/:courseId', upload.single('payProof'), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { clerkUserID } = req.body;
        const payProof = req.file;

        const userOnClerk = await getMetadata(clerkUserID);

        const mongoID = userOnClerk.mongoID;
        const userRole = userOnClerk.userRole;

        if (userRole !== 'student') {
            return res.status(403).json({ error: 'Only student can purchase course' });
        }

        const student = await Student.findOne({ mongoID });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const isCoursePurchased = student.courses.some(
            (course) => course.courseID === courseId && course.isPaid
        );

        if (isCoursePurchased) {
            return res
                .status(400)
                .json({ error: 'Student already purchased this course' });
        }

        const course = await Course.findOne({ courseID: courseId });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        let courseInfo = student.courses.find(
            (courseInfo) => courseInfo.courseID === courseId
        );

        if (!courseInfo) {
            courseInfo = {
                courseID: courseId,
                isPaid: true,
                paycheckIMG: payProof.filename,
            };
            student.courses.push(courseInfo);
        } else {
            courseInfo.isPaid = true;
            courseInfo.paycheckIMG = payProof.filename;
        }

        await student.save();

        res.status(200).json({
            message: 'Purchase course successfully',
        });
    } catch (error) {
        console.error('Error purchasing course:', error);
        res.status(500).json({
            error: 'Failed to purchase course',
            message: error.message,
        });
    }
});


// Học sinh có thể xem điểm của mình của khóa học nào đó
router.get('/scores/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params // Lấy courseId từ URL
        const { clerkUserID } = req.body // Lấy mongoID, userRole từ request body

        const userOnClerk = await getMetadata(clerkUserID);

        const mongoID = userOnClerk.mongoID;
        const userRole = userOnClerk.userRole;

        // Nếu không phải là sinh viên thì không thể xem điểm
        if (userRole !== 'student') {
            return res.status(403).json({ error: 'Only student can view scores' })
        }

        // Tìm sinh viên theo mongoID
        const student = await Student.findOne({ mongoID: mongoID })

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
    const { clerkUserID } = req.query // Lấy mongoID và userRole từ query params

    const userOnClerk = await getMetadata(clerkUserID);

    const mongoID = userOnClerk.mongoID;
    const userRole = userOnClerk.userRole;

    console.log(mongoID, userRole);

    try {
        if (userRole === 'student') {
            // Tìm học sinh theo mongoID và lấy danh sách các khóa học của học sinh đó
            const student = await Student.findOne({ mongoID: mongoID })

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
    const { clerkUserID } = req.query // Lấy mongoID và userRole từ query params

    const userOnClerk = await getMetadata(clerkUserID);

    const mongoID = userOnClerk.mongoID;
    const userRole = userOnClerk.userRole;

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

// **************************************************************** 6 API GIANG *****************************************************************************
// API get all student
router.get('/all-students', async (req, res) => {
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);

    const userRole = userOnClerk.userRole;

    // Kiểm tra vai trò (role)
    const allowedRoles = ['accountant', 'manager', 'admin']
    if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({ error: 'Invalid userRole' })
    }

    try {
        const allStudents = await Student.find()

        // Trả về danh sách học sinh
        res.status(200).json(allStudents)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API xem học sinh của 1 khóa học
router.get('/students/:courseId', async (req, res) => {
    const { clerkUserID } = req.query
    const { courseId } = req.params

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    // Kiểm tra vai trò (role)
    const allowedRoles = ['admin', 'accountant', 'manager', 'teacher']
    if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({ error: 'Invalid userRole' })
    }

    try {
        // Tìm người dùng dựa trên vai trò
        let user
        switch (userRole) {
            case 'admin':
                user = await Admin.findOne({ clerkUserID: clerkUserID })
                break
            case 'accountant':
                user = await Accountant.findOne({ clerkUserID: clerkUserID })
                break
            case 'manager':
                user = await Manager.findOne({ clerkUserID: clerkUserID })
                break
            case 'teacher':
                user = await Teacher.findOne({ clerkUserID: clerkUserID })
                break
        }

        // Kiểm tra người dùng tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Tìm khóa học
        const course = await Course.findOne({ courseID: courseId })

        // Kiểm tra khóa học
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // Kiểm tra quyền của giáo viên
        if (userRole === 'teacher') {
            const isTeachingThisCourse = course.teachers.some(teacherArray =>
                teacherArray.includes(user.clerkUserID)
            )
            if (!isTeachingThisCourse) {
                return res.status(403).json({
                    error: "Teacher is not authorized to view this course's students"
                })
            }
        }

        // Lấy danh sách các học sinh từ khóa học
        const studentList = course.studentList

        if (!studentList || studentList.length === 0) {
            return res.status(200).json([])
        }

        const students = await Student.find({ mongoID: { $in: studentList } })

        // Trả về danh sách học sinh
        res.status(200).json(students)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API finance
router.get('/finance', async (req, res) => {
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    // Kiểm tra vai trò (role)
    if (userRole !== 'admin') {
        return res.status(400).json({ error: 'Invalid userRole' })
    }

    try {
        // Tìm người dùng dựa trên vai trò
        const admin = await Admin.findOne({ clerkUserID: clerkUserID })

        // Kiểm tra người dùng tồn tại không
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' })
        }

        // Lấy danh sách tất cả các khoản lương
        const salaries = await Salary.find()

        // Lấy danh sách tất cả các khóa học
        const courses = await Course.find()

        // Tính toán lợi nhuận
        const incomes = courses.reduce((acc, course) => {
            if (course.studentList) {
                const courseIncomes = course.studentList.map(studentId => ({
                    studentId: studentId,
                    courseId: course.courseID,
                    price: course.price
                }))
                return [...acc, ...courseIncomes]
            }
            return acc
        }, [])

        // Trả về dữ liệu tài chính
        res.status(200).json({
            outcomes: salaries,
            incomes: incomes
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API xem các giáo viên
router.get('/teachers', async (req, res) => {
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    // Kiểm tra vai trò (role)
    const allowedRoles = ['admin', 'accountant', 'manager']
    if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({ error: 'Invalid userRole' })
    }

    try {
        // Tìm người dùng dựa trên vai trò
        let user
        switch (userRole) {
            case 'admin':
                user = await Admin.findOne({ clerkUserID: clerkUserID })
                break
            case 'accountant':
                user = await Accountant.findOne({ clerkUserID: clerkUserID })
                break
            case 'manager':
                user = await Manager.findOne({ clerkUserID: clerkUserID })
                break
        }

        // Kiểm tra người dùng tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Lấy danh sách tất cả giáo viên
        const allTeachers = await Teacher.find()

        // Trả về danh sách giáo viên
        res.status(200).json(allTeachers)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API lấy tất cả các request
router.get('/all-requests', async (req, res) => {
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    // Kiểm tra vai trò
    if (userRole !== 'manager') {
        return res.status(403).json({ error: 'Unauthorized user role' })
    }

    try {
        // Tìm người dùng dựa trên vai trò
        const user = await Manager.findOne({ clerkUserID: clerkUserID })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        // Lấy tất cả các request
        const requests = await Request.find({})

        res.status(200).json(requests)
    } catch (error) {
        console.error('Error fetching requests:', error)
        res
            .status(500)
            .json({ error: 'Failed to fetch requests.', message: error.message })
    }
})

// API để kích hoạt tài khoản
router.post('/activate', async (req, res) => {
    const { targetClerkUserID, roleValue } = req.body
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    if (!targetClerkUserID || !roleValue) {
        return res
            .status(400)
            .json({ error: 'Missing targetClerkUserID or roleValue' })
    }

    // Kiểm tra vai trò
    if (userRole !== 'manager') {
        return res.status(403).json({ error: 'Unauthorized user role' })
    }

    try {
        // Find the manager
        const user = await Manager.findOne({ clerkUserID: clerkUserID })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        // Kiểm tra roleValue có hợp lệ
        const validRoles = ['student', 'teacher', 'accountant', 'manager', 'admin']
        if (!validRoles.includes(roleValue)) {
            return res.status(400).json({ error: 'Invalid roleValue provided' })
        }

        const targetUser = await clerkClient.users.getUser(targetClerkUserID)

        if (!targetUser) {
            return res
                .status(404)
                .json({ error: 'User not found with this clerkUserID' })
        }

        const targetMongoID = targetUser.privateMetadata.mongoID
        const clerkUserID = targetUser.id
        const currentRole = targetUser.privateMetadata.userRole
        // Kiểm tra trùng lặp
        if (currentRole === roleValue) {
            return res.status(200).json({
                message: `User with mongoID ${targetMongoID} is already activated as ${roleValue} and metadata is up to date`
            })
        }

        // Tạo object mới theo role
        let newObject
        switch (roleValue) {
            case 'teacher':
                newObject = new Teacher({
                    clerkUserID: clerkUserID,
                    userRole: roleValue,
                    mongoID: targetMongoID,
                    courses: [],
                    monthlySalary: 0,
                    courseSalary: 0,
                    paycheckList: []
                })
                break
            case 'accountant':
                newObject = new Accountant({
                    clerkUserID: clerkUserID,
                    role: roleValue,
                    mongoID: targetMongoID,
                    monthlySalary: 0,
                    paycheckList: []
                })
                break
            case 'manager':
                newObject = new Manager({
                    clerkUserID: clerkUserID,
                    role: roleValue,
                    mongoID: targetMongoID,
                    monthlySalary: 0,
                    paycheckList: []
                })
                break
            case 'admin':
                newObject = new Admin({
                    clerkUserID: clerkUserID,
                    role: roleValue,
                    mongoID: targetMongoID,
                    monthlySalary: 0,
                    paycheckList: []
                })
                break
            default:
                newObject = new Student({
                    clerkUserID: clerkUserID,
                    userRole: roleValue,
                    mongoID: targetMongoID,
                    isActivated: true
                })
                break
        }

        // Lưu object mới vào database
        await newObject.save()

        // Update clerk metadata
        await clerkClient.users.updateUser(clerkUserID, {
            privateMetadata: {
                userRole: roleValue,
                mongoID: newObject.mongoID,
                isActivated: true
            }
        })

        //Remove request in DB
        await Request.deleteOne({ clerkUserID: clerkUserID })

        res.status(200).json({
            message: `User with mongoID ${targetMongoID} has been activated as ${roleValue} and metadata updated.`
        })
    } catch (error) {
        console.error('Error activating user:', error)
        res.status(500).json({
            error: 'Failed to activate user.',
            message: error.message
        })
    }
})

// **************************************************************** 4 API CHỨC NĂNG - QUÂN *****************************************************************************

//API thêm course
router.post('/add-course', async (req, res) => {
    const {
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
    } = req.body

    try {
        // Kiểm tra xem các trường bắt buộc có đầy đủ không
        if (
            !name ||
            !description ||
            !classes ||
            !price ||
            !target ||
            !sumary ||
            !studentLimit ||
            !coverIMG ||
            !startDate ||
            !endDate
        ) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        if (compareAtPrice && compareAtPrice < price) {
            return res.status(400).json({
                error: 'Compare-at price must be greater than or equal to price.'
            })
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
        })

        // Lưu vào database
        await newCourse.save()

        // Trả về kết quả thành công
        res.status(201).json({
            message: 'Course added successfully',
            course: newCourse
        })
    } catch (err) {
        console.error(err)
        // Xử lý lỗi server
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API Thêm học sinh vào course
router.post('/add-student-to-course/:courseId/:studentId', async (req, res) => {
    const { courseId, studentId } = req.params

    try {
        // 1. Kiểm tra xem khóa học có tồn tại không
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // 2. Kiểm tra xem học sinh có tồn tại không
        const student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).json({ error: 'Student not found' })
        }

        // 3. Kiểm tra xem học sinh đã có trong khóa học chưa
        if (course.studentList.includes(studentId)) {
            return res
                .status(400)
                .json({ error: 'Student already enrolled in this course' })
        }

        // 4. Thêm học sinh vào danh sách học sinh của khóa học
        course.studentList.push(studentId)
        await course.save()

        // 5. Tạo object courseInfo cho học sinh và thêm vào danh sách courses của học sinh
        const courseInfo = {
            courseId: courseId,
            isPaid: true, // Đặt isPaid là true vì học sinh đã thanh toán
            enrollDate: moment().format('DD MM YYYY') // Định dạng ngày hôm nay
        }

        student.courses.push(courseInfo)
        await student.save()

        // 6. Trả về kết quả thành công
        res.status(200).json({
            message: 'Student successfully added to the course',
            courseId: courseId,
            studentId: studentId,
            courseInfo: courseInfo
        })
    } catch (err) {
        console.error(err)
        // Xử lý lỗi server
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API Thêm giáo viên vào course
router.post('/add-teacher-to-course/:courseId/:teacherId', async (req, res) => {
    const { courseId, teacherId } = req.params
    const { classSchedules } = req.body // classSchedules là mảng chứa thông tin lớp và buổi học muốn gán giáo viên

    try {
        // 1. Kiểm tra xem khóa học có tồn tại không
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // 2. Kiểm tra xem giáo viên có tồn tại không
        const teacher = await Teacher.findById(teacherId)
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' })
        }

        // 3. Kiểm tra và thêm giáo viên vào danh sách giáo viên của khóa học
        if (!course.teachers) {
            course.teachers = []
        }

        // Kiểm tra giáo viên đã có trong khóa học chưa
        if (course.teachers.includes(teacherId)) {
            return res
                .status(400)
                .json({ error: 'Teacher already added to this course' })
        }

        // Thêm giáo viên vào khóa học
        course.teachers.push(teacherId)
        await course.save()

        // 4. Cập nhật thông tin lớp học, thêm giáo viên vào các buổi học cụ thể
        if (classSchedules && Array.isArray(classSchedules)) {
            for (const schedule of classSchedules) {
                const { classId, session } = schedule

                // Tìm lớp học trong khóa học theo classId
                const classIndex = course.classes.findIndex(
                    classItem => classItem.classId === classId
                )
                if (classIndex === -1) {
                    return res.status(400).json({
                        error: `Class with ID ${classId} not found in this course`
                    })
                }

                // Kiểm tra số buổi học trong lớp đó
                const classItem = course.classes[classIndex]
                if (session < 1 || session > classItem.schedule.length) {
                    return res
                        .status(400)
                        .json({ error: `Invalid session number for class ${classId}` })
                }

                // Thêm giáo viên vào buổi học đúng theo session
                classItem.schedule[session - 1].teachers.push(teacherId) // Lưu ý session là 1-based, nhưng mảng là 0-based
            }

            // Lưu lại thông tin khóa học với các thay đổi
            await course.save()
        }

        // 5. Trả về kết quả thành công
        res.status(200).json({
            message:
                'Teacher successfully added to the course and assigned to sessions',
            courseId: courseId,
            teacherId: teacherId,
            classSchedules: classSchedules
        })
    } catch (err) {
        console.error(err)
        // Xử lý lỗi server
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API xem thông tin course
router.get('/course-information/:courseId', async (req, res) => {
    const { courseId } = req.params

    try {
        // Kiểm tra thông tin đầu vào
        if (!courseId) {
            return res
                .status(400)
                .json({ message: 'Thông tin khóa học không hợp lệ.' })
        }

        // Tìm khóa học theo courseId
        const course = await Course.findOne({ courseID: courseId })
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' })
        }

        // Trả về thông tin chi tiết của khóa học
        return res.status(200).json({
            message: 'Thông tin khóa học.',
            course: course
        })
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json({ message: 'Có lỗi xảy ra khi lấy thông tin khóa học.' })
    }
})

//API xem thông tin course
router.get('/course-detail/:courseId', async (req, res) => {
    const { courseId } = req.params

    try {
        if (!courseId) {
            return res
                .status(400)
                .json({ message: 'Thông tin khóa học không hợp lệ.' })
        }

        // Tìm khóa học theo courseId
        const course = await Course.findOne({ courseID: courseId })
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại.' })
        }

        // Trả về thông tin chi tiết của khóa học
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.error(error)
        return res
            .status(500)
            .json({ message: 'Có lỗi xảy ra khi lấy thông tin khóa học.' })
    }
})

// **************************************************************** 4 API CHỨC NĂNG - CHÂU *****************************************************************************

//API xóa student khỏi course
router.delete('/delete/:courseId/:studentId', async (req, res) => {
    const { courseId, studentId } = req.params
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    try {
        // Kiểm tra quyền hạn: Chỉ kế toán và nhân viên hỗ trợ học vụ được phép truy cập
        if (!['accountant', 'manager'].includes(userRole)) {
            return res
                .status(403)
                .json({ error: 'Access denied. Invalid permissions.' })
        }

        let user
        switch (userRole) {
            case 'accountant':
                user = await Accountant.findOne({ clerkUserID: clerkUserID })
                break
            case 'manager':
                user = await Manager.findOne({ clerkUserID: clerkUserID })
                break
        }

        if (!user) {
            return res.status(404).json({ error: 'Requesting user not found.' })
        }

        // Kiểm tra xem student có tồn tại không
        const student = await Student.findById(studentId)
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' })
        }

        // Kiểm tra xem course có tồn tại không
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' })
        }

        // Xóa courseId khỏi danh sách courseInfo của học sinh
        student.courses = student.courses.filter(
            info => info.courseID.toString() !== courseId.toString()
        )
        await student.save()

        // Xóa studentId khỏi danh sách studentList của khóa học
        course.studentList = course.studentList.filter(
            id => id.toString() !== studentId.toString()
        )
        await course.save()

        // Cập nhật số học sinh trong course
        course.currentStudent = course.studentList.length
        await course.save()

        // Trả về phản hồi thành công
        res
            .status(200)
            .json({ message: 'Student access to course removed successfully.' })
    } catch (err) {
        console.error(err)
        // Xử lý lỗi server
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API xem thông tin của học sinh
router.get('/student-information', async (req, res) => {
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;
    const studentId = userOnClerk.mongoID;

    if (userRole === "student") {
        try {
            const student = await Student.findOne({ _id: studentId })

            if (!student) {
                return res.status(404).json({ error: 'Requesting user not found.', userRole: userRole, studentID: studentId })
            }

            const courseIds = student.courses.map((course) => course.courseID)

            const courses = await Course.find({
                courseID: { $in: courseIds }
            })

            const courseInfo = await Promise.all(courses.map(async (course) => {
                const classes = course.classes

                const classInfo = await Promise.all(classes.map(async (classItem) => {
                    return {
                        classID: classItem.classID,
                        className: classItem.name,
                        schedule: classItem.schedule,
                        meeting: classItem.meeting,
                        teacher: course.teachers,
                    }
                }))

                return {
                    courseID: course.courseID,
                    courseName: course.name,
                    startDate: course.startDate,
                    endDate: course.endDate,
                    coverIMG: course.coverIMG,
                    enrollDate: course.enrollDate,
                    price: course.price,
                    rating: course.rating,
                    isPaid: true,
                    totalVote: course.totalVote,
                    classes: classInfo,
                }
            }))

            res.status(200).json({ courses: courseInfo })
        } catch (err) {
            console.error(err)
            // Xử lý lỗi server
            res.status(500).json({ error: 'Server error', message: err.message })
        }
    } else if (userRole === "teacher") {
        try {
            const student = await Teacher.findOne({ _id: studentId })

            if (!student) {
                return res.status(404).json({ error: 'Requesting user not found.', userRole: userRole, teacherId: studentId })
            }

            const courseIds = student.courses.map((course) => course.courseID)

            const courses = await Course.find({
                courseID: { $in: courseIds }
            })

            const courseInfo = await Promise.all(courses.map(async (course) => {
                const classes = course.classes

                const classInfo = await Promise.all(classes.map(async (classItem) => {
                    return {
                        classID: classItem.classID,
                        className: classItem.name,
                        schedule: classItem.schedule,
                        meeting: classItem.meeting,
                        teacher: course.teachers,
                    }
                }))

                return {
                    courseID: course.courseID,
                    courseName: course.name,
                    startDate: course.startDate,
                    endDate: course.endDate,
                    coverIMG: course.coverIMG,
                    enrollDate: "",
                    price: course.price,
                    rating: course.rating,
                    isPaid: true,
                    totalVote: course.totalVote,
                    classes: classInfo,
                }
            }))

            res.status(200).json({ courses: courseInfo })
        } catch (err) {
            console.error(err)
            // Xử lý lỗi server
            res.status(500).json({ error: 'Server error', message: err.message })
        }
    }


})

router.get('/class/:classID', async (req, res) => {
    const { clerkUserID } = req.query;
    const { classID } = req.params;

    const userOnClerk = await getMetadata(clerkUserID);
    const studentId = userOnClerk.mongoID;
    const userRole = userOnClerk.userRole;

    if (userRole === "student") {
        try {
            const student = await Student.findOne({ mongoID: studentId })

            if (!student) {
                return res.status(404).json({ error: 'Requesting user not found.' })
            }

            const courseIds = student.courses.map((course) => course.courseID)

            const courses = await Course.find({
                courseID: { $in: courseIds }
            })

            const targetClass = await Course.findOne({
                courseID: { $in: courseIds },
                "classes.classID": classID
            })

            if (!targetClass) {
                return res.status(404).json({ error: 'Class not found.' })
            }

            const targetClasses = targetClass.classes.filter((classItem) => classItem.classID === classID)

            if (targetClasses.length === 0) {
                return res.status(404).json({ error: 'Class not found.' })
            }

            res.status(200).json({ classInfo: targetClasses[0] })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Server error', message: err.message })
        }
    } else if (userRole === "teacher") {
        try {
            const student = await Teacher.findOne({ mongoID: studentId })

            if (!student) {
                return res.status(404).json({ error: 'Requesting user not found.' })
            }

            const courseIds = student.courses.map((course) => course.courseID)

            const courses = await Course.find({
                courseID: { $in: courseIds }
            })

            const targetClass = await Course.findOne({
                courseID: { $in: courseIds },
                "classes.classID": classID
            })

            if (!targetClass) {
                return res.status(404).json({ error: 'Class not found.' })
            }

            const targetClasses = targetClass.classes.filter((classItem) => classItem.classID === classID)

            if (targetClasses.length === 0) {
                return res.status(404).json({ error: 'Class not found.' })
            }

            res.status(200).json({ classInfo: targetClasses[0] })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Server error', message: err.message })
        }
    } else try {
        const student = await Student.findOne({ mongoID: studentId })

        if (!student) {
            return res.status(404).json({ error: 'Requesting user not found.' })
        }

        const courseIds = student.courses.map((course) => course.courseID)

        const courses = await Course.find({
            courseID: { $in: courseIds }
        })

        const targetClass = await Course.findOne({
            courseID: { $in: courseIds },
            "classes.classID": classID
        })

        if (!targetClass) {
            return res.status(404).json({ error: 'Class not found.' })
        }

        const targetClasses = targetClass.classes.filter((classItem) => classItem.classID === classID)

        if (targetClasses.length === 0) {
            return res.status(404).json({ error: 'Class not found.' })
        }

        res.status(200).json({ classInfo: targetClasses[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API xem điểm của học sinh
router.get('/result/:courseId/:studentId', async (req, res) => {
    const { courseId, studentId } = req.params
    const { clerkUserID } = req.query

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    try {
        // Kiểm tra quyền hạn: Chỉ giáo viên hoặc nhân viên quản lý học vụ được phép truy cập
        if (!['teacher', 'manager'].includes(userRole)) {
            return res
                .status(403)
                .json({ error: 'Access denied. Invalid permissions.' })
        }

        let user
        switch (userRole) {
            case 'teacher':
                user = await Teacher.findOne({ clerkUserID: clerkUserID })
                // Kiểm tra giáo viên chỉ có thể xem điểm của khóa học mình dạy
                if (!user.courses.includes(courseId)) {
                    return res
                        .status(403)
                        .json({ error: 'Teacher not assigned to this course.' })
                }
                break
            case 'manager':
                user = await Manager.findOne({ clerkUserID: clerkUserID })
                break
        }

        if (!user) {
            return res.status(404).json({ error: 'Requesting user not found.' })
        }

        // Tìm thông tin học sinh trong database
        const student = await Student.findById(studentId)

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' })
        }

        // Tìm thông tin courseInfo cho student
        const courseInfo = student.courses.find(
            course => course.courseID.toString() === courseId.toString()
        )

        if (!courseInfo) {
            return res
                .status(404)
                .json({ error: 'Student is not enrolled in this course.' })
        }

        // Trả về phần scores của courseInfo
        res.status(200).json({ scores: courseInfo.scores })
    } catch (err) {
        console.error(err)
        // Xử lý lỗi server
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

//API quản lý lịch dạy giáo viên
router.put(
    '/teacher-schedule/:courseId/:classId/:teacherId',
    async (req, res) => {
        const { courseId, classId, teacherId } = req.params
        const { clerkUserID, schedules } = req.body

        try {
            // Kiểm tra quyền hạn: Chỉ nhân viên hỗ trợ học vụ hoặc quản lý mới có thể thay đổi lịch dạy
            const manager = await Manager.findOne({ clerkUserID: clerkUserID })
            if (!manager) {
                return res
                    .status(403)
                    .json({ error: 'Access denied. Manager role required.' })
            }

            // Tìm khóa học và lớp học theo ID
            const course = await Course.findById(courseId)
            const classObj = await Class.findById(classId)

            if (!course || !classObj) {
                return res.status(404).json({ error: 'Course or Class not found.' })
            }

            // Tìm giáo viên
            const teacher = await Teacher.findById(teacherId)
            if (!teacher) {
                return res.status(404).json({ error: 'Teacher not found' })
            }

            // Thêm khóa học cho giáo viên nếu chưa tồn tại
            if (!teacher.courses.includes(courseId)) {
                teacher.courses.push(courseId)
            }

            // Đổi ngày thành số
            const getDayNumber = dayName => {
                const days = {
                    Mon: 1,
                    Tue: 2,
                    Wed: 3,
                    Thu: 4,
                    Fri: 5,
                    Sat: 6,
                    Sun: 0
                }
                return days[dayName]
            }

            // Đổi string sang moment cho ngày bắt đầu và kết thúc
            const startDate = moment(classObj.startDate, 'DD MM YYYY')
            const endDate = moment(classObj.endDate, 'DD MM YYYY')

            // Tạo mảng teachers trong class nếu chưa có
            if (!classObj.teachers) {
                classObj.teachers = []
            }

            // Xử lý lịch dạy
            schedules.forEach(schedule => {
                // Phân tích chuỗi lịch (ví dụ: "Thu 15:30 17:30")
                const [day, startTime, endTime] = schedule.split(' ')
                const dayNumber = getDayNumber(day)

                // Tìm tất cả các ngày giữa ngày bắt đầu và ngày kết thúc khớp với ngày trong tuần hiện tại
                let currentDate = startDate.clone()
                while (currentDate.isSameOrBefore(endDate)) {
                    if (currentDate.day() === dayNumber) {
                        // Tìm chỉ số buổi học dựa trên ngày
                        const lessonIndex = Math.floor(
                            currentDate.diff(startDate, 'days') / 7
                        )

                        // Đảm bảo mảng `teachers` có đủ kích thước
                        while (classObj.teachers.length <= lessonIndex) {
                            classObj.teachers.push([])
                        }

                        // Thêm giáo viên vào buổi học cụ thể nếu chưa được thêm
                        if (!classObj.teachers[lessonIndex].includes(teacherId)) {
                            classObj.teachers[lessonIndex].push(teacherId)
                        }
                    }
                    currentDate.add(1, 'days')
                }
            })

            // Lưu lại dữ liệu
            await course.save()
            await classObj.save()
            await teacher.save()

            res.status(200).json({
                message: 'Teacher schedule updated successfully',
                updatedTeachers: classObj.teachers
            })
        } catch (err) {
            console.error(err)
            // Xử lý lỗi server
            res.status(500).json({ error: 'Server error', message: err.message })
        }
    }
)

// **************************************************************** HA PHAN *****************************************************************************

// API để lấy danh sách tất cả các khóa học
router.get('/courses', async (req, res) => {
    try {
        // Lấy tất cả các khóa học từ cơ sở dữ liệu
        const courses = await Course.find() // Tìm tất cả các khóa học

        // // Chọn các trường cần thiết để trả về
        // const courseList = courses.map(course => ({
        //     courseID: course.courseID,
        //     name: course.name,
        //     classes: course.classes,
        //     teachers: course.teachers,
        //     description: course.description,
        //     price: course.price,
        //     rating: course.rating,
        //     totalVote: course.totalVote,
        //     studentLimit: course.studentLimit,
        //     currentStudent: course.currentStudent,
        //     target: course.target,
        //     sumary: course.sumary,
        // }))

        // Trả về danh sách khóa học
        res.status(200).json(courses)
    } catch (err) {
        console.error(err)
        res
            .status(500)
            .json({ error: 'Error fetching courses', message: err.message })
    }
})

// API để kế toán xem toàn bộ lương của các nhân viên
router.get('/salaries', async (req, res) => {
    const { clerkUserID } = req.query // Lấy clerkUserID và userRole từ query params

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    try {
        // Kiểm tra vai trò
        if (userRole !== 'accountant') {
            return res
                .status(403)
                .json({ error: 'Only accountants can view salaries' })
        }

        // Tìm người dùng theo clerkUserID
        const accountant = await Accountant.findOne({ clerkUserID: clerkUserID })

        if (!accountant) {
            return res.status(404).json({ error: 'Accountant not found' })
        }

        // Lấy toàn bộ collection Salary
        const salaries = await Salary.find({})

        // Trả về danh sách lương
        res.status(200).json(salaries)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API để nhân viên xem lương của mình
router.get('/salary', async (req, res) => {
    const { clerkUserID } = req.query // Lấy thông tin từ query params

    const userOnClerk = await getMetadata(clerkUserID);
    const mongoID = userOnClerk.mongoID;
    const userRole = userOnClerk.userRole;

    try {
        const allowedRoles = ['teacher', 'accountant', 'manager', 'admin']
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Access denied: Invalid user role' })
        }

        let employee
        if (userRole === 'teacher') {
            employee = await Teacher.findOne({ mongoID: mongoID })
        } else if (userRole === 'accountant') {
            employee = await Accountant.findOne({ mongoID: mongoID })
        } else if (userRole === 'manager') {
            employee = await Manager.findOne({ mongoID: mongoID })
        } else if (userRole === 'admin') {
            employee = await Admin.findOne({ mongoID: mongoID })
        } else {
            return res.status(403).json({ error: 'Access denied: Invalid user role' })
        }

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' })
        }

        const salaries = await Salary.find({ id: { $in: employee.paycheckList } })
        res.status(200).json(salaries)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// API để giáo viên upload tài liệu cho học sinh
router.post('/upload-document', async (req, res) => {
    const { clerkUserID, classId, documentLink } = req.body // Lấy thông tin từ request body

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    // Xác thực người dùng
    if (userRole !== 'teacher') {
        return res.status(403).json({ message: 'Chưa' }) // Chỉ giáo viên mới có quyền upload tài liệu
    }

    try {
        // Tìm lớp học theo classId
        const classRoom = await Class.findOne({ classID: classId })
        if (!classRoom) {
            return res.status(404).json({ message: 'Chưa' }) // Lớp học không tồn tại
        }

        // Thêm tài liệu vào lớp học
        classRoom.documents.push(documentLink) // Thêm link tài liệu vào mảng documents
        await classRoom.save() // Lưu thay đổi

        // Trả về kết quả
        return res.status(200).json({ message: 'Đã add thành công tài liệu' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Chưa' }) // Xử lý lỗi
    }
})

// API để kế toán xác nhận thanh toán học phí của học sinh cho khóa học
router.put('/confirm-payment', async (req, res) => {
    const { clerkUserID, courseId, studentId } = req.body // Lấy thông tin từ request body

    const userOnClerk = await getMetadata(clerkUserID);
    const userRole = userOnClerk.userRole;

    try {
        // Kiểm tra vai trò
        if (userRole !== 'accountant') {
            return res
                .status(403)
                .json({ error: 'Only accountants can confirm payments' })
        }

        // Tìm học sinh theo studentId
        const student = await Student.findOne({ mongoID: studentId })

        if (!student) {
            return res.status(404).json({ error: 'Student not found' })
        }

        // Tìm thông tin khóa học trong danh sách courses của học sinh
        const courseInfo = student.courses.find(
            course => course.courseID === courseId
        )

        if (!courseInfo) {
            return res
                .status(404)
                .json({ error: 'Course not found in student records' })
        }

        // Cập nhật isPaid thành true
        courseInfo.isPaid = true

        // Lưu thông tin sinh viên
        await student.save()

        // Cập nhật studentList của khóa học
        const course = await Course.findOne({ courseID: courseId })

        if (!course) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // Thêm studentId vào studentList của khóa học
        if (!course.studentList.includes(studentId)) {
            course.studentList.push(studentId)
            await course.save()
        }

        // Trả về thông báo xác nhận thành công
        res.status(200).json({ message: 'Payment confirmed successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// **************************************************************** CRUD API *****************************************************************************
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

// **************************************************************** CRUD ASSIGNMENT *****************************************************************************

// POST: Tạo mới assignment
app.post('/api/assignments', async (req, res) => {
    try {
        const assignment = new Assignment(req.body)
        const newAssignment = await assignment.save()
        res.status(201).json(newAssignment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả assignments
app.get('/api/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find()
        res.status(200).json(assignments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật assignment theo ID
app.put('/api/assignments/:id', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            updates,
            options
        )
        if (!updatedAssignment)
            return res.status(404).json({ message: 'Assignment not found' })
        res.status(200).json(updatedAssignment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa assignment theo ID
app.delete('/api/assignments/:id', async (req, res) => {
    try {
        const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id)
        if (!deletedAssignment)
            return res.status(404).json({ message: 'Assignment not found' })
        res.status(200).json({ message: 'Assignment deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CRUD COURSE INFO *****************************************************************************

// POST: Tạo mới courseInfo
app.post('/api/course-info', async (req, res) => {
    try {
        const courseInfo = new CourseInfo(req.body)
        const newCourseInfo = await courseInfo.save()
        res.status(201).json(newCourseInfo)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả courseInfo
app.get('/api/course-info', async (req, res) => {
    try {
        const courseInfos = await CourseInfo.find()
        res.status(200).json(courseInfos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật courseInfo theo ID
app.put('/api/course-info/:id', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedCourseInfo = await CourseInfo.findByIdAndUpdate(
            req.params.id,
            updates,
            options
        )
        if (!updatedCourseInfo)
            return res.status(404).json({ message: 'CourseInfo not found' })
        res.status(200).json(updatedCourseInfo)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa courseInfo theo ID
app.delete('/api/course-info/:id', async (req, res) => {
    try {
        const deletedCourseInfo = await CourseInfo.findByIdAndDelete(req.params.id)
        if (!deletedCourseInfo)
            return res.status(404).json({ message: 'CourseInfo not found' })
        res.status(200).json({ message: 'CourseInfo deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CUD STUDENT *****************************************************************************

// POST: Tạo mới student
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body)
        const newStudent = await student.save()
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PUT: Cập nhật student theo mongoID
app.put('/api/students/:mongoID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedStudent = await Student.findOneAndUpdate(
            { mongoID: req.params.mongoID },
            updates,
            options
        )
        if (!updatedStudent)
            return res.status(404).json({ message: 'Student not found' })
        res.status(200).json(updatedStudent)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa student theo mongoID
app.delete('/api/students/:mongoID', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({
            mongoID: req.params.mongoID
        })
        if (!deletedStudent)
            return res.status(404).json({ message: 'Student not found' })
        res.status(200).json({ message: 'Student deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CUD TEACHER *****************************************************************************

// POST: Tạo mới teacher
app.post('/api/teachers', async (req, res) => {
    try {
        const teacher = new Teacher(req.body)
        const newTeacher = await teacher.save()
        res.status(201).json(newTeacher)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PUT: Cập nhật teacher theo mongoID
app.put('/api/teachers/:mongoID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { mongoID: req.params.mongoID },
            updates,
            options
        )
        if (!updatedTeacher)
            return res.status(404).json({ message: 'Teacher not found' })
        res.status(200).json(updatedTeacher)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa teacher theo mongoID
app.delete('/api/teachers/:mongoID', async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findOneAndDelete({
            mongoID: req.params.mongoID
        })
        if (!deletedTeacher)
            return res.status(404).json({ message: 'Teacher not found' })
        res.status(200).json({ message: 'Teacher deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CUD CLASS *****************************************************************************

// POST: Tạo mới class
app.post('/api/classes', async (req, res) => {
    try {
        const newClass = new Class(req.body)
        const savedClass = await newClass.save()
        res.status(201).json(savedClass)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// PUT: Cập nhật class theo classID
app.put('/api/classes/:classID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedClass = await Class.findOneAndUpdate(
            { classID: req.params.classID },
            updates,
            options
        )
        if (!updatedClass)
            return res.status(404).json({ message: 'Class not found' })
        res.status(200).json(updatedClass)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa class theo classID
app.delete('/api/classes/:classID', async (req, res) => {
    try {
        const deletedClass = await Class.findOneAndDelete({
            classID: req.params.classID
        })
        if (!deletedClass)
            return res.status(404).json({ message: 'Class not found' })
        res.status(200).json({ message: 'Class deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** UD COURSE *****************************************************************************

// PUT: Cập nhật course theo courseID
app.put('/api/courses/:courseID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedCourse = await Course.findOneAndUpdate(
            { courseID: req.params.courseID },
            updates,
            options
        )
        if (!updatedCourse)
            return res.status(404).json({ message: 'Course not found' })
        res.status(200).json(updatedCourse)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/courses/:courseID/classes/:classID', async (req, res) => {
    try {
        const course = await Course.findOne({ courseID: req.params.courseID })
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        const classIndex = course.classes.findIndex(
            (classItem) => classItem.classID === req.params.classID
        )
        if (classIndex === -1) {
            return res.status(404).json({ message: 'Class not found in this course' })
        }

        course.classes[classIndex] = { ...course.classes[classIndex], ...req.body }
        await course.save()

        res.status(200).json(course)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

router.post('/courses/:courseID/classes', async (req, res) => {
    try {
        const course = await Course.findOne({ courseID: req.params.courseID })
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        course.classes.push(req.body)
        await course.save()

        res.status(201).json(course)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error', message: err.message })
    }
})

// DELETE: Xóa course theo courseID
app.delete('/api/courses/:courseID', async (req, res) => {
    try {
        const deletedCourse = await Course.findOneAndDelete({
            courseID: req.params.courseID
        })
        if (!deletedCourse)
            return res.status(404).json({ message: 'Course not found' })
        res.status(200).json({ message: 'Course deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CRUD SALARY *****************************************************************************
// POST: Tạo mới salary
app.post('/api/salaries', async (req, res) => {
    try {
        const salary = new Salary(req.body)
        const newSalary = await salary.save()
        res.status(201).json(newSalary)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả salaries
app.get('/api/salaries', async (req, res) => {
    try {
        const salaries = await Salary.find()
        res.status(200).json(salaries)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật salary theo ID
app.put('/api/salaries/:id', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedSalary = await Salary.findOneAndUpdate(
            { id: req.params.id },
            updates,
            options
        )
        if (!updatedSalary)
            return res.status(404).json({ message: 'Salary not found' })
        res.status(200).json(updatedSalary)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa salary theo ID
app.delete('/api/salaries/:id', async (req, res) => {
    try {
        const deletedSalary = await Salary.findOneAndDelete({ id: req.params.id })
        if (!deletedSalary)
            return res.status(404).json({ message: 'Salary not found' })
        res.status(200).json({ message: 'Salary deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
// **************************************************************** CRUD ACCOUNTANT *****************************************************************************

// POST: Tạo mới accountant
app.post('/api/accountants', async (req, res) => {
    try {
        const accountant = new Accountant(req.body)
        const newAccountant = await accountant.save()
        res.status(201).json(newAccountant)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả accountants
app.get('/api/accountants', async (req, res) => {
    try {
        const accountants = await Accountant.find()
        res.status(200).json(accountants)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật accountant theo mongoID
app.put('/api/accountants/:mongoID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedAccountant = await Accountant.findOneAndUpdate(
            { mongoID: req.params.mongoID },
            updates,
            options
        )
        if (!updatedAccountant)
            return res.status(404).json({ message: 'Accountant not found' })
        res.status(200).json(updatedAccountant)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa accountant theo mongoID
app.delete('/api/accountants/:mongoID', async (req, res) => {
    try {
        const deletedAccountant = await Accountant.findOneAndDelete({
            mongoID: req.params.mongoID
        })
        if (!deletedAccountant)
            return res.status(404).json({ message: 'Accountant not found' })
        res.status(200).json({ message: 'Accountant deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CRUD MANAGER *****************************************************************************

// POST: Tạo mới manager
app.post('/api/managers', async (req, res) => {
    try {
        const manager = new Manager(req.body)
        const newManager = await manager.save()
        res.status(201).json(newManager)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả managers
app.get('/api/managers', async (req, res) => {
    try {
        const managers = await Manager.find()
        res.status(200).json(managers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật manager theo mongoID
app.put('/api/managers/:mongoID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedManager = await Manager.findOneAndUpdate(
            { mongoID: req.params.mongoID },
            updates,
            options
        )
        if (!updatedManager)
            return res.status(404).json({ message: 'Manager not found' })
        res.status(200).json(updatedManager)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa manager theo mongoID
app.delete('/api/managers/:mongoID', async (req, res) => {
    try {
        const deletedManager = await Manager.findOneAndDelete({
            mongoID: req.params.mongoID
        })
        if (!deletedManager)
            return res.status(404).json({ message: 'Manager not found' })
        res.status(200).json({ message: 'Manager deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CRUD ADMIN *****************************************************************************

// POST: Tạo mới admin
app.post('/api/admins', async (req, res) => {
    try {
        const admin = new Admin(req.body)
        const newAdmin = await admin.save()
        res.status(201).json(newAdmin)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// GET: Lấy danh sách tất cả admins
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.find()
        res.status(200).json(admins)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PUT: Cập nhật admin theo mongoID
app.put('/api/admins/:mongoID', async (req, res) => {
    try {
        const updates = req.body
        const options = { new: true }
        const updatedAdmin = await Admin.findOneAndUpdate(
            { mongoID: req.params.mongoID },
            updates,
            options
        )
        if (!updatedAdmin)
            return res.status(404).json({ message: 'Admin not found' })
        res.status(200).json(updatedAdmin)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa admin theo mongoID
app.delete('/api/admins/:mongoID', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findOneAndDelete({
            mongoID: req.params.mongoID
        })
        if (!deletedAdmin)
            return res.status(404).json({ message: 'Admin not found' })
        res.status(200).json({ message: 'Admin deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// **************************************************************** CD REQUEST *****************************************************************************

// POST: Tạo mới request
app.post('/api/requests', async (req, res) => {
    try {
        const request = new Request(req.body)
        const newRequest = await request.save()
        res.status(201).json(newRequest)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE: Xóa request theo ID
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const deletedRequest = await Request.findOneAndDelete({ id: req.params.id })
        if (!deletedRequest)
            return res.status(404).json({ message: 'Request not found' })
        res.status(200).json({ message: 'Request deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})