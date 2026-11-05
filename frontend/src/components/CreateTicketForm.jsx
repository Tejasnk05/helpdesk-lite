import { useState } from 'react';
import { createTicket } from '../api';
import { PRIORITIES, label } from '../constants';
import ErrorBox from './ErrorBox';

const EMPTY_FORM = { title: '', description: '', priority: 'medium' };

// `onCreated` is called after a successful POST so the parent can refresh its list.
export default function CreateTicketForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's own full-page form submit
    setSubmitting(true);
    setError(null);

    const payload = { title: form.title, priority: form.priority };
    const description = form.description.trim();
    if (description) payload.description = description; // omit it when empty

    try {
      await createTicket(payload);
      setForm(EMPTY_FORM);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New ticket</h2>
      <fieldset disabled={submitting}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} maxLength={200} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {label(p)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{submitting ? 'Creating…' : 'Create ticket'}</button>
      </fieldset>
      {error && <ErrorBox message={error} />}
    </form>
  );
}