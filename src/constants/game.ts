/**
 * 游戏核心常量
 */

/** 游戏基础设置 */
export const GAME_SETTINGS = {
  /** 游戏名称 榴莲修仙 */
  GAME_NAME: "榴莲修仙",
  /** 游戏版本 0.1.0 */
  GAME_VERSION: "0.1.0",
  /** 本地存储键名 durian_xiuxian_save */
  STORAGE_KEY: "durian_xiuxian_save",
  /** 加密密钥 */
  ENCRYPTION_KEY: "durian_xiuxian_secret_key_2025",
  /** 签名密钥 */
  SIGNATURE_KEY: "durian_xiuxian_signature_2025",
};

/** 角色默认值 */
export const DEFAULT_CHARACTER = {
  /** 默认名称 */
  NAME: "无名散修",
  /** 默认头像 */
  AVATAR: "/avatars/default.png",
  /** 默认年龄 */
  AGE: 16,
  /** 默认寿元 */
  LIFESPAN: 100,
};

/** 默认货币数量 */
export const DEFAULT_CURRENCY = {
  /** 灵石 */
  SPIRITUAL_STONES: 100,
  /** 灵玉 */
  SPIRIT_GEMS: 0,
};

/** 默认角色属性 */
export const DEFAULT_ATTRIBUTES = {
  /** 攻击 */
  ATTACK: 10,
  /** 防御 */
  DEFENSE: 10,
  /** 灵力 */
  SPIRIT: 15,
  /** 速度 */
  SPEED: 10,
  /** 气血 */
  HEALTH: 100,
  /** 灵力值 */
  MANA: 50,
  /** 悟性 */
  INSIGHT: 10,
};

/** 自动存档时间间隔（毫秒） */
export const AUTO_SAVE_INTERVAL = 60000;
