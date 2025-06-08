/**
 * 睡眠工具类
 */
class SleepTool {
  /**
   * 延迟执行方法
   * @param ms 延迟时间(毫秒)
   */
  public sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
        clearTimeout(timer);
      }, ms);
    });
  }
}

export const sleepTool = new SleepTool();
