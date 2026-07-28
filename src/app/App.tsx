import { useState } from "react";
import { HomePage } from "@/features/home/pages/HomePage";
import { MockupToolPage } from "@/features/mockup-tool/pages/MockupToolPage";

export type AppPage = "home" | "tool";

export function App() {
  const [page, setPage] = useState<AppPage>("home");

  if (page === "tool") {
    return <MockupToolPage onGoHome={() => setPage("home")} />;
  }

  return <HomePage onLaunchTool={() => setPage("tool")} />;
}
