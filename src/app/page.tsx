import { redirect } from "next/navigation";

export default function Home() {
  // 重定向到游戏主页
  redirect("/game");
}
