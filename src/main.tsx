import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { AdminProvider } from "./context/AdminContext.ts"
import ScrollToTop from './components/common/ScrollToTop.tsx';
import ReactDOM from 'react-dom/client';

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
