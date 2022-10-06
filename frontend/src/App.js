import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import React from 'react';
import './App.css';

import Landing from './pages/Landing';
import Table from './pages/customer/Table';
import Menu from './pages/customer/Menu';
import Order from './pages/customer/Order';
import Game from './pages/customer/Game';

import Login from './pages/staff/Login';
import Kitchen from './pages/staff/Kitchen';
import Wait from './pages/staff/Wait';
import Manager from './pages/staff/Manager';
import NewItem from './pages/staff/NewItem';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import QuizNew from './pages/QuizNew';
// import QuizEdit from './pages/QuizEdit';
// import QuestionAdd from './pages/QuestionAdd';
// import QuestionEdit from './pages/QuestionEdit';
// import PlayAdmin from './pages/PlayAdmin';
// import PlayParticipant from './pages/PlayParticipant';
// import PlayResults from './pages/PlayResults';
// import Play from './pages/Play';

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/customer/table' element={<Table />} />
          <Route exact path='/customer/menu' element={<Menu />} />
          <Route exact path='/customer/game' element={<Game />} />
          <Route exact path='/customer/order' element={<Order />} />
          <Route exact path='/staff/login' element={<Login />} />
          <Route exact path='/staff/kitchen' element={<Kitchen />} />
          <Route exact path='/staff/wait' element={<Wait />} />
          <Route exact path='/staff/manager' element={<Manager />} />
          <Route exact path='/staff/manager/item/new' element={<NewItem />} />
          {/* <Route exact path='/' element={<Welcome />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/quiz/new' element={<QuizNew />} />
          <Route path='/quiz/edit/:quizid' element={<QuizEdit />} />
          <Route path='/quiz/edit/:quizid/add' element={<QuestionAdd />} />
          <Route path='/quiz/edit/:quizid/:index' element={<QuestionEdit />} />
          <Route path='/quiz/play/:quizid/:sessionid' element={<PlayAdmin />} />
          <Route path='/play/join/:quizid/:sessionid' element={<PlayParticipant />} />
          <Route path='/play/:name/:quizid/:sessionid' element={<Play />} />
          <Route path='/play/results/:quizid/:sessionid' element={<PlayResults />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
