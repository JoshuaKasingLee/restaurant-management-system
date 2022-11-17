import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ThemeProvider from './theme';

import Landing from './pages/Landing';
import Table from './pages/customer/Table';
import Budget from './pages/customer/Budget';
import Menu from './pages/customer/Menu';
import Game from './pages/customer/Game';
import Order from './pages/customer/Order';
import Bill from './pages/customer/Bill';

import MenuEditor from './pages/staff/MenuEditor';
import Settings from './pages/staff/Settings';
import Entertainment from './pages/staff/Entertainment';

import Login from './pages/staff/Login';
import Kitchen from './pages/staff/Kitchen';
import Wait from './pages/staff/Wait';
import AlertPopup from './utilities/AlertPopup';

function App () {
  return (
    <ThemeProvider>
      <AlertPopup />
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/customer/table' element={<Table />} />
          <Route exact path='/customer/budget' element={<Budget />} />
          <Route exact path='/customer/menu' element={<Menu />} />
          <Route exact path='/customer/game' element={<Game />} />
          <Route exact path='/customer/order' element={<Order />} />
          <Route exact path='/customer/bill' element={<Bill />} />
          <Route exact path='/staff/login' element={<Login />} />
          <Route exact path='/staff/kitchen' element={<Kitchen />} />
          <Route exact path='/staff/wait' element={<Wait />} />
          <Route exact path='/staff/manager/menuEditor' element={<MenuEditor />} />
          <Route exact path='/staff/manager/settings' element={<Settings />} />
          <Route exact path='/staff/manager/entertainment' element={<Entertainment />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;