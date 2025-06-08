import { v4 as uuidv4 } from "uuid";

/**
 * UUID工具类
 */
class UUIDTool {
  /**
   * 生成随机UUID
   * 使用uuid库替代crypto.randomUUID，确保浏览器兼容性
   */
  public generateUUID(): string {
    return uuidv4();
  }
}

export const uuidTool = new UUIDTool();
