export default function Loader({ message = 'Casting your line...' }) {
  return (
    <div className="loader-wrap">
      <div className="bobber" />
      <p>{message}</p>
    </div>
  );
}
