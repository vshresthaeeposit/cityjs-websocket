import { Character } from "./types";

type Props = {
  character: Character;
  onVote: (id: number) => void;
}

const CharacterItem = (props: Props) => {
  const character = props.character;

  const onVote = (id: number) => {
    return () => {
      props.onVote(id);
    }
  }

  return (
    <div className="p-4 my-4 border rounded-md w-[700px] flex flex-row justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          {character.name}
        </h1>
      </div>

      <div>
        <span className="text-2xl p-4 font-bold cursor-pointer" onClick={onVote(character.id)}>
          {character.vote}
        </span>
      </div>
    </div>
  )
}

export default CharacterItem;
