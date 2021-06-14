const AI_BOARD='aiBoard'
const PLAYER_BOARD='playerBoard'
const SELECTED_PLAYER_CELL='selectedPlayerCell'
const DESTROYED_PLAYER_CELL='destroyedPlayerCell'
const SHOOTED_FIELD_CELL='shootedFieldCell'
const FIELD='field'
const MAP_DIMENSIONS=12

const FIELD_STATE = {
    SHOOTED_FIELD:-2,
    DESTROYED_SHIP:-1,
    EMPTY: 0,
    SHIP: 1,
 };

const aiBoard=document.getElementById(AI_BOARD)
const playerBoard=document.getElementById(PLAYER_BOARD)

const ships=5;

let aiArr=[]
let playerArr=[]

let userAddedShips=0
let aiAddedShips=0
let vertical=false;

let aiShootState={
    checkTop:false,
    checkRight:false,
    checkBottom:false,
    checkLeft:false,
    firstXPositionChecked:-1,
    firstYPositionChecked:-1,
    lastXPositionChecked:-1,
    lastYPositionChecked:-1,
}

const checkMapBeforeAddShip=(map,isVertical,addedShips,i, j)=>{
    if(isVertical){    
        let jPlusUpperOne= j+1<MAP_DIMENSIONS ? j+1 : j
        let jPlusLowerOne= j-1>=0 ? j-1 : j
        let indexIUpperHelper=i-1>=0 ? i-1 : i 
        let indexILowerHelper=(i+ships-addedShips)<MAP_DIMENSIONS ? i+ships-addedShips : MAP_DIMENSIONS-1
        if(!((map[indexIUpperHelper][jPlusUpperOne]===FIELD_STATE.SHIP)||(map[indexIUpperHelper][jPlusLowerOne]===FIELD_STATE.SHIP)||
            (map[indexILowerHelper][jPlusUpperOne]===FIELD_STATE.SHIP)||(map[indexILowerHelper][jPlusLowerOne]===FIELD_STATE.SHIP)||
            (map[indexIUpperHelper][j]===FIELD_STATE.SHIP)||(map[indexILowerHelper][j]===FIELD_STATE.SHIP) )){
            for(let index=0;index<ships-addedShips;++index){    
                let indexHelper=i+index-1>=0 ? i+index-1 : i+index
                let indexJUpperHelper=j-1>=0 ? j-1 : j 
                let indexJLowerHelper=j+1<MAP_DIMENSIONS ? j+1 : j 
                    if((map[indexHelper+1<MAP_DIMENSIONS?indexHelper+1:indexHelper][indexJUpperHelper]===FIELD_STATE.SHIP)||
                    (map[indexHelper +1<MAP_DIMENSIONS?indexHelper+1:indexHelper][indexJLowerHelper]===FIELD_STATE.SHIP)||
                        (map[indexHelper][j]!==FIELD_STATE.EMPTY) || (i+index>=MAP_DIMENSIONS)){
                        return false
                    }
            }
         }else{
             return false
         }
    }
    if(!isVertical){ 
        let indexJLowerHelper= (j+ships-addedShips)<MAP_DIMENSIONS ? j+ships-addedShips : MAP_DIMENSIONS-1
        let indexJUpperHelper=j-1>=0 ? j-1 : j
        let iPlusUpperOne= i+1<MAP_DIMENSIONS ? i+1 : i
        let iPlusLowerOne= i-1>=0 ? i-1 : i
        let jMinusStartUpperOne= j-1>=0 ? j-1 : j
        let jPlusStartUpperOne = (j+ships-addedShips)<MAP_DIMENSIONS?j+ships-addedShips:MAP_DIMENSIONS-1

        if(!((map[iPlusUpperOne][jMinusStartUpperOne]===FIELD_STATE.SHIP)||(map[iPlusUpperOne][jPlusStartUpperOne]===FIELD_STATE.SHIP)||
        (map[iPlusLowerOne][jMinusStartUpperOne]===FIELD_STATE.SHIP)||(map[iPlusLowerOne][jPlusStartUpperOne]===FIELD_STATE.SHIP)||
        (map[i][indexJLowerHelper]===FIELD_STATE.SHIP)||(map[i][indexJUpperHelper]===FIELD_STATE.SHIP))){
            for(let index=0;index<ships-addedShips;++index){
                let indexIUpperHelper=i-1 >=0 ? i-1 : i 
                let indexILowerHelper=i+1 <MAP_DIMENSIONS ? i+1 : i
                if((map[indexIUpperHelper][j+index]===FIELD_STATE.SHIP)||(map[indexILowerHelper][j+index]===FIELD_STATE.SHIP)||
                    (map[i][j+index]!==FIELD_STATE.EMPTY) || (j+index>MAP_DIMENSIONS)){  
                    return false
                }
            }
        }else{
            return false;
        }
    } 
    return true;
}

