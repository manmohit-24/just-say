"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeClosed } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

type TextFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string | undefined;
  // shown under the input while there is no error
  hint?: ReactNode;
};

// Label, input and error message in one piece. type="password" gets a show/hide button.
const TextField = ({ label, error, hint, type = "text", ...inputProps }: TextFieldProps) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && isVisible ? "text" : type}
          aria-invalid={!!error}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setIsVisible((visible) => !visible)}
          >
            {isVisible ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>
      {error ? <FieldError>{error}</FieldError> : hint}
    </Field>
  );
};

export { TextField };
