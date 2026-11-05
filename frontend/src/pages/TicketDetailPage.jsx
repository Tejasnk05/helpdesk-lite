import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteTicket, getTicket, updateTicket } from '../api';
import Comments from '../components/Comments';
import ErrorBox from '../components/ErrorBox';
import { PRIORITIES, STATUSES, label } from '../constants';
import { useFetch } from '../hooks/useFetch';

export default function TicketDetailPage() {
  const { id } = useParams(); // from the URL: /tickets/:id
  const navigate = useNavigate();

  const fetchTicket = useCallback(() => getTicket(id), [id]);
  const { data: ticket, setData: setTicket, loading, error, reload } = useFetch(fetchTicket);

  const [busy, setBusy] = useState(false); // true while a PATCH or DELETE is running
  const [actionError, setActionError] = useState(null);

  async function handleChange(field, value) {
    setBusy(true);
    setActionError(null);
    try {
      const updated = await updateTicket(ticket.id, { [field]: value });
      setTicket(updated); // trust the server's version of the ticket
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this ticket and all its comments?')) return;
    setBusy(true);
    setActionError(null);
    try {
      await deleteTicket(ticket.id);
      navigate('/');
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
    }
  }

  if (loading) return <p>Loading ticket…</p>;

  if (error) {
    return (
      <>
        <Link to="/">← All tickets</Link>
        {error.status === 404 ? (
          <p>This ticket doesn’t exist (it may have been deleted).</p>
        ) : (
          <ErrorBox message={error.message} onRetry={reload} />
        )}
      </>
    );
  }

  return (
    <>
      <Link to="/">← All tickets</Link>

      <article>
        <h1>{ticket.title}</h1>
        <p className="muted">
          Created {new Date(ticket.created_at).toLocaleString()} · Updated{' '}
          {new Date(ticket.updated_at).toLocaleString()}
        </p>
        <p>{ticket.description ?? <em>No description.</em>}</p>

        <div className="controls">
          <label className="inline">
            Status
            <select value={ticket.status} disabled={busy} onChange={(e) => handleChange('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="inline">
            Priority
            <select
              value={ticket.priority}
              disabled={busy}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {label(p)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="danger" disabled={busy} onClick={handleDelete}>
            Delete ticket
          </button>
        </div>
        {actionError && <ErrorBox message={actionError} />}
      </article>

      {/* key makes React start with a fresh Comments component (empty form) for each ticket */}
      <Comments key={ticket.id} ticketId={ticket.id} />
    </>
  );
}