var socket = io('http://localhost:9000/roller')
document.onkeypress=popon
window.noblocks=0
window.onmousemove=wigin

function popon(event){
    if(event.keyCode===32){
        if(window.noblocks==0){
            var data={
                key:event.keyCode,
                screen:{
                    height:window.screen.height,
                    width:window.screen.width
                },
                top:window.screenTop
            }
            socket.emit('keypress',data)
            window.noblocks++
        }
    }
}


socket.once('ball',(data)=>{
    var features="top="+data.top+",left="+data.left+",height="+data.height+",width="+data.width+
    "location=yes,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
    var a= window.open("/ball",'_blank',features)
})

socket.on('movement',(data)=>{
    if( data.top>window.screenTop-105&&data.top<window.screenTop-95&&(data.left>window.screenLeft-200)&&(data.left<window.screenLeft+200)){
        var dir = data.direction=="bottomLeft"?"topLeft":"topRight"
        socket.emit('changedir',{direction:dir})
    }
})

function wigin(evt){
    self.moveBy(evt.movementX,0)
}