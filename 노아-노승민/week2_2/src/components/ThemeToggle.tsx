import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle(){
  const themeCtx= useContext(ThemeContext)
  if(!themeCtx) return null

  const {theme, toggleTheme}= themeCtx

  return(
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme=== "light" ? "다크 모드" :"라이트 모드"}
    </button>
  )
}

export default ThemeToggle;