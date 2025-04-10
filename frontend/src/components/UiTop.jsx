import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { BattleContext } from '../context/BattleContext.jsx';

const UiTop = () => {

	// Imported battle context 
	const { battle } = useContext(BattleContext);
	//const [ turnOrder, setTurnOrder ] = useState('');


	// Function to set turn order, called on render / on demand
	const getTurnOrder = () => {
		let orderArray = [...battle.allUnits];
		orderArray.sort((a, b) => b.Sp - a.Sp);
		return orderArray;
	}


	// if all units have been determined, set turn order for allUnits array in global context at start of battle
	useEffect(() => {
		if(battle.turnOrder === false && battle.allUnits.length != 0) {
			battle.setAllUnits(getTurnOrder());
			battle.setTurnOrder(true);
		}
	}, [battle])

	useEffect(() => {
		if(battle.turnOrder === true) {
			//console.log('turn order,', battle.turnOrder);
		}
	})
		
	return (
		<>
			<div className='h-[62px] w-[100%] rounded-md bg-stone-600 flex items-center justify-center rounded-md'> 
				<h2 className='mr-5 font-semibold'>Turn Order</h2>
				{ battle.turnOrder ? 
					(battle.allUnits.map((unit) => 
						<div className={`h-[44px] w-[44px] m-1 border border-4 ${unit.Team === 'friendly' ? 'border-red-700' : 'border-green-700'} flex items-center justify-center rounded-md`}><img src={unit.Img}></img></div>
					))
				 : ''
				}
			</div> 
		</>
	)
}

export default UiTop