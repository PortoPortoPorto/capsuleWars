import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { BattleContext } from '../context/BattleContext.jsx';

const UiBtm = () => {

	// Imported battle context 
	const { battle } = useContext(BattleContext);
		
	return (
		<>
			<div className='h-[124px] w-[100%] rounded-md bg-stone-600 flex items-center justify-center'>
				Combat Preview
			</div> 
		</>
	)
}

export default UiBtm