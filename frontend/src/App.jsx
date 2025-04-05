import { useState } from 'react'
import React from 'react';
import GridMap from './components/GridMap.jsx';
import UiTop from './components/UiTop.jsx';
import UiBtm from './components/UiBtm.jsx';
import UiLeft from './components/UiLeft.jsx';
import UiRight from './components/UiRight.jsx';
import { BattleProvider } from './context/BattleContext.jsx';


function App() {


  return (
    <>
      <BattleProvider>
        <div className='header h-[80px] w-[100%] flex items-center justify-center font-bold bg-blue-300 flex'>
              CAPSULE WARS PROTOTYPE
        </div>
        <section className='GameContainer h-[800px] w-[100%] bg-black flex items-center justify-center'>
          <div className='Screen h-[795px] w-[1400px] border-2 bg-stone-600 rounded-sm flex-col items-start justify-center'>
              <UiTop/>
              <div className='flex flex-row h-[605px]'>
                <UiLeft/>
                <GridMap/> 
                <UiRight/>
              </div>
              <UiBtm/>
          </div>
        </section>
        <div className='footer h-[70px] w-[100%] flex items-center justify-center font-bold bg-blue-300 flex'>
        </div>
      </BattleProvider>
    </>
  )
}

export default App
