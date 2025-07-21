import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * 头像Props接口
 */
export interface IAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 头像图片URL */
  src?: string;
  /** 头像替代文本 */
  alt?: string;
  /** 头像大小 */
  size?: "sm" | "md" | "lg" | "xl";
  /** 是否显示在线状态 */
  showStatus?: boolean;
  /** 在线状态 */
  status?: "online" | "offline" | "away" | "busy";
  /** 是否为圆形 */
  rounded?: boolean;
}

/**
 * 头像组件
 * 用于显示用户或实体的图片
 */
const Avatar = React.forwardRef<HTMLDivElement, IAvatarProps>(
  (
    {
      className,
      src,
      alt = "Avatar",
      size = "md",
      showStatus = false,
      status = "offline",
      rounded = true,
      ...props
    },
    ref
  ) => {
    // 根据尺寸设置类名
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-16 h-16",
      xl: "w-24 h-24",
    };

    // 状态颜色
    const statusColors = {
      online: "bg-green-500",
      offline: "bg-gray-500",
      away: "bg-yellow-500",
      busy: "bg-red-500",
    };

    // 状态指示器尺寸
    const statusSizes = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
      xl: "w-4 h-4",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", sizeClasses[size], className)}
        {...props}
      >
        <div
          className={cn(
            "overflow-hidden bg-gray-700",
            sizeClasses[size],
            rounded ? "rounded-full" : "rounded-md"
          )}
        >
          {src ? (
            <div className="relative w-full h-full">
              <Image src={src} alt={alt} fill className="object-cover" />
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-center w-full h-full bg-gray-700 text-gray-300",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base",
                size === "xl" && "text-lg"
              )}
            >
              {alt.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {showStatus && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block border-2 border-gray-800 rounded-full",
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
