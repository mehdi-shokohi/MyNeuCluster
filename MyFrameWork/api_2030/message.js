// handle `GET` requests to `/message`
var router = require('router')()




router.all('/', async function (req, res) {
  let serv = new service2030.serv_one();
  serv.job_run()



  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end("hello World"+'\n' + req.xx.alpha)
})

module.exports = router