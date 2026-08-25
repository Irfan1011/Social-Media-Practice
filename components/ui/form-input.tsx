"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

import { FieldGroup, FieldLabel } from "./field";
import { Button } from "./button";

type FormInputFieldProps = {
  type: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  isDisabled?: boolean;
};

export function FormInput({
  type,
  name,
  defaultValue,
  placeholder,
  isDisabled,
}: FormInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FieldGroup className="gap-0 relative">
      <FieldLabel htmlFor="password" className="capitalize">
        {name}*
      </FieldLabel>
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        name={name}
        className="border rounded-md p-2"
        placeholder={
          type === "password"
            ? showPassword
              ? placeholder
              : "********"
            : placeholder
        }
        defaultValue={defaultValue}
        disabled={isDisabled}
        required
      />
      {type === "password" && (
        <Button
          variant="ghost"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-0 top-[35%]"
          type="button"
        >
          {showPassword ? <Eye /> : <EyeClosed />}
        </Button>
      )}
    </FieldGroup>
  );
}

type FormAreaFieldProps = {
  name: string;
  placeholder: string;
  defaultValue?: string;
};

export function FormArea({
  name,
  placeholder,
  defaultValue,
}: FormAreaFieldProps) {
  return (
    <FieldGroup className="gap-0">
      <FieldLabel htmlFor={name} className="capitalize">
        {name}*
      </FieldLabel>
      <textarea
        name={name}
        id={name}
        placeholder={placeholder}
        rows={5}
        className="border rounded-md p-2"
        defaultValue={defaultValue}
      />
    </FieldGroup>
  );
}
