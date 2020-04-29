var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var events = require('events');
var evtemiter = new events.EventEmitter();
evtemiter.setMaxListeners(1000)

var position={}
var displayed = 1
var height = 100 //101
var width = 200  //213
var disheight,diswidth,leftoffset,leftblocks,topblocks,noblocks,damagedblocks=0;

server.listen(9000)

// websocket configs
io.on('connection', (socket) => {
  socket.once('keypress',(data)=>{
    if(data.key==32){
      disheight=data.screen.height
      diswidth=data.screen.width
      leftblocks=Math.floor(diswidth/width)
      leftoffset=(diswidth-(leftblocks*width))/2
      topblocks=Math.floor(Math.floor(disheight/height)/2)
      noblocks=topblocks*leftblocks
      for (let i = topblocks-1,k=1; i > -1; i--) {
        for (let j = 0; j < leftblocks; j++,k++) {
          position[k]={h:i,w:j}
        }
      }
      socket.emit('newblock',{height:100,width:200,top:(position[displayed].h*height),left:(position[displayed].w*width+leftoffset)})
      displayed++
    }
  })
  evtemiter.on('won',()=>{
    socket.emit('won')
  })
  evtemiter.on('looser',()=>{
    socket.emit('looser')
  })
});

io.of('/block').on('connection',(socket)=>{
  socket.once('keypress',(data)=>{
    if(data.key==32&&displayed<noblocks+1){
      socket.emit('newblock',{height:100,width:200,top:(position[displayed].h*height),left:position[displayed].w*width+leftoffset})
      displayed++
    }else if(displayed==noblocks+1){
      console.log("ball start")
      socket.emit('roller',{height:100,width:200,top:disheight-165,left:(diswidth-200)/2})
      displayed++
    }
  })
  socket.on('changedir',(data)=>{
    evtemiter.emit('changedir',data)
  })
  socket.on('damaged',()=>{
    damagedblocks++
    if(damagedblocks==noblocks){
      evtemiter.emit('won')
    }
  })
  evtemiter.on('movement',(data)=>{
    socket.emit('movement',data)
  })
  evtemiter.on('looser',()=>{
    socket.emit('looser')
  })
})
  
io.of('/roller').on('connection',(socket)=>{
  socket.once('keypress',(data)=>{
    if(data.key==32){
      console.log(data.top-101-30)
      socket.emit('ball',{height:100,width:200,top:data.top-103,left:(diswidth-200)/2})
    }
  })
  evtemiter.on('movement',(data)=>{
    socket.emit('movement',data)
  })
  socket.on('changedir',(data)=>{
    evtemiter.emit('changedir',data)
  })

})

io.of('/ball').on('connection',(socket)=>{
  socket.on('looser',()=>{
    evtemiter.emit('looser')
  })
  socket.on('movement',(data)=>{
    evtemiter.emit('movement',data)
  })
  evtemiter.on('changedir',(data)=>{
    socket.emit('changedir',data)
  })
  evtemiter.on('won',()=>{
    socket.emit('won')
  })
})

// express configs
app.use(require('express').static('public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

app.get('/block',(req,res)=>{
    res.sendFile(__dirname+'/public/block.html')
})

app.get('/roller',(req,res)=>{
  res.sendFile(__dirname+'/public/roller.html')
})

app.get('/ball',(req,res)=>{
  res.sendFile(__dirname+'/public/ball.html')
})

console.info("Server listening @ localhost:9000")