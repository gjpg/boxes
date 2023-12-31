// Counter.tsx
import React, {useEffect, useState} from 'react';
import Counter from "./Counter.tsx";

interface PlayerData {
    name: string;
    color: string;
}

interface PlayerProps {
    count: number;
    setCount: (count: number) => void
}

const Players: React.FC<PlayerProps> = ({ setCount: setPlayerCount, count: playerCount}) => {
    const [playerData, setPlayerData] = useState<PlayerData[]>([]);
    const [errorIndexes, setErrorIndexes] = useState<number[]>([]);


    useEffect(() => {
        const nonUniqueIndexes: number[] = [];
        playerData.forEach((player, i) => {
            const otherPlayers = playerData.filter((p, j) => i !== j);
            if (otherPlayers.some((p) => p.name === player.name)) {
                nonUniqueIndexes.push(i);
            }
        });

        setErrorIndexes(nonUniqueIndexes);
    }, [playerData]);

    const generateRandomColor = (): string => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleIncrement = (playerCount: number) => {
        setPlayerCount(playerCount);

        // If count is 10 or more, generate random unique initials
        if (playerCount >= 10) {
            let newInitials: string;
            do {
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                newInitials = `${letters[Math.floor(Math.random() * 36)]}${letters[Math.floor(Math.random() * 36)]}`;
            } while (!isNameUnique(newInitials, playerData.length));
            setPlayerData([...playerData, { name: newInitials, color: generateRandomColor() }]);
        } else {
            // Otherwise, continue generating P1, P2, ...
            const newPlayerName = `P${playerCount}`;
            setPlayerData([...playerData, { name: newPlayerName, color: generateRandomColor() }]);
        }
    };

    const handleDecrement = (playerCount: number) => {
            setPlayerCount(playerCount);
            setPlayerData(playerData.slice(0, -1));
            setErrorIndexes([]); // Reset error state when removing a player
    };

    const handleInputChange = (index: number, value: string) => {
        const truncatedValue = value.slice(0, 2);
        const updatedPlayerData = [...playerData];
        updatedPlayerData[index].name = truncatedValue;
        setPlayerData(updatedPlayerData);

        // Check uniqueness against all players when initials are changed
        const nonUniqueIndexes: number[] = [];
        updatedPlayerData.forEach((player, i) => {
            if (i !== index && player.name === truncatedValue) {
                nonUniqueIndexes.push(i);
            }
        });

        setErrorIndexes(nonUniqueIndexes);
    };

// ...


    const handleColorChange = (index: number, color: string) => {
        const updatedPlayerData = [...playerData];
        updatedPlayerData[index].color = color;
        setPlayerData(updatedPlayerData);
    };

    const handleRemovePlayer = (index: number) => {
        const updatedPlayerData = [...playerData.slice(0, index), ...playerData.slice(index + 1)];
        setPlayerData(updatedPlayerData);
        setPlayerCount(playerCount - 1);
        setErrorIndexes([]); // Reset error state when removing a player
    };

    const isNameUnique = (name: string, currentIndex: number): boolean => {
        return playerData.every((player, index) => index === currentIndex || player.name !== name);
    };

    const handleBlur = (index: number) => {
        const currentName = playerData[index].name;
        if (!isNameUnique(currentName, index)) {
            setErrorIndexes((prevIndexes) => [...prevIndexes, index]);
        }
    };

    const playerCountChanges = (numPlayers: number, why: 'increment' | 'decrement') => {
        // setPlayerCount(numPlayers);
        if ( why === 'increment' ) {
            handleIncrement(numPlayers);
        } else {
            handleDecrement(numPlayers);
        }
    }

    return (
        <div>

            <Counter label={'Players'} count={playerCount} setCount={playerCountChanges}/>


            {playerData.map((data, index) => (
                <div className="playerList" key={index} style={{ marginBottom: '8px' }}>
                    <input
                        type="text"
                        value={data.name || ''}
                        maxLength={2}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onBlur={() => handleBlur(index)}
                        style={{
                            border: errorIndexes.includes(index) ? '1px solid red' : '1px solid black',
                        }}
                        className="initialInput"
                    />
                    <input
                        type="color"
                        value={data.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="colourInput"
                    />
                    <button onClick={() => handleRemovePlayer(index)}>✕</button>
                    {errorIndexes.includes(index) && (
                        <span style={{ color: 'red', marginLeft: '8px' }}>Player initials must be unique</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Players;