window.onload=koli
document.onkeypress=popon
window.noblocks=0

var socket = io('http://localhost:9000/block')

socket.once('newblock',(data)=>{
    var features="top="+data.top+",left="+data.left+",height="+data.height+",width="+data.width+
    "location=yes,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
    var a= window.open("/block",'_blank',features)
}) 

socket.once('roller',(data)=>{
    var features="top="+data.top+",left="+data.left+",height="+data.height+",width="+data.width+
    "location=yes,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
    var a= window.open("/roller",'_blank',features)
}) 

socket.on('looser',()=>{
    document.body.style.backgroundColor="red"
    document.getElementById('dim').innerText="Looser"
})

socket.on('movement',(data)=>{
    if((data.left<window.screenLeft+200)&&(data.left+200>window.screenLeft)&&(data.top<window.screenTop+100)&&(data.top+100>window.screenTop)){
        var dir=""
        if(data.direction=="topLeft"){
            dir="bottomLeft"
        }else if(data.direction=="topRight"){
            dir="bottomRight"
        }else if(data.direction=="bottomLeft"){
            dir="bottomRight"
        }else if(data.direction=="bottomRight"){
            dir="bottomLeft"
        }
        socket.emit('changedir',{direction:dir})
        socket.emit('damaged')
        window.close()
    }
})

function koli(){
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor=randomColor
}

function popon(event){
    if(event.keyCode===32){
        if(window.noblocks==0){
            var data={
                key:event.keyCode,
                screen:{
                    height:window.screen.height,
                    width:window.screen.width
                }
            }
            socket.emit('keypress',data)
        window.noblocks++
        }
    }
}

