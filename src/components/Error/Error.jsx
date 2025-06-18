import './Error.css';

export const Error = ({ text }) => {
  return (
    <div className="error">
      <p className="text-error">{text}</p>
    </div>
  )
}