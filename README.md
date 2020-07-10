# node-sso
node端单点登录,随机生成一个`token`,在`token`里面可以放入基本的信息,在对`token`校验的时候可以解析出来放入的信息,建议配合`redis`来使用

# 基本使用

* 1、安装依赖包

  ```shell
  npm install node-sso
  ```

* 2、使用包

  ```typescript
  import NodeSSO from 'node-sso';
  const nodeSso = new NodeSSO([可选参数,自己随便定义字符串传递进去])
  ```

* 3、在用户登录成功的时候使用

  ```typescript
  const token = nodeSso.generateToken(userId);
  // 将设置redis存储,key为userId,value为token
  ```

* 4、在中间件或者守卫中从请求头中获取到`token`并进行判断

  ```typescript
  // 1.从请求头中获取token
  // 2.使用方法decryptToken解析token(返回的是上一步你加入进去的)
  const currentUserId = nodeSso.decryptToken(token)
  // 3.利用上一步返回的数据比如userId,去查询redis中的token
  // 4.比较从redis中查询的token和从请求头中获取的token,相同就表示当前有效
  ```
