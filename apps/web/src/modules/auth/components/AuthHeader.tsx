import { FieldError } from "@/shared/components/ui/field";

type AuthHeaderProps = {
  title: string;
  description?: string;
  // form level error (for example "Invalid credentials")
  error?: string | undefined;
};

const AuthHeader = ({ title, description, error }: AuthHeaderProps) => (
  <div className="text-center">
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{title}</h1>
    {description && <p className="mb-4">{description}</p>}
    {error && <FieldError>{error}</FieldError>}
  </div>
);

export { AuthHeader };
