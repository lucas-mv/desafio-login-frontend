const proxy = [
    {
      context: '/api/login',
      target: 'http://localhost:8080',
      pathRewrite: {'^/api' : 'https://login.microsoftonline.com/be87ed09-e753-468f-8244-e2f3811ceacc/oauth2/v2.0/token'}
    }
  ];
module.exports = proxy;