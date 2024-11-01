import React from 'react'
import '../styles/Signup.css'
import signup from '../images/signup.png'

const Signup = () => {
  return (
    <div className='signup'>
      <img className='signup-img' src={signup} alt='' />
      <div className='signup-elements'>
        <form className='signup-form'>
          <input
            type='text'
            placeholder='Tên tài khoản'
            className='signup-input'
          />
          <input type='email' placeholder='Email' className='signup-input' />
          <input
            type='text'
            placeholder='Số điện thoại'
            className='signup-input'
          />
          <input
            type='password'
            placeholder='Password'
            className='signup-input'
          />
          <div className='signup-checkbox'>
            <input
              type='checkbox'
              id='save-password'
              className='signup-checkbox-input'
            />
            <label htmlFor='save-password' className='signup-checkbox-label'>
              Nhớ mật khẩu
            </label>
          </div>
          <button type='submit' className='signup-button'>
            Đăng ký
          </button>
          <div className='divider'>
            <span>OR</span>
          </div>
          <div className='social-signup'>
            <button
              type='button'
              className='social-signup-button google-signup'
            >
              <i class='fa-brands fa-google'></i>
            </button>
            <button
              type='button'
              className='social-signup-button facebook-signup'
            >
              <i class='fa-brands fa-facebook'></i>
            </button>
            <button
              type='button'
              className='social-signup-button github-signup'
            >
              <i class='fa-brands fa-github'></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
