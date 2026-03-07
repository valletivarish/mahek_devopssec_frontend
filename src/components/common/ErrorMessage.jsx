/**
 * Reusable error message component for displaying API errors or validation failures.
 * Shows a red alert box with the error message text.
 */
function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default ErrorMessage;
