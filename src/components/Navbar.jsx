import React from 'react'
import { useState } from 'react'
import '../styles/Navbar.css'
import logo from '../images/logo.png'
import Login from './Login'
import Signup from './Signup'

// Dữ liệu JSON
const rolesData = {
  guest: {
    pages: [
      { label: 'Thông tin', link: '/thongtin' },
      { label: 'Ứng tuyển', link: '/ungtuyen' },
      { label: 'Khóa học', link: '/khoahoc' },
      { label: 'Tư vấn', link: '/tuvan' }
    ],
    buttons: [
      { label: 'Đăng nhập', link: '/dangnhap' },
      { label: 'Đăng ký', link: '/dangky' }
    ]
  },
  student: {
    pages: [
      { label: 'Thông tin', link: '/student/thongtin' },
      { label: 'Khóa học', link: '/student/khoahoc' },
      { label: 'Lịch học', link: '/student/lichhoc' },
      { label: 'Bài tập', link: '/student/baitap' }
    ],
    buttons: [
      { icon: 'notification', link: '/student/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Student Name',
          link: '/student/profile'
        }
      }
    ]
  },
  owner: {
    pages: [
      { label: 'Bảng tin', link: '/owner/bantin' },
      { label: 'Thống kê', link: '/owner/thongke' },
      { label: 'Quản lý', link: '/owner/quanly' }
    ],
    buttons: [
      { icon: 'notification', link: '/owner/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Owner Name',
          link: '/owner/profile'
        }
      }
    ]
  },
  leader: {
    pages: [
      { label: 'Bảng tin', link: '/leader/bangtin' },
      { label: 'Thống kê', link: '/leader/thongke' },
      { label: 'Nhân viên', link: '/leader/nhanvien' },
      { label: 'Giáo viên', link: '/leader/giaovien' }
    ],
    buttons: [
      { icon: 'notification', link: '/leader/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Leader Name',
          link: '/leader/profile'
        }
      }
    ]
  },
  teacher: {
    pages: [
      { label: 'Lịch trình', link: '/teacher/lichtrinh' },
      { label: 'Giảng dạy', link: '/teacher/giangday' },
      { label: 'Trao đổi', link: '/teacher/traodoi' }
    ],
    buttons: [
      { icon: 'notification', link: '/teacher/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Teacher Name',
          link: '/teacher/profile'
        }
      }
    ]
  },
  accountant: {
    pages: [
      { label: 'Học phí', link: '/accountant/hocphi' },
      { label: 'Chi tiêu', link: '/accountant/chitieu' },
      { label: 'Trao đổi', link: '/accountant/traodoi' }
    ],
    buttons: [
      { icon: 'notification', link: '/accountant/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Accountant Name',
          link: '/accountant/profile'
        }
      }
    ]
  },
  admissions_counselor: {
    pages: [
      { label: 'Bài đăng', link: '/admissions/baidang' },
      { label: 'Khuyến mãi', link: '/admissions/khuyemai' },
      { label: 'Tư vấn', link: '/admissions/tuvan' }
    ],
    buttons: [
      { icon: 'notification', link: '/admissions/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Counselor Name',
          link: '/admissions/profile'
        }
      }
    ]
  },
  supporter: {
    pages: [
      { label: 'Xếp lớp', link: '/supporter/xeplop' },
      { label: 'Giáo viên', link: '/supporter/giaovien-base' },
      { label: 'Quản lý', link: '/supporter/quanly' }
    ],
    buttons: [
      { icon: 'notification', link: '/supporter/notifications' },
      {
        user: {
          user_image: 'https://avatar.iran.liara.run/public',
          user_name: 'Supporter Name',
          link: '/supporter/profile'
        }
      }
    ]
  }
}
const Navbar = ({ role }) => {
  const [isLoginOverlayVisible, setLoginOverlayVisible] = useState(false)
  const [isRegisterOverlayVisible, setRegisterOverlayVisible] = useState(false)

  const openLoginOverlay = () => {
    setLoginOverlayVisible(true)
  }

  const closeLoginOverlay = () => {
    setLoginOverlayVisible(false)
  }

  const openRegisterOverlay = () => {
    setRegisterOverlayVisible(true)
  }

  const closeRegisterOverlay = () => {
    setRegisterOverlayVisible(false)
  }
  // Lấy dữ liệu role tương ứng
  const roleData = rolesData[role] || rolesData.guest

  return (
    <nav className='navbar'>
      <div className='nav-logo'>
        <a href={`/${role}/`}>
          <img src={logo} alt='' />
        </a>
      </div>
      <ul className='nav-links'>
        {roleData.pages.map((page, index) => (
          <li key={index}>
            <a href={page.link}>{page.label}</a>
          </li>
        ))}
      </ul>
      <div className='nav-buttons'>
        {roleData.buttons.map((button, index) => (
          <React.Fragment key={index}>
            {button.label ? (
              // Nếu có label (như với guest role)
              <a
                href={button.link}
                className='nav-auth'
                onClick={event => {
                  event.preventDefault() // Ngăn trang làm mới
                  button.label === 'Đăng nhập'
                    ? openLoginOverlay()
                    : openRegisterOverlay()
                }}
              >
                {button.label}
              </a>
            ) : (
              // Nếu là user info (với các role khác)
              button.user && (
                <div className='nav-profile'>
                  <i className='fa-regular fa-bell fa-lg'></i>
                  <div className='user-info'>
                    <a href={button.user.link}>
                      <img
                        src={button.user.user_image}
                        alt={button.user.user_name}
                        className='user-image'
                      />
                      {button.user.user_name}
                    </a>
                  </div>
                </div>
              )
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Overlay đăng nhập */}
      {isLoginOverlayVisible && (
        <div className='overlay'>
          <div className='overlay-content'>
            <button className='close-button' onClick={closeLoginOverlay}>
              <i class='fa-solid fa-xmark'></i>
            </button>
            <Login
              closeOverlay={closeLoginOverlay}
              openRegisterOverlay={openRegisterOverlay}
            />
          </div>
        </div>
      )}
      {/* Overlay đăng ký */}
      {isRegisterOverlayVisible && (
        <div className='overlay'>
          <div className='overlay-content'>
            <button className='close-button' onClick={closeRegisterOverlay}>
              <i class='fa-solid fa-xmark'></i>
            </button>
            <Signup />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
