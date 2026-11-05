// Must match the values the backend accepts.
export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUSES = ['open', 'in_progress', 'resolved'];

// "in_progress" -> "In progress"
export function label(value) {
  const text = value.replace('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}