import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Login from './component/Login';
import CourseMain from './component/CourseMain';
import AuthCheck from './component/AuthCheck';
import VisualizerPage from './features/visualizer/VisualizerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<AuthCheck />} />
        <Route path="/courseMain" element={<CourseMain />} />
        <Route path="/freespace" element={<VisualizerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
