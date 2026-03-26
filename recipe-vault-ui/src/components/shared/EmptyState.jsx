/**
 * EmptyState
 * Displayed when a list has no items to show.
 *
 * Props:
 *   icon    {string}    - emoji icon
 *   title   {string}    - heading
 *   desc    {string}    - supporting text
 *   action  {ReactNode} - optional CTA button
 */
export default function EmptyState({ icon = '🍽️', title, desc, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      {title && <h3 className="empty-state__title">{title}</h3>}
      {desc  && <p  className="empty-state__desc">{desc}</p>}
      {action}
    </div>
  )
}
