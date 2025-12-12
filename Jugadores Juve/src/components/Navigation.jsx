import './Header.css'

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#inicio" className="nav-link active">Inicio</a>
          </li>
          <li className="nav-item">
            <a href="#jugadores" className="nav-link">Jugadores</a>
          </li>
          <li className="nav-item">
            <a href="#estadisticas" className="nav-link">Estadísticas</a>
          </li>
          <li className="nav-item">
            <a href="#contacto" className="nav-link">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
