var socket = io('http://localhost:9000/ball')
var movement="topLeft"
window.onload=moveself
var i=1,n=4

function moveself(){
    // document.getElementById('odo').currentTime += 20000;
    socket.on('changedir',(data)=>{
        movement=data.direction
    })
    var itrato = setInterval(()=>{
        socket.on('won',()=>{
            clearInterval(itrato)
        })
        switch(movement){
            case "topLeft":{
                self.moveBy(-n,-n)
                break
            }
            case "topRight":{
                self.moveBy(n,-n)
                break
            }
            case "bottomLeft":{
                self.moveBy(-n,n)
                break
            }
            case "bottomRight":{
                self.moveBy(n,n)
                break
            }
        }
        socket.emit('movement',{ top:window.screenTop,left:window.screenLeft,direction:movement })
        if(window.screenLeft<=5){
            if(movement=="topLeft"){
                movement="topRight"
            }else if(movement=="bottomLeft"){
                movement="bottomRight"
            }
        }else if(window.screenTop<=5){
            if(movement=="topRight"){
                movement="bottomRight"
            }else if(movement=="topLeft"){
                movement="bottomLeft"
            }
        }else if(window.screenLeft>=window.screen.width-220){
            if(movement=="bottomRight"){
                movement="bottomLeft"
            }else if(movement=="topRight"){
                movement="topLeft"
            }
        }else if(window.screenTop>=window.screen.height-170){
            clearInterval(itrato)
            socket.emit("looser")
        }
    },20)
}
