import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './css/theme.css';
import './css/index.css';
import Login from './component/Login';
import CourseMain from './component/CourseMain';
import reportWebVitals from './reportWebVitals';
import AuthCheck from './component/AuthCheck';
import VisualizerPage from './features/visualizer/VisualizerPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/auth' element={<AuthCheck />} />
      <Route path='/courseMain' element={<CourseMain />} />
      <Route path='/freespace' element={<VisualizerPage />} />
    </Routes>
  </BrowserRouter>  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
