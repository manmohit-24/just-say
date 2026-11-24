import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import { ApiError, getErrorMessage } from "@/shared/api";

// Shows an API error on a form: field errors go under their input, anything else
// goes to form.formState.errors.root.
const setFormError = <T extends FieldValues>(form: UseFormReturn<T>, error: unknown) => {
  let hasFieldError = false;

  if (error instanceof ApiError) {
    for (const [field, message] of Object.entries(error.fields ?? {})) {
      if (field in form.getValues()) {
        form.setError(field as FieldPath<T>, { message });
        hasFieldError = true;
      }
    }
  }

  if (!hasFieldError) form.setError("root", { message: getErrorMessage(error) });
};

export { setFormError };
