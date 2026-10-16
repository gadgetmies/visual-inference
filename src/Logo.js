export default function Logo({ size = 28 }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
    >
      <circle cx="6" cy="14" r="4" />
      <circle cx="22" cy="7" r="4" />
      <circle cx="22" cy="21" r="4" />
      <path d="M10 13l8-4M10 15l8 4" />
    </svg>
  );
}
