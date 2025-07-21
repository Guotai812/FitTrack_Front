type formProps = {
  children: React.ReactNode;
  title?: string;
  isStyled?: boolean;
} & React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({
  children,
  title,
  isStyled = true,
  ...rest
}: formProps) {
  return (
    <form className={isStyled ? "flex flex-col gap-10" : ""} {...rest}>
      <h2 className={isStyled ? "text-2xl" : ""}>{title}</h2>
      {children}
    </form>
  );
}
