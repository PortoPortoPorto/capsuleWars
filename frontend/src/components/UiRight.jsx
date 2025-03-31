import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { BattleContext } from '../context/BattleContext.jsx';

const UiRight = () => {

	// Imported battle context 
	const { battle } = useContext(BattleContext);

		
	return (
		<div className='h-[605px] w-[200px] bg-stone-500 flex flex-col items-center justify-start border-2 border-stone-800 rounded-md'>
			<h1 className='p-3 text-lg'>Hovered Unit:</h1>
			{battle.turnOrder === true && battle.allUnits.length != 0 && battle.hoveredUnit ? 
			  	<div className='CONTAINER flex flex-col items-center justify-center'>
			  	{battle.hoveredUnit[0].Team === 'friendly' ?
			  		(<p className='p-3 text-lg text-red-300 font-semibold'>{battle.hoveredUnit[0].Name}</p>) :
			  		(<p className='p-3 text-lg text-green-500 font-semibold'>{battle.hoveredUnit[0].Name}</p>) 	

			  	 }
					
					<img className='p-1 h-[60px] w-[60px]' src={battle.hoveredUnit[0].Img}/>
					<div className='text-lg font-semibold p-1'>
						Hp:<span className='text-green-500 px-2'>{battle.hoveredUnit[0].HPCurrent}</span> 
						/ <span className='text-green-500 px-2'>{battle.hoveredUnit[0].HPMax}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Attack:<span className='px-2'>{battle.hoveredUnit[0].Att}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Defence:<span className='px-2'>{battle.hoveredUnit[0].Def}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Move:<span className='px-2'>{battle.hoveredUnit[0].Mov}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Speed:<span className='px-2'>{battle.hoveredUnit[0].Sp}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						Evasion:<span className='px-2'>{battle.hoveredUnit[0].Ev}</span>
					</div>
					<div className='text-lg font-semibold p-1'>
						BP:<span className='px-2 text-orange-500'>{battle.hoveredUnit[0].BP}</span>
					</div>

				</div> 
			:   
				<p>Loading...</p>}
		</div>
	)
}

export default UiRight