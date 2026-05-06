const logLevels={
  debug:0,
  info:1,
  warn:2,
  error:3,
  fatal:4
};

class Logger{
  constructor(config={}){
    this.minLevel=config.minLevel||'info';
    this.serviceName=config.serviceName||'notification-service';
  }

  formatLog(level,message,metadata={}){
    const timestamp=new Date().toISOString();

    return JSON.stringify({
      timestamp,
      level:level.toUpperCase(),
      service:this.serviceName,
      message,
      ...metadata
    });
  }

  shouldLog(level){
    return logLevels[level]>=logLevels[this.minLevel];
  }

  debug(message,metadata={}){
    if(this.shouldLog('debug')){
      console.log(this.formatLog('debug',message,metadata));
    }
  }

  info(message,metadata={}){
    if(this.shouldLog('info')){
      console.log(this.formatLog('info',message,metadata));
    }
  }

  warn(message,metadata={}){
    if(this.shouldLog('warn')){
      console.warn(this.formatLog('warn',message,metadata));
    }
  }

  error(message,metadata={}){
    if(this.shouldLog('error')){
      console.error(this.formatLog('error',message,metadata));
    }
  }

  fatal(message,metadata={}){
    if(this.shouldLog('fatal')){
      console.error(this.formatLog('fatal',message,metadata));
    }
  }
}

function loggingMiddleware(logger){
  return(req,res,next)=>{
    const startTime=Date.now();
    const requestId=req.headers['x-request-id']||generateRequestId();

    logger.info('Incoming request',{
      requestId,
      method:req.method,
      path:req.path,
      query:req.query,
      ip:req.ip
    });

    const oldSend=res.send;

    res.send=function(data){
      const duration=Date.now()-startTime;

      logger.info('Outgoing response',{
        requestId,
        method:req.method,
        path:req.path,
        statusCode:res.statusCode,
        duration:`${duration}ms`
      });

      oldSend.call(this,data);
    };

    res.on('finish',()=>{
      if(res.statusCode>=400){
        logger.error('Request failed',{
          requestId,
          method:req.method,
          path:req.path,
          statusCode:res.statusCode
        });
      }
    });

    next();
  };
}

function generateRequestId(){
  return 'req_'+Date.now()+'_'+Math.random().toString(36).slice(2,10);
}

module.exports={Logger,loggingMiddleware};