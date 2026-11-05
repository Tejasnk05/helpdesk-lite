import { Link, Route, Routes } from 'react-router-dom';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketsPage from './pages/TicketsPage';

function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Back to tickets</Link>
    </>
  );
}

export default function App() {
  return (
    <div className="container">
      <header>
        <Link to="/" className="brand">
          Helpdesk Lite
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}