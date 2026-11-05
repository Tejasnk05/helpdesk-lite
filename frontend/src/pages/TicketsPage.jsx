import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listTickets } from '../api';
import CreateTicketForm from '../components/CreateTicketForm';
import ErrorBox from '../components/ErrorBox';
import { STATUSES, label } from '../constants';
import { useFetch } from '../hooks/useFetch';

export default function TicketsPage() {
  // The status filter lives in the URL (?status=open), not in useState.
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStatus = searchParams.get('status');
  const status = STATUSES.includes(rawStatus) ? rawStatus : ''; // ignore junk like ?status=bogus

  // The tickets list lives here: this page is the only place that shows it.
  const fetchTickets = useCallback(() => listTickets(status), [status]);
  const { data: tickets, loading, error, reload } = useFetch(fetchTickets);

  function handleFilterChange(event) {
    const value = event.target.value;
    setSearchParams(value ? { status: value } : {});
  }

  return (
    <>
      <CreateTicketForm onCreated={reload} />

      <section>
        <div className="section-header">
          <h2>Tickets</h2>
          <label className="inline">
            Status
            <select value={status} onChange={handleFilterChange}>
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p>Loading tickets…</p>}
        {!loading && error && <ErrorBox message={error.message} onRetry={reload} />}
        {!loading && !error && tickets && tickets.length === 0 && (
          <p>{status ? `No ${label(status).toLowerCase()} tickets.` : 'No tickets yet. Create the first one above.'}</p>
        )}
        {!loading && !error && tickets && tickets.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/tickets/${t.id}`}>{t.title}</Link>
                  </td>
                  <td>
                    <span className={`badge priority-${t.priority}`}>{label(t.priority)}</span>
                  </td>
                  <td>
                    <span className="badge">{label(t.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}