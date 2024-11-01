import React from 'react'
import '../styles/Introduction.css'
import human from '../images/human.png'

const Introduction = () => {
  return (
    <div className='introduction-container'>
      <div className='introduction-label'>
        <div className='label-text'>
          <h1>
            TRẢI NGHIỆM <br />
            <span className='text-highlight'>
              NỀN TẢNG HỌC TIẾNG ANH <br />
              TỐI ƯU CHO NGƯỜI ĐI LÀM
            </span>
          </h1>
          <div className='key-features'>
            <div className='feature'>
              <i className='fa-regular fa-square-check'></i>
              &ensp; Lộ trình <strong>cô đọng</strong>
            </div>
            <div className='feature'>
              <i className='fa-regular fa-square-check'></i>
              &ensp; Chấm bài <strong>chuẩn xác</strong>
            </div>
          </div>
          <button className='btn-join'>
            HỌC THỬ MIỄN PHÍ &nbsp;
            <i className='fa-solid fa-angles-right'></i>
          </button>
        </div>
      </div>
      <div className='label-image'>
        <img src={human} alt='' />
      </div>
    </div>
  )
}

export default Introduction
