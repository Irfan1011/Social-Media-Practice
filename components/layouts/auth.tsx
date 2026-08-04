import Link from "next/link";

import { Card, CardContent } from "@components/ui/card";
import {
  Field,
  FieldTitle,
  FieldContent,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import LoginWithGoogle from "@components/email/loginWithGoogle";
import { Button } from "@components/ui/button";

type AuthLayoutProps = {
  title: "sign in" | "sign up";
  children: React.ReactNode;
};

function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <section className="w-[85%] h-full place-content-center  capitalize">
      <Card className="w-full">
        <CardContent>
          <Field>
            <FieldTitle>{title}</FieldTitle>
            <FieldSeparator />
            <FieldContent className="gap-2">
              <FieldGroup>
                {children}
                <FieldGroup className="flex-row justify-between items-center text-xs md:text-sm">
                  <LoginWithGoogle />
                  <Button
                    variant="link"
                    className="p-0 w-fit"
                    style={{ textWrap: "wrap" }}
                  >
                    <Link
                      href="/forget-password"
                      className="text-xs md:text-sm"
                    >
                      Forget Password
                    </Link>
                  </Button>
                </FieldGroup>
              </FieldGroup>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </section>
  );
}

export default AuthLayout;
