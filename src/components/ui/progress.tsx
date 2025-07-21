import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 进度条Props接口
 */
export interface IProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 进度值，0-100 */
  value: number;
  /** 最大值，默认100 */
  max?: number;
  /** 是否显示动画效果 */
  animated?: boolean;
  /** 进度条颜色变体 */
  variant?: "default" | "success" | "warning" | "danger";
}

/**
 * 进度条组件
 * 用于显示操作的完成进度
 */
const Progress = React.forwardRef<HTMLDivElement, IProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      animated = false,
      variant = "default",
      ...props
    },
    ref
  ) => {
    // 计算进度百分比
    const percentage = (Math.min(Math.max(0, value), max) / max) * 100;

    // 根据变体选择颜色
    const variantClasses = {
      default: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      danger: "bg-red-600",
    };

    const barColor = variantClasses[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-700",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all",
            barColor,
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
