// import our modules
const http = require('http')
const Router = require('express')
const finalHandler = require('finalhandler')
const EventEmitter = require('events')
const cluster = require('cluster')
const mem = require('./worker_mem')
const https = require('spdy')

class MMicroExpress extends EventEmitter {

  constructor (port, options, controller_path, instance_Num) {
    super()
    this.port = port
    this.options = options || {}
    this.router = Router()
    this.express = Router
    this.cPath = controller_path
    this.instanceNum = instance_Num <= 0 ? 1 : instance_Num

  }

  getExpress () {
    return this.express
  }

  getRouter () {
    return this.router
  }

  setRouter (my_router) {
    this.router = my_router
  }

  run () {
    if (this.cPath)
      require('./controller_loader')(this.cPath, this.router)

    if (this.instanceNum > 0) {

      if (cluster.isMaster) {

        // Fork workers.
        for (let i = 0; i < this.instanceNum; i++) {
          var worker = cluster.fork()
          mem.shmSet(worker.id, {type: this.port})
          // console.log(`Create Worker For HTTP Server On ${worker.id} Process(${worker.process.pid})`)

        }
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Http worker ${worker.process.pid} died`)
        })
      } else if (cluster.isWorker) {
        let my = mem.shmGet(cluster.worker.id)

        if (my.type === this.port) {
          if (this.options)
            if (this.options.key && this.options.cert) {
              this.server = https.createServer(this.options)
            } else {
              this.server = http.createServer()
            }

          this.server.on('request', (req, res) => {
            this.emit('pre_route', req)
            this.router(req, res, finalHandler(req, res))
          })
          this.server.on('listening', () => {
            this.emit('start')
          })
          this.server.listen(this.port)

          console.log(`Http Worker ${process.pid} started for Port ${this.port}`)
        }

      }

    }

  }

}

module.exports = MMicroExpress