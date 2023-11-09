import './App.css'
import Maincontent from './components/maincontent'
import { Container } from '@mui/material'
function App() {

  return (
    <>
      <div style={{display: "flex", justifyContent: "center", width: "100vw"}}>
      <Container maxWidth="md">
      <Maincontent />
      </Container>
      
      </div>
      
    </>
  )
}

export default App
