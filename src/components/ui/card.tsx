import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 卡片组件Props接口
 */
export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片组件
 * 用于显示内容的容器
 */
const Card = React.forwardRef<HTMLDivElement, ICardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * 卡片头部Props接口
 */
export interface ICardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片头部组件
 */
const CardHeader = React.forwardRef<HTMLDivElement, ICardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * 卡片标题Props接口
 */
export interface ICardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 卡片标题组件
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, ICardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * 卡片描述Props接口
 */
export interface ICardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 卡片描述组件
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  ICardDescriptionProps
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-400", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

/**
 * 卡片内容Props接口
 */
export interface ICardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片内容组件
 */
const CardContent = React.forwardRef<HTMLDivElement, ICardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/**
 * 卡片底部Props接口
 */
export interface ICardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片底部组件
 */
const CardFooter = React.forwardRef<HTMLDivElement, ICardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
