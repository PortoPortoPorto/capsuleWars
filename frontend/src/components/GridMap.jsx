// note on context stability with useEffect 
// Reference Stability: battle (from useContext) is a new object on every render, 
// so battle.friendlyUnits might trigger useEffect more often unless the Provider memoizes the value.
// For now, it’s fine, but if you notice excessive runs, you could wrap BattleProvider’s value in useMemo.


import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { BattleContext } from '../context/BattleContext.jsx';

const GridMap = () => {
			// Imported battle context 
			const { battle } = useContext(BattleContext);
			// div classes for grid
			const tileClasses = {
  				regular: 'h-[55px] w-[55px] border-1 border-neutral-800 flex items-center justify-center text-black text-xs',
  				friendly: 'h-[55px] w-[55px] border-1 border-neutral-800 flex items-center justify-center bg-black hover:border-2 hover:border-red-700 cursor-pointer',
 				enemy: 'h-[55px] w-[55px] border-1 border-neutral-800 flex items-center justify-center bg-black hover:border-2 hover:border-green-700 cursor-pointer',
  				currentFriendly: 'h-[55px] w-[55px] border-1 border-red-700 flex items-center justify-center hover:border-2 cursor-pointer',
  				currentEnemy: 'h-[55px] w-[55px] border-1 border-green-700 flex items-center justify-center hover:border-2 cursor-pointer',
  				movement: 'h-[55px] w-[55px] border-1 border-neutral-800 flex items-center justify-center bg-[#171a18] text-[#171a18] hover:border-neutral-600 text-xs',
				};
			


	// Set Grid State 
	const [gridState, setGridState] = useState(false);
	// Keep track of grid loaded status 
	const [gridLoaded, setGridLoaded] = useState(false);
	// Keep track of block with unit
	const [friendlyUnitPositions, setFriendlyUnitPositions] = useState([
		{ x: 1, y: 1 },  // Was 18: 
  		{ x: 0, y: 4 },  // Was 65
  		{ x: 1, y: 6 },  // Was 98
  		{ x: 0, y: 8 },  // Was 129
 		{ x: 1, y: 9 },  // Was 146
	]);
	const [enemyUnitPositions, setEnemyUnitPositions] = useState([
		{ x: 15, y: 1 }, // Was 32
  		{ x: 14, y: 2 }, // Was 47
  		{ x: 14, y: 5 }, // Was 95
  		{ x: 14, y: 8 }, // Was 143
  		{ x: 13, y: 10 }, // Was 160
	]);
	// Set all unit positions after friendly and enemy have been set, to track untraversable movement tiles
	const [allUnitPositions, setAllUnitPositions] = useState([])

	// Toggle if current unit has been highlighted by UI
	const [currentUnit, setCurrentUnit] = useState(false);
	//Track current movement range. Reset at each unit end of turn
	const [movementRange, setMovementRange ] = useState([]); 
	//Track if current changes are rendered to avoid multiple re-renders (for unit positions)/ Toggle to false when you need a re-render via the useEffect
	const [changesRendered, setChangesRendered] = useState(false);
	//Track if current unit has moved this turn
	const [hasMoved, setHasMoved] = useState(false);


	// 2) load friendly and enemy unit objects. Call with array of id numbers
	const loadUnits = async (unitIds) => {
		let friendlyArray = [];
		let enemyArray = [];
		try {
			const res= await fetch(`/data/Units.json`);
			const unitsData = await res.json();

			// Create arrays of friendly and enemy units, using unitIds
			for (let i = 0; i <= 9; i ++) {
				const unit = unitsData[`${unitIds[i]}`];
				if(unit) { // only push valid units
					if(i < 5) friendlyArray.push(unit);
					else enemyArray.push(unit);
				}
			}
			//Map through friendly unit array and assign Position and Team
			const friendlyArrayWithPos = friendlyArray.map((unit, i) => ({
				...unit,
				Pos: friendlyUnitPositions[i],
				Team: 'friendly',
				Index: i,
			}));
			// Do the same for enemyArray
			const enemyArrayWithPos = enemyArray.map((unit, i) => ({
				...unit,
				Pos: enemyUnitPositions[i],
				Team: 'enemy',
				Index: i,
			}));


			battle.setFriendlyUnits(friendlyArrayWithPos);
			battle.setEnemyUnits(enemyArrayWithPos);
		} catch (error) {
			console.error('Error loading units:', error);
		}
	}


	//helper function to update grid (called in renderUnits/renderMovementTiles/renderCurrentUnit)
	const updateGrid = (callback) => {
		const newGrid = [...gridState]; // Copies the current gridState
		callback(newGrid);				// Passes the copy to your function
		setGridState(newGrid);			// Updates state with the modified copy
	}

	
	// 3) Render units in gridState with appropriate positions from friendlyUnits and enemyUnits state
	const renderUnits = (unitArray) => {
		updateGrid((grid) => {
			// loop through unitArray and set unit in div at corresponding index (within gridState)
			for(let i = 0; i < unitArray.length; i ++) {
				const unit = unitArray[i];
				if(!unit || !unit.Pos || !unit.Img) continue; // skip invalid units 
				let gridX = unit.Pos.x;
				let gridY = unit.Pos.y;
				let img = unit.Img;
			// Find the index of the tile matching the unit's x and y values
				const tileIndex = grid.findIndex(tile => tile.x === gridX && tile.y === gridY);
			//If tile exists, update with unit's image, keeping existing className
				if(tileIndex !== -1) { // ensure tile exists
					grid[tileIndex] = {
						...grid[tileIndex],
						children: <img src={unit.Img} alt={unit.Name} />
					};
				} else {
					console.warn(`No tile found for unit at x:${gridX}, y:${gridY}`);
				}
			}
		});
	}



	const randomiseUnits = () => {
		let arrayToPush = [];
		for (let i = 1; i <= 10; i ++) {
			const randomIndex = Math.floor(Math.random() * 20) + 1;
			arrayToPush.push(randomIndex)
		}
		return arrayToPush;
	}



	// 1) Set up game map with friendly and enemy units 
	const renderGrid = async() => {
			const gridArray = [];		
			// load unit objects and store them in useState (if grid hasn't yet been intialised)
			if(gridLoaded === false)await loadUnits(randomiseUnits());
			for (let i = 1; i <= 176; i ++ ) {
				const x = (i -1) % 16;
				const y = Math.floor((i -1) / 16);
				const pos = { x, y };
				let className = tileClasses.regular;
				if(friendlyUnitPositions.some(u => u.x === pos.x && u.y === pos.y)) className = tileClasses.friendly;	
				else if (enemyUnitPositions.some(u => u.x === pos.x && u.y === pos.y)) className = tileClasses.enemy;	
				gridArray.push({x, y, className });
		}
		if(gridState === false) setGridState(gridArray);
		setGridLoaded(true);
	}


	//function to reset grid tiles, between unit turns 
	const resetGridTiles = () => {
		let updatedGrid = [...gridState];
		updatedGrid.forEach((div, index) => {
			div.className = tileClasses.regular;
		})

	}


	//function to get movement tiles for current unit, set in state, and render grid accordingly 
	const getMovementTiles = (unit) => {
		console.log('unit', unit);
		const movementTiles = [];
		const {x, y} = unit.Pos;
		const mov = unit.Mov;
		//loop through all x and y positions within mov range 
		for(let dx = -mov; dx <= mov; dx++) {
			for(let dy = -mov; dy <= mov; dy ++) {
				const newX = x + dx;
				const newY = y + dy;
				if(newX >= 0 && newX < 16 && newY >= 0 && newY < 11) {// grid bounds 
						if(Math.abs(dx) + Math.abs(dy) <= mov) {//Manhattan distance
							movementTiles.push({ x: newX, y: newY });
						}
					}
				}
		}
		// filter movement tiles to remove any tile which is occupied by a unit
		const tilesMinusUnits = movementTiles.filter((tile) => !allUnitPositions.some((unit) => unit.x === tile.x && unit.y === tile.y));
		setMovementRange(tilesMinusUnits);
		return tilesMinusUnits;
	};


	//Render movement tiles on grid for current unit
	const renderMovementTiles = (movementTiles) => {
		updateGrid((grid) => {
			for (let i = 0; i <= movementTiles.length -1; i ++ ) {
				const tileToRender = grid.findIndex(tile => tile.x === movementTiles[i].x && tile.y === movementTiles[i].y);
				grid[tileToRender].className = tileClasses.movement;
			}
		});
	};

	//unit here should be the same as currentUnit in state, didn't use it however, as to avoid missing the state update before calling
	const renderCurrentUnit = (unit) => {
		updateGrid((grid) => {
			const tileIndex = grid.findIndex(t => t.x === unit.Pos.x && t.y === unit.Pos.y);
			grid[tileIndex] = {
				...grid[tileIndex],
				className: unit.Team === 'friendly' ? tileClasses.currentFriendly : tileClasses.currentEnemy
			};
		});
	};

	// find unit at tile location, and set as current hovered unit in global context
	const assignHoveredUnit = (tile) => {
		const unitToRender = battle.allUnits.filter((unit) => unit.Pos.x === tile.x && unit.Pos.y === tile.y);
		battle.setHoveredUnit(unitToRender[0]);
	} 


    // change currentUnit Pos to selected movementTile. change class of prev tile to regclass. Update state and battleState (context)
	const moveCurrentUnit = async (currentUnit, tile) => {
		if(!currentUnit) return;
		// change unit position in local state 
	}

 
	useEffect(() => {
		//if(gridLoaded || changesRendered) return;		
		const setupAll = async () => {
			await renderGrid(); // Set gridState and load units
			if(battle.friendlyUnits.length > 0 && battle.enemyUnits.length > 0 && changesRendered === false) {
				const completeUnits = [...battle.friendlyUnits, ...battle.enemyUnits];
				renderUnits(completeUnits); // updates grid with units
				setAllUnitPositions(completeUnits.map((unit) => unit.Pos));
				battle.setAllUnits(completeUnits);
				setChangesRendered(true);
			};
		};
		setupAll();
	}, [gridLoaded, changesRendered]);


   // When turn ends and order of battle.allUnits changes, re-render grid styling and current unit
	useEffect(() => {
	 if(currentUnit === false) return;
	 if(currentUnit.Index !== battle.allUnits[0].Index) {
	 	const goToNextTurn = async () => {
	 		await resetGridTiles();
	 		await setCurrentUnit(battle.allUnits[0]);
	 		renderCurrentUnit(battle.allUnits[0]);
	 	}
	 	goToNextTurn();
	 }			
	}, [battle.allUnits])


	// Highlight current unit if gridState has rendered and turnOrder has been set in global context
	useEffect(() => {
		if(battle.turnOrder === false) return;
		if(gridLoaded === true && battle.turnOrder === true); {
				setCurrentUnit(battle.allUnits[0]);
				renderCurrentUnit(battle.allUnits[0]);
		}
	}, [battle.turnOrder])


	// Render current unit and movement tiles surrounding it when currentUnit state changes
	useEffect(() => {
		if(currentUnit === false) return;
		if(currentUnit === battle.allUnits[0]) {
		// find space in either direction it can move
			const tilesToRender = getMovementTiles(currentUnit);
			renderMovementTiles(tilesToRender);
		}
	}, [currentUnit]);



	return (
		<>			
            <div className='h-[610px] w-[896px] bg-black border-2 border-stone-800 rounded-md'>
            	<div className='grid grid-cols-16 grid-rows-11'>
     			{gridState &&
     				gridState.map((tile, index) => (
     					tile.children ? 
     					(<div key ={`x:${tile.x}-y:${tile.y}`} className={tile.className} onMouseOver={() => assignHoveredUnit(tile)}>
     						<img src={tile.children.props.src} alt={tile.children.props.alt}/></div>) 
     					:
     					 (<div key ={`x:${tile.x}-y:${tile.y}`} 
     					 	   className={tile.className} 
     					 	   style={tile.className === tileClasses.movement ? { cursor: "url(/assets/BootCursor.png) 4 4, pointer" } : {}}
     					 	   onClick={tile.className === tileClasses.movement ? () => moveCurrentUnit(currentUnit, tile) : null}>
     						{`x:${tile.x} y:${tile.y}`}</div>)
     					))} 
            	</div>
            </div> 
        </>
		
	)
}

export default GridMap