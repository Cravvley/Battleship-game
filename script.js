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
    lastXPositionChecked:0,
    lastYPositionChecked:0
}

const checkMapBeforeAddShip=(map,isVertical,addedShips,x, y)=>{
    if(isVertical){
        for(let index=1;index<ships-addedShips;++index){
            if(x+index-1>=0){ 
                if((map[x+index-1][y]!==0) || (x+index>=MAP_DIMENSIONS)){
                    return false
                }
            }else{
                if((map[x+index][y]!==0) || (x+index>=MAP_DIMENSIONS)){ 
                    return false
                }
            }
        }
    }
    if(!isVertical){
        for(let index=0;index<ships-addedShips;++index){
            if((map[x][y+index]!==0) || (y+index>MAP_DIMENSIONS)){  
                return false
            }
        }
    } 
    return true;
}

const addAiShips=()=>{
    let x=Math.floor(Math.random()*MAP_DIMENSIONS)
    let y=Math.floor(Math.random()*MAP_DIMENSIONS)
    const addShip=checkMapBeforeAddShip(aiArr,!vertical,aiAddedShips,x,y);
    if(addShip){
        vertical=!vertical;
        aiAddedShips++;
        let indexHelper=0;
        for(let index=aiAddedShips;index<=ships;++index){
            if(vertical){
                if(x+indexHelper-1>=0){
                    aiArr[x+indexHelper-1][y]=1
                }else{
                    aiArr[x+indexHelper][y]=1
                }     
            }else{
                aiArr[x][y+indexHelper]=1;
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
        let x= Number(e.target.getAttribute('i'))
        let y= Number(e.target.getAttribute('j'))

        const addShip=checkMapBeforeAddShip(playerArr,!vertical,userAddedShips,x,y);
        if(addShip){
            vertical=!vertical;
            userAddedShips++;
            e.target.className+= ' ' + SELECTED_PLAYER_CELL
            let indexHelper=0;
            for(let index=userAddedShips;index<=ships;++index){
                if(vertical){
                    playerArr[x+indexHelper][y]=1
                    const fieldItem=document.querySelector(`div[i="${x+indexHelper}"][j="${y}"][parentboard=${PLAYER_BOARD}]`)
                    fieldItem.classList.add(SELECTED_PLAYER_CELL)
                }else{
                    playerArr[x][y+indexHelper]=1;
                    const fieldItem=document.querySelector(`div[i="${x}"][j="${y+indexHelper}"][parentboard=${PLAYER_BOARD}]`)
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

const shootThisAi=e=>{
    const i= Number(e.target.getAttribute('i'))
    const j= Number(e.target.getAttribute('j'))

    if(aiArr[i][j]===1){
        aiArr[i][j]=-1
        e.target.classList+= ' ' + DESTROYED_PLAYER_CELL;
    }
    else{
        e.target.classList+= ' ' + SHOOTED_FIELD_CELL;
    }    
    const fieldItem=document.querySelector(`div[i="${i}"][j="${j}"][parentboard=${AI_BOARD}]`)
    fieldItem.removeEventListener('click',shootThisAi)
    shootThisGuy()
}

const shootThisGuy=()=>{
    let x=Math.floor(Math.random()*MAP_DIMENSIONS)
    let y=Math.floor(Math.random()*MAP_DIMENSIONS)
    const fieldItem=document.querySelector(`div[i="${x}"][j="${y}"][parentboard=${PLAYER_BOARD}]`)

     if(playerArr[x][y]===1){
        playerArr[x][y]===-1;
        fieldItem.classList.remove(SELECTED_PLAYER_CELL);
        fieldItem.classList+= ' ' + DESTROYED_PLAYER_CELL;
     }else{
        fieldItem.classList+= ' ' + SHOOTED_FIELD_CELL;
     }
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