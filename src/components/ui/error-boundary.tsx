import React, { Component, ErrorInfo, ReactNode } from "react";

/**
 * 错误边界Props接口
 */
interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 错误边界状态接口
 */
interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件，捕获子组件中的JavaScript错误
 */
class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("组件错误:", error, errorInfo);
    // 这里可以添加错误日志上报逻辑
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 自定义降级UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-800 bg-opacity-20 border border-red-600 rounded-md">
          <h2 className="text-lg font-bold text-red-400">组件出错了</h2>
          <p className="text-sm text-gray-300">
            {this.state.error?.message || "发生未知错误"}
          </p>
          <button
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
