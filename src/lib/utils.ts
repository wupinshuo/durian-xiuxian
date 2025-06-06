import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成随机UUID
 * 使用uuid库替代crypto.randomUUID，确保浏览器兼容性
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * 格式化数字为带小数点的百分比
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
