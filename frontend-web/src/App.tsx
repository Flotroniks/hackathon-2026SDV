import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';

export default function App() {
  return (
    <div data-theme="carbon" className="min-h-screen bg-base-200 text-base-content">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}
