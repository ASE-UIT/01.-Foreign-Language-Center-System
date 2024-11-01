import React from 'react'
import '../styles/Login.css'
import login from '../images/login.png'

const Login = ({ closeOverlay, openRegisterOverlay }) => {
  return (
    <div className='login'>
      <img className='login-img' src={login} alt='' />
      <div className='login-elements'>
        <form className='login-form'>
          <input
            type='text'
            placeholder='Email hoặc tên tài khoản'
            className='login-input'
          />
          <input
            type='password'
            placeholder='Mật khẩu'
            className='login-input'
          />
          <div className='login-checkbox'>
            <input
              type='checkbox'
              id='save-password'
              className='login-checkbox-input'
            />
            <label htmlFor='save-password' className='login-checkbox-label'>
              Nhớ mật khẩu
            </label>
          </div>
          <button type='submit' className='login-button'>
            Đăng nhập
          </button>
          <div className='signup-group'>
            <label htmlFor='signup'>Không có tài khoản?</label>
            <button
              type='button'
              id='signup'
              className='sub-signup-button'
              onClick={() => {
                closeOverlay() // Đóng overlay đăng nhập
                openRegisterOverlay() // Mở overlay đăng ký
              }}
            >
              Đăng ký
            </button>
          </div>
          <div className='divider'>
            <span>OR</span>
          </div>
          <div className='social-login'>
            <button type='button' className='social-login-button google-login'>
              <i class='fa-brands fa-google'></i>
            </button>
            <button
              type='button'
              className='social-login-button facebook-login'
            >
              <i class='fa-brands fa-facebook'></i>
            </button>
            <button type='button' className='social-login-button github-login'>
              <i class='fa-brands fa-github'></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
