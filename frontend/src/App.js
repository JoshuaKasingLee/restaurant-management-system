import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import React from 'react';
import './App.css';
// theme
import ThemeProvider from './theme';

import Landing from './pages/Landing';
import Table from './pages/customer/Table';
import Tab from './pages/customer/Tab';
import Menu from './pages/customer/Menu';
import Game from './pages/customer/Game';
import Order from './pages/customer/Order';
import Bill from './pages/customer/Bill';

import Login from './pages/staff/Login';
import Kitchen from './pages/staff/Kitchen';
import Wait from './pages/staff/Wait';
import Manager from './pages/staff/Manager';

function App () {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/customer/table' element={<Table />} />
          <Route exact path='/customer/tab' element={<Tab />} />
          <Route exact path='/customer/menu' element={<Menu />} />
          <Route exact path='/customer/game' element={<Game />} />
          <Route exact path='/customer/order' element={<Order />} />
          <Route exact path='/customer/bill' element={<Bill />} />
          <Route exact path='/staff/login' element={<Login />} />
          <Route exact path='/staff/kitchen' element={<Kitchen />} />
          <Route exact path='/staff/wait' element={<Wait />} />
          <Route exact path='/staff/manager' element={<Manager />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
