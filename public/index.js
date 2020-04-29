var socket = io('http://localhost:9000')
document.onkeypress=popon
window.noblocks=0

console.log(window.screenLeft+"  "+window.screenTop)

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

socket.once('newblock',(data)=>{
    var features="top="+data.top+",left="+data.left+",height="+data.height+",width="+data.width+
    "location=yes,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
    var a= window.open("/block",'_blank',features)
})
socket.on('looser',()=>{
    document.body.style.backgroundColor="red"
    document.body.innerHTML="<p><h1 style='color: gold;'>Looser</h1></p>"
})
socket.on('won',()=>{
    document.body.style.backgroundColor="green"
    document.body.innerHTML="<p><h1 style='color: gold;'>You are won</h1></p>"
})