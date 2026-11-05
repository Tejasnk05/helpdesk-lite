import { useCallback, useState } from 'react';
import { createComment, listComments } from '../api';
import { useFetch } from '../hooks/useFetch';
import ErrorBox from './ErrorBox';

export default function Comments({ ticketId }) {
  // The comments list belongs to this component only, so its state lives here.
  const fetchComments = useCallback(() => listComments(ticketId), [ticketId]);
  const { data: comments, setData: setComments, loading, error, reload } = useFetch(fetchComments);

  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const created = await createComment(ticketId, body);
      // The API returns the saved comment; the list is newest-first, so put it on top.
      setComments((previous) => [created, ...(previous ?? [])]);
      setBody('');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Comments</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <label>
            Add a comment
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} required />
          </label>
          <button type="submit">{submitting ? 'Posting…' : 'Post comment'}</button>
        </fieldset>
        {formError && <ErrorBox message={formError} />}
      </form>

      {loading && <p>Loading comments…</p>}
      {!loading && error && <ErrorBox message={error.message} onRetry={reload} />}
      {!loading && !error && comments && comments.length === 0 && <p>No comments yet.</p>}
      {!loading && !error && comments && comments.length > 0 && (
        <ul className="comments">
          {comments.map((c) => (
            <li key={c.id}>
              <p>{c.body}</p>
              <small>{new Date(c.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}