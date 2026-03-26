/**
 * Badge
 * Coloured pill label for recipe categories.
 * CSS class is derived from the category name (lowercase, spaces → hyphens).
 */
export default function Badge({ label }) {
  if (!label) return null
  const cls = label.toLowerCase().replace(/\s+/g, '-')
  return <span className={`badge badge--${cls}`}>{label}</span>
}
