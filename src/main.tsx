import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { AdminProvider } from "../src/context/AdminContext"
import ScrollToTop from './components/common/ScrollToTop.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <ScrollToTop />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
    </React.StrictMode>


);
