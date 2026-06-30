import React, { useState } from "react";

type Player = { id: string; name: string };

function PlayerRow({ player }: { player: Player }) {
  const [selected, setSelected] = useState(false);
  return (
    <li onClick={() => setSelected(value => !value)}>
      {player.name} {selected ? "(selecionado)" : ""}
    </li>
  );
}

export function Ranking() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "p1", name: "Ana" },
    { id: "p2", name: "Bia" },
  ]);

  const reverse = () => setPlayers(current => [...current].reverse());

  return (
    <div>
      <button onClick={reverse}>Inverter</button>
      <ul>{players.map((player, index) => <PlayerRow key={index} player={player} />)}</ul>
    </div>
  );
}
