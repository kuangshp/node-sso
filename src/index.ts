import * as crypto from 'crypto';
import random from './random';

// 默认的加盐
const SECRET = 'dff12.&6$,Az';

class NodeSSO {
  constructor (public secret: string = SECRET) {
    this.secret = secret;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:09:59
   * @LastEditors: 水痕
   * @Description: 根据用户id生成一个token
   * @param {type} 
   * @return: 
   */
  public generateToken(user: string | object): string {
    // 固定的
    const randomStr = random();
    const header = this.toBase64(randomStr);
    const payload = this.toBase64(user);
    const sign = this.signHandle([header, payload].join('.'));
    return [header, payload, sign].join('.');
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:12:59
   * @LastEditors: 水痕
   * @Description: 解析token返回token中的加入的参数
   * @param {type} 
   * @return: 
   */
  public decryptToken(token: string): string | null {
    const [header, payload, sign] = token.split('.');
    const newSign = this.signHandle([header, payload].join('.'));
    if (newSign == sign) {
      return Buffer.from(this.base64URLUnescape(payload), 'base64').toString();
    } else {
      return null;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:04:00
   * @LastEditors: 水痕
   * @Description: 将base64中是+、/替换成_ 和=替换成' ' (浏览器是不识别这些的)
   * @param {type} 
   * @return: 
   */
  private base64URLEscape(content: string): string {
    return content.replace(/\+|\//g, '_').replace(/=/g, '');
  }

  private base64URLUnescape(str: string): string {
    str += new Array(5 - str.length % 4).join('=')
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:04:31
   * @LastEditors: 水痕
   * @Description: 将数据转换为base64
   * @param {type} 
   * @return: 
   */
  private toBase64(content: string | object): string {
    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }
    return this.base64URLEscape(Buffer.from(content).toString('base64'));
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-10 13:06:03
   * @LastEditors: 水痕
   * @Description: 根据用户传递的内容进行签名
   * @param {type} 
   * @return: 
   */
  private signHandle(content: string): string {
    const result = crypto.createHmac('sha256', this.secret).update(content).digest('base64');
    return this.base64URLEscape(result);
  }
}

export default NodeSSO;
export { NodeSSO };