const addAiShips=()=>{
    let i=Math.floor(Math.random()*MAP_DIMENSIONS)
    let j=Math.floor(Math.random()*MAP_DIMENSIONS)

    const addShip=checkMapBeforeAddShip(aiArr,!vertical,aiAddedShips,i,j);
    if(addShip){
        vertical=!vertical;
        aiAddedShips++;
        let indexHelper=0;
        for(let index=aiAddedShips;index<=ships;++index){
            if(vertical){
                let stateHelper=i+indexHelper-1>=0?i+indexHelper-1:i+indexHelper
                aiArr[stateHelper][j]=FIELD_STATE.SHIP
            }else{
                aiArr[i][j+indexHelper]=FIELD_STATE.SHIP;
            }
            indexHelper++;
        }
        if(aiAddedShips===ships){
            const fieldItems=document.querySelectorAll(`div[parentboard=${AI_BOARD}]`)
            fieldItems.forEach(e=>e.addEventListener('click',shootThisAi))
            vertical=false
        }
    }
}

const addPlayerShips=(e)=>{
        let i= Number(e.target.getAttribute('i'))
        let j= Number(e.target.getAttribute('j'))

        const addShip=checkMapBeforeAddShip(playerArr,!vertical,userAddedShips,i,j);
        if(addShip){
            vertical=!vertical;
            userAddedShips++;
            e.target.className+= ' ' + SELECTED_PLAYER_CELL
            let indexHelper=0;
            for(let index=userAddedShips;index<=ships;++index){
                if(vertical){
                    playerArr[i+indexHelper][j]=FIELD_STATE.SHIP
                    const fieldItem=document.querySelector(`div[i="${i+indexHelper}"][j="${j}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }else{
                    playerArr[i][j+indexHelper]=FIELD_STATE.SHIP
                    const fieldItem=document.querySelector(`div[i="${i}"][j="${j+indexHelper}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }
                indexHelper++;
            }
            if(userAddedShips===ships){
                const fieldItems=document.querySelectorAll(`div[parentboard=${PLAYER_BOARD}]`)
                fieldItems.forEach(e=>e.removeEventListener('click',addPlayerShips))
                vertical=false
                while(aiAddedShips!==ships){
                    addAiShips()
                }
            }
        } 
}

const endGame=()=>{
    if(!playerArr.some(e=>e.includes(FIELD_STATE.SHIP)) || !aiArr.some(e=>e.includes(FIELD_STATE.SHIP))){
        const endGameField=document.getElementById("endGameH2")
        const playerFieldItems=document.querySelectorAll(`div[parentboard=${AI_BOARD}]`)
        playerFieldItems.forEach(e=>e.removeEventListener('click',shootThisAi))

        if(!playerArr.some(e=>e.includes(FIELD_STATE.SHIP))){
            endGameField.innerText="You lost"
        }
        else if(!aiArr.some(e=>e.includes(FIELD_STATE.SHIP))){
            endGameField.innerText="You won"
        }
    }
}

const shootThisAi=e=>{
    const i= Number(e.target.getAttribute('i'))
    const j= Number(e.target.getAttribute('j'))

    if(aiArr[i][j]===FIELD_STATE.SHIP){
        aiArr[i][j]=FIELD_STATE.DESTROYED_SHIP
        e.target.classList+= ' ' + DESTROYED_PLAYER_CELL;
    }
    else{
        e.target.classList+= ' ' + SHOOTED_FIELD_CELL;
        aiArr[i][j]=FIELD_STATE.SHOOTED_FIELD
    }    
    const fieldItem=document.querySelector(`div[i="${i}"][j="${j}"][parentboard=${AI_BOARD}]`)
    fieldItem.removeEventListener('click',shootThisAi)
    
    endGame()
    while(!shootThisGuy()){}
}

const shootThisGuy=()=>{
    let i=0
    let j=0
    let canMakeMove=true
  
    if(aiShootState.checkTop||aiShootState.checkRight||
        aiShootState.checkBottom||aiShootState.checkLeft){   
            if(aiShootState.checkTop){
                if(!( aiShootState.lastXPositionChecked-1>=0)){
                    canMakeMove=false
                }else{
                    if(playerArr[aiShootState.lastXPositionChecked-1][aiShootState.lastYPositionChecked]<0){
                        canMakeMove=false
                    }{
                        aiShootState.lastXPositionChecked-=1
                        i=aiShootState.lastXPositionChecked
                        j=aiShootState.lastYPositionChecked
                    }
                }
            }else if(aiShootState.checkBottom){
                if(!(aiShootState.lastXPositionChecked+1<MAP_DIMENSIONS)){
                    canMakeMove=false
                }else{
                    if(playerArr[aiShootState.lastXPositionChecked+1][aiShootState.lastYPositionChecked]<0){
                        canMakeMove=false
                    }else{
                        aiShootState.lastXPositionChecked+=1
                        i=aiShootState.lastXPositionChecked
                        j=aiShootState.lastYPositionChecked
                    }
                }
            }else if(aiShootState.checkRight){
                if(!(aiShootState.lastYPositionChecked+1<MAP_DIMENSIONS)){
                    canMakeMove=false
                }else{
                    if(playerArr[aiShootState.lastXPositionChecked][aiShootState.lastYPositionChecked+1]<0){
                        canMakeMove=false
                    }else{
                        aiShootState.lastYPositionChecked+=1
                        i=aiShootState.lastXPositionChecked
                        j=aiShootState.lastYPositionChecked
                    }
                }
            }else if(aiShootState.checkLeft){
                if(!(aiShootState.lastYPositionChecked-1>=0)){
                    canMakeMove=false
                }else{
                    if(playerArr[aiShootState.lastXPositionChecked][aiShootState.lastYPositionChecked-1]<0){
                        canMakeMove=false
                    }else{
                        aiShootState.lastYPositionChecked-=1
                        i=aiShootState.lastXPositionChecked
                        j=aiShootState.lastYPositionChecked
                    }
                }
            }        
        }
    else{
        do{
            i=Math.floor(Math.random()*MAP_DIMENSIONS)
            j=Math.floor(Math.random()*MAP_DIMENSIONS)    
        }while(playerArr[i][j]===FIELD_STATE.DESTROYED_SHIP || playerArr[i][j]===FIELD_STATE.SHOOTED_FIELD)
     }

    if(canMakeMove){
        const fieldItem=document.querySelector(`div[i="${i}"][j="${j}"][parentboard=${PLAYER_BOARD}]`)
        if(playerArr[i][j]===FIELD_STATE.SHIP){
         
            if(aiShootState.firstXPositionChecked===-1){
                aiShootState.firstXPositionChecked=i
                aiShootState.lastXPositionChecked=i
                aiShootState.firstYPositionChecked=j
                aiShootState.lastYPositionChecked=j
                aiShootState.checkTop=true
            }
    
            playerArr[i][j]=FIELD_STATE.DESTROYED_SHIP;
            fieldItem.classList.remove(SELECTED_PLAYER_CELL);
            fieldItem.classList+= ' ' + DESTROYED_PLAYER_CELL;
         }else{
            fieldItem.classList+= ' ' + SHOOTED_FIELD_CELL;
            playerArr[i][j]=FIELD_STATE.SHOOTED_FIELD;
           aiNewCoordinateShoot();
         }
    }else{
        aiNewCoordinateShoot();
    }
    endGame()
    return canMakeMove
}

const aiNewCoordinateShoot=()=>{
    if(aiShootState.checkTop){
        aiShootState.checkTop=false
        aiShootState.checkRight=true
    }else if(aiShootState.checkRight){
        aiShootState.checkRight=false
        aiShootState.checkBottom=true
    }
    else if(aiShootState.checkBottom){
        aiShootState.checkBottom=false
        aiShootState.checkLeft=true
    }else if(aiShootState.checkLeft){
        aiShootState.checkLeft=false
        aiShootState.firstXPositionChecked=-1
        aiShootState.firstYPositionChecked=-1
    }
    aiShootState.lastXPositionChecked=aiShootState.firstXPositionChecked;
    aiShootState.lastYPositionChecked=aiShootState.firstYPositionChecked;
}

const mapGenerator=(map)=>{
    const mapHeight=map.clientHeight/MAP_DIMENSIONS + 'px'
    for(let i=0;i<MAP_DIMENSIONS;++i){
        for(let j=0;j<MAP_DIMENSIONS;j++){  
            const div=document.createElement(`div`)
            div.className=FIELD
            div.setAttribute("i",i)
            div.setAttribute("j",j)
            div.setAttribute("parentboard",map.id)
            div.style.flexBasis=100/MAP_DIMENSIONS +'%'
            div.style.height= mapHeight
            if(div.getAttribute("parentboard")===PLAYER_BOARD){
                div.addEventListener('click',addPlayerShips)
            }
            map.append(div)
        }   
    } 
}

const newGame=()=>{    
        aiArr=Array.from(Array(MAP_DIMENSIONS), () => new Array(MAP_DIMENSIONS).fill(0))
        playerArr=Array.from(Array(MAP_DIMENSIONS), () => new Array(MAP_DIMENSIONS).fill(0))
        mapGenerator(playerBoard)
        mapGenerator(aiBoard)
}

newGame()