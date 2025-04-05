import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { BattleContext } from '../context/BattleContext.jsx';

const UiLeft = () => {

	// Imported battle context 
	const { battle } = useContext(BattleContext);

	const unitOptions = 'h-[180px] w-[100%] flex flex-col items-center justify-start'

	// Sort battle.AllUnits to move unit at the start to the end
	const endTurn = () => {
		let orderArray = [...battle.allUnits];
		const firstUnit = orderArray.shift(); //removes and returns the first item;
		orderArray.push(firstUnit); //push it to the end of the array
		battle.setAllUnits(orderArray);
	}


	return (
		<div className='h-[605px] w-[250px] bg-stone-500 flex flex-col items-center justify-start border-2 border-stone-800 rounded-md'>
			<h1 className='p-3 text-lg'>Current Unit:</h1>
			{battle.turnOrder === true && battle.allUnits.length != 0? 
			  	<div className='CONTAINER flex flex-col items-center justify-center w-[90%]'>
			  	{battle.allUnits[0].Team === 'friendly' ?
			  		(<p className='p-2 text-lg text-red-300 font-semibold'>{battle.allUnits[0].Name}</p>) :
			  		(<p className='p-2 text-lg text-green-500 font-semibold'>{battle.allUnits[0].Name}</p>) 	

			  	 }
					
					<img className='p-1 h-[60px] w-[60px]' src={battle.allUnits[0].Img}/>
					<div className='text-lg font-semibold p-1'>
						Hp:<span className='text-green-500 px-2'>{battle.allUnits[0].HPCurrent}</span> 
						/ <span className='text-green-500 px-2'>{battle.allUnits[0].HPMax}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Attack:<span className='px-2'>{battle.allUnits[0].Att}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Defence:<span className='px-2'>{battle.allUnits[0].Def}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Move:<span className='px-2'>{battle.allUnits[0].Mov}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Speed:<span className='px-2'>{battle.allUnits[0].Sp}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Evasion:<span className='px-2'>{battle.allUnits[0].Ev}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						BP:<span className='px-2 text-orange-500'>{battle.allUnits[0].BP}</span>
					</div>
					<div className={unitOptions}>
						<button className='h-[42px] w-[140px] bg-stone-400 mt-4 border border-black cursor-pointer text-md font-semibold rounded-sm hover:bg-stone-300'>Abilities</button>
						<button className='h-[42px] w-[140px] bg-stone-400 mt-2 border border-black cursor-pointer text-md font-semibold rounded-sm hover:bg-stone-300'
								onClick={() => endTurn()}>
								End Turn
						</button>
					</div>

				</div> 
			:   
				<p>Loading...</p>}
		</div>
	)
}

export default UiLeft