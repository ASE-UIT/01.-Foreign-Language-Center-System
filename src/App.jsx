import './App.css'
import Navbar from './components/Navbar'
import Introduction from './components/Introduction'

function App () {
  return (
    <div className='App'>
      <Navbar role='guest' />
      <div className='body-container'>
        <Introduction />
      </div>
    </div>
  )
}

export default App
