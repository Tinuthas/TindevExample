import React, {useEffect, useState} from 'react';
import io from 'socket.io-client'
import {Link} from 'react-router-dom'
import './Main.css'
import logo from '../assets/threerocks.svg'
import api from '../services/api'

import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'

export default function Main({match}) {

    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {headers: {user: match.params.id}})
            //console.log(response.data)
            setUsers(response.data)
        }

        loadUsers()
    }, [match.params.id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {user: match.params.id}
        })
        
        socket.on('match', dev => {
            setMatchDev(dev)
        })

    }, [match.params.id])

    async function handleLike(id) {
        //console.log(`Like: ${id}`)
        await api.post(`/devs/${id}/likes`, null, {headers: {user: match.params.id}})
        setUsers(users.filter(user => user._id !== id))
    }

    async function handleDislike(id) {
        //console.log(`Dislike: ${id}`)
        await api.post(`/devs/${id}/dislikes`, null, {headers: {user: match.params.id}})

        setUsers(users.filter(user => user._id !== id))
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="threerocks" />
            </Link>
            
            { users.length > 0 ? 
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name}/>
                            <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                            </footer>
                            <div className="buttons">
                                <button submit = "button" onClick = {() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike"/>
                                </button>
                                <button submit="button" onClick = {() => handleLike(user._id)}>
                                    <img src={like} alt="Like"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            : <div className="empty">{"Acabou :("}</div>}
           
           {matchDev && (
               <div className="match-container" onClick={()=>setMatchDev(null)}>
                   <img src={itsamatch} alt="It's a match" />
                   <img className="avatar" src={matchDev.avatar} alt="" />
                   <strong>{matchDev.name}</strong>
                   <p>{matchDev.bio}</p>
                   <button type="button" onClick={()=>setMatchDev(null)}>FECHAR</button>
               </div>
           )}
        </div>
    )
}