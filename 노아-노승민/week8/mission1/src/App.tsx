import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import HomeLayout from "./layouts/HomeLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LpDetailPage from "./pages/LpDetailPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <ProtectedLayout />, 
        children: [
          { path: "lp/:lpid", element: <LpDetailPage /> },
          { path: "me", element: <MyPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
