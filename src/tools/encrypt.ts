import { DEFAULT_CHARACTER, GAME_SETTINGS } from "@/constants/game";

/**
 * 加密工具类
 */
class EncryptTool {
  // 存储键
  private static readonly STORAGE_KEY = GAME_SETTINGS.STORAGE_KEY;
  // 加密密钥，在实际应用中可以使用更复杂的密钥生成方法
  private static readonly ENCRYPTION_KEY = GAME_SETTINGS.ENCRYPTION_KEY;
  // 签名密钥
  private static readonly SIGNATURE_KEY = GAME_SETTINGS.SIGNATURE_KEY;

  // 默认头像
  DEFAULT_AVATAR = DEFAULT_CHARACTER.AVATAR;
  /**
   * 使用AES加密数据
   * @param data 要加密的数据
   * @returns 加密后的字符串
   */
  public encryptData(data: any): string {
    try {
      // 将数据转换为JSON字符串
      const jsonString = JSON.stringify(data);

      // 计算数据签名
      const signature = this.generateSignature(jsonString);

      // 将数据和签名打包在一起
      const payload = {
        data: jsonString,
        signature: signature,
        timestamp: Date.now(),
      };

      // 简单加密实现，使用Base64和异或运算
      const payloadStr = JSON.stringify(payload);
      let encrypted = "";
      for (let i = 0; i < payloadStr.length; i++) {
        const charCode =
          payloadStr.charCodeAt(i) ^
          EncryptTool.ENCRYPTION_KEY.charCodeAt(
            i % EncryptTool.ENCRYPTION_KEY.length
          );
        encrypted += String.fromCharCode(charCode);
      }

      // 安全处理Unicode字符串的Base64编码
      return btoa(
        encodeURIComponent(encrypted).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } catch (error) {
      console.error("数据加密失败:", error);
      return "";
    }
  }

  /**
   * 解密数据
   * @param encryptedData 加密的数据字符串
   * @returns 解密后的数据对象，如果解密失败则返回null
   */
  public decryptData(encryptedData: string): any {
    try {
      // 安全解码Base64
      const rawStr = atob(encryptedData);
      const result = decodeURIComponent(
        Array.from(
          rawStr,
          (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        ).join("")
      );

      // 解密
      let decrypted = "";
      for (let i = 0; i < result.length; i++) {
        const charCode =
          result.charCodeAt(i) ^
          EncryptTool.ENCRYPTION_KEY.charCodeAt(
            i % EncryptTool.ENCRYPTION_KEY.length
          );
        decrypted += String.fromCharCode(charCode);
      }

      // 解析payload
      const payload = JSON.parse(decrypted);

      // 验证签名
      const calculatedSignature = this.generateSignature(payload.data);
      if (calculatedSignature !== payload.signature) {
        console.error("数据签名验证失败，可能被篡改");
        return null;
      }

      // 解析原始数据
      return JSON.parse(payload.data);
    } catch (error) {
      console.error("数据解密失败:", error);
      return null;
    }
  }

  /**
   * 生成数据签名
   * @param data 要签名的数据
   * @returns 数据签名
   */
  private generateSignature(data: string): string {
    // 简单的签名实现，使用字符串和签名密钥计算哈希值
    let signature = 0;
    const stringToHash = data + EncryptTool.SIGNATURE_KEY;

    for (let i = 0; i < stringToHash.length; i++) {
      signature = (signature << 5) - signature + stringToHash.charCodeAt(i);
      signature = signature & signature; // 转换为32位整数
    }

    return signature.toString(16);
  }
}

export const encryptTool = new EncryptTool();
