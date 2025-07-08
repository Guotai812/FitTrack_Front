type formProps = {
  children: React.ReactNode;
  title?: string;
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({ children, title, ...rest }: formProps) {
  return (
    <form className="flex flex-col gap-10" {...rest}>
      <h2 className="text-2xl">{title}</h2>
      {children}
    </form>
  );
}
