const AI_BOARD='aiBoard'
const PLAYER_BOARD='playerBoard'
const SELECTED_PLAYER_CELL='selectedPlayerCell'
const DESTROYED_PLAYER_CELL='destroyedPlayerCell'
const SHOOTED_FIELD_CELL='shootedFieldCell'
const SHOW_SELECTED_PLAYER_CELLS="showSelectedPlayerCells"
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
const verticalInfo=document.getElementById("verticalInfo")

const SHIP_SIZES=[5,4,3,3,2]

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

const getCurrentShipSize=(addedShips)=>SHIP_SIZES[addedShips]

const checkMapBeforeAddShip=(map,addedShips,i, j)=>{
    const shipSize=getCurrentShipSize(addedShips)
    if(vertical){    
        let jPlusUpperOne= j+1<MAP_DIMENSIONS ? j+1 : j
        let jPlusLowerOne= j-1>=0 ? j-1 : j
        let indexIUpperHelper=i-1>=0 ? i-1 : i 
        let indexILowerHelper=(i+shipSize)<MAP_DIMENSIONS ? i+shipSize : MAP_DIMENSIONS-1
        if(!((map[indexIUpperHelper][jPlusUpperOne]===FIELD_STATE.SHIP)||(map[indexIUpperHelper][jPlusLowerOne]===FIELD_STATE.SHIP)||
            (map[indexILowerHelper][jPlusUpperOne]===FIELD_STATE.SHIP)||(map[indexILowerHelper][jPlusLowerOne]===FIELD_STATE.SHIP)||
            (map[indexIUpperHelper][j]===FIELD_STATE.SHIP)||(map[indexILowerHelper][j]===FIELD_STATE.SHIP) )){
            for(let index=0;index<shipSize;++index){    
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
    if(!vertical){ 
        let indexJLowerHelper= (j+shipSize)<MAP_DIMENSIONS ? j+shipSize : MAP_DIMENSIONS-1
        let indexJUpperHelper=j-1>=0 ? j-1 : j
        let iPlusUpperOne= i+1<MAP_DIMENSIONS ? i+1 : i
        let iPlusLowerOne= i-1>=0 ? i-1 : i
        let jMinusStartUpperOne= j-1>=0 ? j-1 : j
        let jPlusStartUpperOne = (j+shipSize)<MAP_DIMENSIONS?j+shipSize:MAP_DIMENSIONS-1

        if(!((map[iPlusUpperOne][jMinusStartUpperOne]===FIELD_STATE.SHIP)||(map[iPlusUpperOne][jPlusStartUpperOne]===FIELD_STATE.SHIP)||
        (map[iPlusLowerOne][jMinusStartUpperOne]===FIELD_STATE.SHIP)||(map[iPlusLowerOne][jPlusStartUpperOne]===FIELD_STATE.SHIP)||
        (map[i][indexJLowerHelper]===FIELD_STATE.SHIP)||(map[i][indexJUpperHelper]===FIELD_STATE.SHIP))){
            for(let index=0;index<shipSize;++index){
                let indexIUpperHelper=i-1 >=0 ? i-1 : i 
                let indexILowerHelper=i+1 <MAP_DIMENSIONS ? i+1 : i
                if((map[indexIUpperHelper][j+index]===FIELD_STATE.SHIP)||(map[indexILowerHelper][j+index]===FIELD_STATE.SHIP)||
                    (map[i][j+index]!==FIELD_STATE.EMPTY) || (j+index>=MAP_DIMENSIONS)){  
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

    vertical= (Math.random() < 0.5) ? vertical:!vertical

    const addShip=checkMapBeforeAddShip(aiArr,aiAddedShips,i,j);
    if(addShip){
        const shipSize=getCurrentShipSize(aiAddedShips)
        aiAddedShips++;
        for(let index=0;index<shipSize;++index){
            if(vertical){
                aiArr[i+index][j]=FIELD_STATE.SHIP
            }else{
                aiArr[i][j+index]=FIELD_STATE.SHIP;
            }
        }
        if(aiAddedShips===SHIP_SIZES.length){
            const fieldItems=document.querySelectorAll(`div[parentboard=${AI_BOARD}]`)
            fieldItems.forEach(e=>e.addEventListener('click',shootThisAi))
        }
    }
}

const addPlayerShips=(e)=>{
        turnOffHighlightFIeld()
        addRipple(e,e.target)
        let i= Number(e.target.getAttribute('i'))
        let j= Number(e.target.getAttribute('j'))

        const addShip=checkMapBeforeAddShip(playerArr,userAddedShips,i,j);
        if(addShip){
            const shipSize=getCurrentShipSize(userAddedShips)
            userAddedShips++;
            let fieldItem;
            for(let index=0;index<shipSize;++index){
                if(vertical){
                    playerArr[i+index][j]=FIELD_STATE.SHIP
                    fieldItem=document.querySelector(`div[i="${i+index}"][j="${j}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }else{
                    playerArr[i][j+index]=FIELD_STATE.SHIP
                    fieldItem=document.querySelector(`div[i="${i}"][j="${j+index}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }
                fieldItem.removeEventListener("mouseenter",highlightField)
                fieldItem.removeEventListener("pointerenter",highlightField)
                fieldItem.removeEventListener("touchstart",highlightField)
                fieldItem.removeEventListener("pointerdown",highlightField)
            }
            if(userAddedShips===SHIP_SIZES.length){
                const fieldItems=document.querySelectorAll(`div[parentboard=${PLAYER_BOARD}]`)
                fieldItems.forEach(e=>e.removeEventListener('click',addPlayerShips))
                while(aiAddedShips!==SHIP_SIZES.length){
                    addAiShips()
                    verticalInfo.style.display="none"
                }
            }
        } 
}

const endGame=()=>{
    if(!playerArr.some(e=>e.includes(FIELD_STATE.SHIP)) || !aiArr.some(e=>e.includes(FIELD_STATE.SHIP))){
        const endGameField=document.getElementById("endGameH2")
        const endGameContainer=document.getElementById("endGameContainer")
        const resetGameBtn=document.getElementById("resetGameBtn")
        const playerFieldItems=document.querySelectorAll(`div[parentboard=${AI_BOARD}]`)
        playerFieldItems.forEach(e=>e.removeEventListener('click',shootThisAi))

        if(!playerArr.some(e=>e.includes(FIELD_STATE.SHIP))){
            endGameField.innerText="You lost"
            endGameField.className="game-over lost"
        }
        else if(!aiArr.some(e=>e.includes(FIELD_STATE.SHIP))){
            endGameField.innerText="You won"
            endGameField.className="game-over won"
        }
        if(endGameContainer) endGameContainer.classList.add("visible")
        if(resetGameBtn) resetGameBtn.style.display="inline-block"
    }
}

const resetGame=()=>{
    userAddedShips=0
    aiAddedShips=0
    aiShootState={ checkTop:false, checkRight:false, checkBottom:false, checkLeft:false, firstXPositionChecked:-1, firstYPositionChecked:-1, lastXPositionChecked:-1, lastYPositionChecked:-1 }
    vertical=false

    const endGameField=document.getElementById("endGameH2")
    const endGameContainer=document.getElementById("endGameContainer")
    const resetGameBtn=document.getElementById("resetGameBtn")
    if(endGameField){
        endGameField.innerText=""
        endGameField.className=""
    }
    if(endGameContainer) endGameContainer.classList.remove("visible")
    if(resetGameBtn) resetGameBtn.style.display="none"
    if(verticalInfo) verticalInfo.style.display=""

    aiBoard.innerHTML=""
    playerBoard.innerHTML=""
    newGame()
}

const shootThisAi=e=>{
    addRipple(e,e.target)
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
                div.addEventListener("mouseenter",highlightField)
                div.addEventListener("pointerenter",highlightField)
                div.addEventListener("touchstart",highlightField,{passive:true})
                div.addEventListener("pointerdown",highlightField)
            }
            map.append(div)
        }   
    } 
}

const highlightField=e=>{
    if(userAddedShips>=SHIP_SIZES.length) return
    const cell=e.target
    if(!cell.classList.contains(FIELD)||cell.getAttribute("parentboard")!==PLAYER_BOARD) return
    turnOffHighlightFIeld()
    const i=Number(cell.getAttribute("i"))
    const j=Number(cell.getAttribute("j"))
    const correctPosition=checkMapBeforeAddShip(playerArr,userAddedShips,i,j)
    if(correctPosition){
        const shipSize=getCurrentShipSize(userAddedShips)
        for(let index=0;index<shipSize;++index){
            const fieldItem=playerBoard.querySelector(`div.field[i="${i+(vertical?index:0)}"][j="${j+(vertical?0:index)}"]`)
            if(fieldItem) fieldItem.classList.add(SHOW_SELECTED_PLAYER_CELLS)
        }
    }
}

const turnOffHighlightFIeld=()=>{
    document.querySelectorAll(`.${SHOW_SELECTED_PLAYER_CELLS}`).forEach(item=>item.classList.remove(SHOW_SELECTED_PLAYER_CELLS))
}

const highlightFromTouch=(e)=>{
    if(!e.touches?.length) return
    const el=document.elementFromPoint(e.touches[0].clientX,e.touches[0].clientY)
    if(el?.classList?.contains(FIELD)&&el.getAttribute("parentboard")===PLAYER_BOARD) highlightField({target:el})
}

if(playerBoard){
    playerBoard.addEventListener('mouseleave',turnOffHighlightFIeld)
    playerBoard.addEventListener('touchmove',highlightFromTouch,{passive:true})
    document.addEventListener('touchend',turnOffHighlightFIeld,{passive:true})
    document.addEventListener('touchcancel',turnOffHighlightFIeld,{passive:true})
    document.addEventListener('pointerup',turnOffHighlightFIeld)
}

document.addEventListener('keypress', e=>{
    if(e.code==="KeyR"){
        vertical=!vertical
        verticalInfo.innerText=vertical?"set horizontal (Press r to change direction)":"set vertical (Press r to change direction)"
    }
});

const LETTERS='ABCDEFGHIJKL'

const initCoords=(boardId)=>{
    const lettersEl=document.getElementById(boardId+'CoordLetters')
    const numbersEl=document.getElementById(boardId+'CoordNumbers')
    if(!lettersEl||!numbersEl)return
    lettersEl.innerHTML=LETTERS.split('').map(l=>`<span>${l}</span>`).join('')
    numbersEl.innerHTML=Array.from({length:MAP_DIMENSIONS},(_,i)=>`<span>${i+1}</span>`).join('')
}

const addRipple=(e,el)=>{
    const rect=el.getBoundingClientRect()
    const x=e.clientX-rect.left
    const y=e.clientY-rect.top
    const ripple=document.createElement('span')
    ripple.className='ripple'
    ripple.style.left=x+'px'
    ripple.style.top=y+'px'
    el.appendChild(ripple)
    setTimeout(()=>ripple.remove(),600)
}

const newGame=()=>{    
        aiArr=Array.from(Array(MAP_DIMENSIONS), () => new Array(MAP_DIMENSIONS).fill(0))
        playerArr=Array.from(Array(MAP_DIMENSIONS), () => new Array(MAP_DIMENSIONS).fill(0))
        mapGenerator(playerBoard)
        mapGenerator(aiBoard)
        initCoords('ai')
        initCoords('player')
}

document.getElementById('themeBtn')?.addEventListener('click',()=>{
    document.body.classList.toggle('light-theme')
})

document.getElementById('resetGameBtn')?.addEventListener('click',resetGame)

newGame()
