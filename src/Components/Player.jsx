import { useState } from "react";
export default function Player({initialName, symbol}){
    const [playerName, setPlayername] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);
    function handleEditClick(){
        setIsEditing((editing) => !editing);
    }  

    function handleChange(event){
        console.log(event);
        setPlayername(event.target.value);
    }

let editPlayerName = <span className="player-name">{playerName}</span>;
//let btnCaption = "Edit";
if(isEditing){
    editPlayerName = <input type="text" required defaultValue={playerName} onChange={handleChange}/>;
    //btnCaption = "Save";
}
return(
        <li>
            <span className="player">
              {editPlayerName}
              <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
        </li>
    );
}