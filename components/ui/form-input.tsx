"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

import { FieldGroup, FieldLabel } from "./field";
import { Button } from "./button";

type FormInputEmailProps = {
  defaultValue?: string;
};

export function FormInputEmail({ defaultValue }: FormInputEmailProps) {
  return (
    <FieldGroup className="gap-0 relative">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <input
        type="email"
        name="email"
        className="border rounded-md p-2"
        defaultValue={defaultValue}
        placeholder="example@example.com"
        required
      />
    </FieldGroup>
  );
}

type FormInputPasswordProps = {
  text: string;
  defaultValue?: string;
};

export function FormInputPassword({
  text,
  defaultValue,
}: FormInputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FieldGroup className="gap-0 relative">
      <FieldLabel htmlFor="password">{text}</FieldLabel>
      <input
        type={showPassword ? "text" : "password"}
        name={text}
        className="border rounded-md p-2"
        placeholder={showPassword ? "Password" : "********"}
        defaultValue={defaultValue}
        required
      />
      <Button
        variant="ghost"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-0 top-[35%]"
        type="button"
      >
        {showPassword ? <Eye /> : <EyeClosed />}
      </Button>
    </FieldGroup>
  );
}

type FormInputProps = {
  name: string;
  defaultValue?: string;
};

export function FormInput({ name, defaultValue }: FormInputProps) {
  return (
    <FieldGroup className="gap-0 relative">
      <FieldLabel htmlFor={name} className="capitalize">
        {name}
      </FieldLabel>
      <input
        type="text"
        name={name}
        className="border rounded-md p-2"
        placeholder={name}
        defaultValue={defaultValue}
        required
      />
    </FieldGroup>
  );
}
