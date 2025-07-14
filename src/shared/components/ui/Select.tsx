type SelectProps = {
  name: string;
  label: string;
  items: string[];
  isValid: boolean;
  isTouched: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  name,
  label,
  items,
  isValid,
  isTouched,
  ...rest
}: SelectProps) {
  return (
    <div className="h-10">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        name={name}
        id={name}
        {...rest}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select an option --</option>
        {items.map((item) => (
          <option key={item} value={item.toLowerCase()}>
            {item}
          </option>
        ))}
      </select>
      {!isValid && isTouched && (
        <p className="text-sm text-red-500">You need to choose one option</p>
      )}
    </div>
  );
}
