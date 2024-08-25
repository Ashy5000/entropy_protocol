import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Nav from "./Nav/Nav.tsx";
import Hero from "./Hero/Hero.tsx";
import Auth from './WebAuth/Auth.tsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Nav />
      <Hero />
    </>
  )
}

export default App
