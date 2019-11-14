var httpBuilder = require("./component/HttpBuilder")
var serviceLoaderByNamespace = require('./component/service_loader_namespace')


class MyHttpBuilder extends httpBuilder{
  constructor (port, option,controllerPath,instanceNo){
    super(port,option,controllerPath,instanceNo)
    this.option=option
  }

  run(){
    super.run()
    if(this.option && this.option.servicePath && this.option.serviceTag)
      serviceLoaderByNamespace(this.option.servicePath , this.option.serviceTag)
  }
}

module.exports = MyHttpBuilder