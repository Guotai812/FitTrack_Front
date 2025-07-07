type formProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Form({ children, title }: formProps) {
  return (
    <form className="flex flex-col gap-10">
      <h2 className="text-2xl">{title}</h2>
      {children}
    </form>
  );
}
