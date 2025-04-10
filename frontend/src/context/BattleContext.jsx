import { createContext, useState } from 'react';

//Initial State 
const initialState = {
	friendlyUnits: [],
	enemyUnits: [],
	allUnits: [],
	turnOrder: false,
	endTurn: false,
}

//Create Context
export const BattleContext = createContext();


//Provider Component
export const BattleProvider = ({ children }) => {
	//Setters (To be called from wrapped components)
	const [friendlyUnits, setFriendlyUnits] = useState(initialState.friendlyUnits);
	const [enemyUnits, setEnemyUnits] = useState(initialState.enemyUnits);
	const [allUnits, setAllUnits] = useState(initialState.allUnits);
	const [turnOrder, setTurnOrder] = useState(initialState.turnOrder);
	const [hoveredUnit, setHoveredUnit] = useState();
	const [endTurn, setEndTurn] = useState(initialState.endTurn);

	return (
		<BattleContext.Provider value={{ battle: 
										{
										 friendlyUnits, 
										 setFriendlyUnits, 
										 enemyUnits, 
										 setEnemyUnits, 
										 allUnits, 
										 setAllUnits,
										 turnOrder, 
										 setTurnOrder, 
										 hoveredUnit, 
										 setHoveredUnit, 
										 endTurn, 
										 setEndTurn,} 
										}}>
			{children}
		</BattleContext.Provider>
		);
};




