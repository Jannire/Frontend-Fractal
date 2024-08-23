import { StrictMode, React } from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Route, Routes } from 'react-router-dom';

import Home from "./components/Home"
import MyOrdersPage from './components/MyOrdersPage';
import OrderPage from './components/OrderPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log("Hello");
root.render(
  <StrictMode>
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/add-order/:id?" element={<OrderPage />} />
      </Routes>
    </BrowserRouter >
  </StrictMode>,
);
