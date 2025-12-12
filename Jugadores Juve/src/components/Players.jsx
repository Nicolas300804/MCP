import React from 'react'
import jugadores from "../../top_10_jugadores_juventus.json"
import { useState } from 'react'
import './Players.css'

const Players = () => {
    const [jugador, setJugador] = useState(jugadores.top_10_mejores_jugadores)

  return (
    <div className="players-container">
        {jugador.map((player, index) => {
            return(
                <article className="player-card" key={index}>
                    <img className="player-img" src={player.imagen_url} alt={player.nombre} />
                    <div className="player-info">
                        <h2 className="player-name">{player.nombre}</h2>
                        <div className="player-stats">
                            <span className="stat">Posición: {player.posicion_campo}</span>
                            <span className="stat">PJ: {player.partidos}</span>
                            <span className="stat">Goles: {player.goles}</span>
                        </div>

                        <p className="achievements">Logros: {player.logros}</p>
                        <p className="achievements">Periodo: {player.periodo || player.periodo_club || 'N/A'}</p>
                    </div>
                </article>
            )
        })}
    </div>

  )
}

export default Players