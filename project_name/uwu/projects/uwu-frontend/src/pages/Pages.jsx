import { Routes, Route } from 'react-router'
import { HomePage } from './HomePage'

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
    </Routes>
  )
}

export default Pages
