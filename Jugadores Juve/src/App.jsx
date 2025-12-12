import Header from './components/Header'
import Navigation from './components/Navigation'
import Players from './components/Players'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className="main-content">
        <Players />
      </main>
      <Footer />
    </div>
  )
}

export default App
