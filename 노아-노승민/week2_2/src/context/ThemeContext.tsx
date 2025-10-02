import { createContext,useState, ReactNode } from "react";


//사용할 테마타입 정의
type Theme = "light" | "dark"

//context가 제공할 값의 타입 정의
interface ThemeContextType{
  theme:Theme;
  toggleTheme: () => void;
}

//context 생성(초깃값은  null)
export const ThemeContext = createContext<ThemeContextType | null>(null)

//provider 컴포넌트
export const ThemeProvider=({ children } : { children: ReactNode}) =>{

  const [theme,setTheme]= useState<Theme>("light")

  const toggleTheme= ()=>{
    setTheme((prev)=>(prev=== "light" ? "dark" : "light"))
  }

  return(
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      <div className="theme">
        {children}
      </div>

    </ThemeContext.Provider>
  )










}