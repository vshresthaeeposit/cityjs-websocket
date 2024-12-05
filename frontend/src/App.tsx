import { useEffect, useState } from 'react';

import CharacterItem from './Character';

import './App.css'
import { Character } from './types';
const url = 'ws://localhost:8787';

const characters: Character[] = [
  {
    id: 1,
    name: 'Monkey D. Luffy',
    vote: 0,
  },
  {
    id: 2,
    name: 'Roronoa Zoro',
    vote: 0,
  },
  {
    id: 3,
    name: 'Nico Robin',
    vote: 0,
  },
  {
    id: 4,
    name: 'Nami',
    vote: 0,
  },
  {
    id: 5,
    name: 'Boa Hancock',
    vote: 0,
  },
  {
    id: 6,
    name: 'Jimbei',
    vote: 0,
  },
]

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState('Disconnected');
  const [characterIds, setCharacterIds] = useState<number[]>([]);
  const [charactersById, setCharactersById] = useState<{ [id: number]: Character }>({});
  const [lastVote, setLastVote] = useState<{ id: number, count: number } | null>(null);
  const [lastData, setLastData] = useState<{ initial: number, votes: { [id: string]: number } }>({
    initial: 0, votes: {},
  })

  useEffect(() => {
    if(!ws) {
      const socket = new WebSocket(`${url}/parties/voting/default`)
      setWs(socket);

      socket.onopen = () => {
        setConnected('Connected');
        socket.send(JSON.stringify({
          type: 'data',
        }))
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'result') {
          setLastVote(data);
        } else if(data.type === 'data') {
          setLastData(data);
        }
      }
    }
  }, [])

  useEffect(() => {
    if(lastVote?.id) {
      updateVote(lastVote);
    }
  }, [lastVote?.count])

  useEffect(() => {
    if(lastData?.initial) {
      updateVotes(lastData.votes)
    }
  }, [lastData?.initial])

  useEffect(() => {
    const ids: number[] = [];
    const byIds: { [id: number]: Character } = {};

    characters.forEach((character) => {
      ids.push(character.id);
      byIds[character.id] = character;
    })

    setCharacterIds(ids);
    setCharactersById(byIds);
  }, [])

  const updateVotes = (votes: { [id: number]: number }) => {
    const byIds = {
      ...charactersById,
    }

    for(let key in byIds) {
      byIds[key] = {
        ...byIds[key],
        vote: votes[key] ?? 0,
      }
    }

    setCharactersById(byIds);
  }


  const onVote = (id: number) => {
    if(ws) {
      const data = JSON.stringify({
        type: 'vote',
        id,
      })

      ws.send(data);
    }
  }

  const updateVote = (data: any) => {
    const character = charactersById[data.id];
    console.log(data.count, character.vote, 'data')

    setCharactersById({
      ...charactersById,
      [data.id]: {
        ...character,
        vote: data.count,
      }
    })
  }

  return (
    <div className="flex justify-center">
      <div>
        <h1 className="font-bold text-4xl mt-4 mb-16">
          Which is your favorite One Piece Character
        </h1>

        <div>
          {characterIds.map((id) => (
            <CharacterItem key={id} character={charactersById[id]} onVote={onVote} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
