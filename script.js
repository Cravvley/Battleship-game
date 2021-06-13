//TODO : 
// dodac proste ai
// dodac lepsze ustawianie pozycji

const AI_BOARD='aiBoard'
const PLAYER_BOARD='playerBoard'
const SELECTED_PLAYER_CELL='selectedPlayerCell'
const DESTROYED_PLAYER_CELL='destroyedPlayerCell'
const SHOOTED_FIELD_CELL='shootedFieldCell'
const FIELD='field'
const MAP_DIMENSIONS=10

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
        for(let index=1;index<ships-addedShips;++index){
            if(i+index-1>=0){ 
                if((map[i+index-1][j]!==0) || (i+index>=MAP_DIMENSIONS)){
                    return false
                }
            }else{
                if((map[i+index][j]!==0) || (i+index>=MAP_DIMENSIONS)){ 
                    return false
                }
            }
        }
    }
    if(!isVertical){
        for(let index=0;index<ships-addedShips;++index){
            if((map[i][j+index]!==0) || (j+index>MAP_DIMENSIONS)){  
                return false
            }
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
                if(i+indexHelper-1>=0){
                    aiArr[i+indexHelper-1][j]=1
                }else{
                    aiArr[i+indexHelper][j]=1
                }     
            }else{
                aiArr[i][j+indexHelper]=1;
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
                    playerArr[i+indexHelper][j]=1
                    const fieldItem=document.querySelector(`div[i="${i+indexHelper}"][j="${j}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }else{
                    playerArr[i][j+indexHelper]=1;
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
    if(!playerArr.some(e=>e.includes(1)) || !aiArr.some(e=>e.includes(1))){
        const endGameField=document.getElementById("endGameH2")
        const playerFieldItems=document.querySelectorAll(`div[parentboard=${AI_BOARD}]`)
        playerFieldItems.forEach(e=>e.removeEventListener('click',shootThisAi))

        if(!playerArr.some(e=>e.includes(1))){
            endGameField.innerText="You lost"
        }
        else if(!aiArr.some(e=>e.includes(1))){
            endGameField.innerText="You won"
        }
    }
}

const shootThisAi=e=>{
    const i= Number(e.target.getAttribute('i'))
    const j= Number(e.target.getAttribute('j'))

    if(aiArr[i][j]===1){
        aiArr[i][j]=-1
        e.target.classList+= ' ' + DESTROYED_PLAYER_CELL;
    }
    else{
        e.target.classList+= ' ' + SHOOTED_FIELD_CELL;
        aiArr[i][j]=-2
    }    
    const fieldItem=document.querySelector(`div[i="${i}"][j="${j}"][parentboard=${AI_BOARD}]`)
    fieldItem.removeEventListener('click',shootThisAi)
    
    endGame()
    while(!shootThisGuy()){}
    endGame()
}

const shootThisGuy=()=>{
    let i=0
    let j=0
    let canMakeMove=true

    if(aiShootState.checkTop||aiShootState.checkRight||
        aiShootState.checkBottom||aiShootState.checkLeft){    
            if(aiShootState.checkTop){
                if(!(aiShootState.lastXPositionChecked+1<MAP_DIMENSIONS)){
                    canMakeMove=false
                }else{
                    aiShootState.lastXPositionChecked-=1
                    i=aiShootState.lastXPositionChecked
                    j=aiShootState.lastYPositionChecked
                }
            }else if(aiShootState.checkBottom){
                if(!(aiShootState.lastYPositionChecked-1>=0)){
                    canMakeMove=false
                }else{
                    aiShootState.lastXPositionChecked+=1
                    i=aiShootState.lastXPositionChecked
                    j=aiShootState.lastYPositionChecked
                }
            }else if(aiShootState.checkRight){
                console.log("test")
                if(!(aiShootState.lastYPositionChecked+1<MAP_DIMENSIONS)){
                    canMakeMove=false
                }else{
                    aiShootState.lastYPositionChecked+=1
                    i=aiShootState.lastXPositionChecked
                    j=aiShootState.lastYPositionChecked
                }
            }else if(aiShootState.checkLeft){
                if(!(aiShootState.lastXPositionChecked-1>=0)){
                    canMakeMove=false
                }else{
                    aiShootState.lastYPositionChecked-=1
                    i=aiShootState.lastXPositionChecked
                    j=aiShootState.lastYPositionChecked
                }
            }        
        }
    else{
        do{
            i=Math.floor(Math.random()*MAP_DIMENSIONS)
            j=Math.floor(Math.random()*MAP_DIMENSIONS)    
        }while(playerArr[i][j]===-1 || playerArr[i][j]===-2)
     }

    if(canMakeMove){
        const fieldItem=document.querySelector(`div[i="${i}"][j="${j}"][parentboard=${PLAYER_BOARD}]`)
        if(playerArr[i][j]===1){
         
            if(aiShootState.firstXPositionChecked===-1){
                aiShootState.firstXPositionChecked=i
                aiShootState.lastXPositionChecked=i
                aiShootState.firstYPositionChecked=j
                aiShootState.lastYPositionChecked=j
                aiShootState.checkTop=true
            }
    
            playerArr[i][j]=-1;
            fieldItem.classList.remove(SELECTED_PLAYER_CELL);
            fieldItem.classList+= ' ' + DESTROYED_PLAYER_CELL;
         }else{
            fieldItem.classList+= ' ' + SHOOTED_FIELD_CELL;
            playerArr[i][j]=-2;
           aiNewCoordinateShoot();
         }
    }else{
        aiNewCoordinateShoot();
    }
    endGame()
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

newGame();