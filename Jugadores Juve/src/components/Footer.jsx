import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Sobre Este Sitio</h4>
            <p>Página dedicada a mostrar los mejores jugadores de la Juventus Football Club.</p>
          </div>

          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#jugadores">Jugadores</a></li>
              <li><a href="#estadisticas">Estadísticas</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Síguenos</h4>
            <ul className="social-links">
              <li><a href="https://twitter.com/juventusfc" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com/juventus" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com/juventus" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Juventus Top Players. Todos los derechos reservados.</p>
          <p>Este sitio es un proyecto no oficial de fans.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
