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
let vertical=false;

const checkMapBeforeAddShip=(playerArr,isVertical,x, y)=>{

    if(isVertical){
        for(let index=0;index<ships-userAddedShips;++index){
            if((playerArr[x+index][y]!=0) || (x+index>=MAP_DIMENSIONS)){
                return false
            }
        }
    }

    if(!isVertical){
        for(let index=0;index<ships-userAddedShips;++index){
            if((playerArr[x][y+index]!=0) ||(y+index>=MAP_DIMENSIONS)){
                return false
            }
        }
    }
    
    return true;
}

const addPlayerShips=(e)=>{


        let i= Number(e.target.getAttribute('i'))
        let j= Number(e.target.getAttribute('j'))

        const addShip=checkMapBeforeAddShip(playerArr,!vertical,i,j);
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
                fieldItems.forEach(e=>console.log(e.removeEventListener('click',addPlayerShips)))
            }
        } 
}

const shoot=e=>{
    const i= Number(e.target.getAttribute('i'))
    const j= Number(e.target.getAttribute('j'))
    const parentboard=e.target.getAttribute('parentboard')
    
    if(e.target.classList.contains(SELECTED_PLAYER_CELL)){
        if(parentboard==PLAYER_BOARD){  
            if(playerArr[i][j]===1){
                playerArr[i][j]==-1;
               
                e.target.classList.remove(SELECTED_PLAYER_CELL);
                e.target.classList+= ' ' + DESTROYED_PLAYER_CELL;
            }
        }else{
            e.target.classList.remove(SELECTED_PLAYER_CELL);
                e.target.classList+= ' ' + SHOOTED_FIELD_CELL;
        }
        
        if(e.target.getAttribute("parentboard")===PLAYER_BOARD){
            playerArr[i][j]=0
        }else{
            aiArr[i][j]=0
        }

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