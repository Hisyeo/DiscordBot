export const requestLogger = ({ logger }) => (req, res, next) => {
  logger("RECV <<<", req.method, req.url, req.hostname);
  
  res.send = responseSendInterceptor(res, res.send);
  
  res.on("finish", () => {
    logger("SEND >>>", res.contentBody);
  });
  
  next();
};

const responseSendInterceptor = (res, send) => (content) => {
  res.contentBody = content; res.send = send; res.send(content);
}