import Image from "next/image";
import { Plus, ImageUp, Smile, Send } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import Link from "next/link";

export default function Home() {
  return (
    <section className="grid md:grid-cols-[minmax(70%,1fr)_1fr] gap-8 min-w-full min-h-full mt-17 justify-items-center">
      {/* LEFT */}
      <article className="flex flex-col gap-4 w-full">
        {/* STORIES */}
        <Card>
          <CardHeader>
            <CardTitle>Stories</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4 overflow-x-scroll scrollbar-none">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full cursor-pointer min-w-25 min-h-25"
            >
              <Link href="">
                <Plus />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full cursor-pointer min-w-25 min-h-25 relative"
            >
              {/* <Image
                src=""
                alt="tes"
                fill
                className="rounded-full border p-4"
              /> */}
            </Button>
          </CardContent>
        </Card>

        {/* ADD FEED */}
        <Card>
          <CardHeader>
            <CardTitle>What's In Your Mind?</CardTitle>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldContent>
                <textarea
                  name=""
                  id=""
                  placeholder="tes"
                  rows={4}
                  className="border rounded-md p-4"
                />
                <FieldError className="px-4">error</FieldError>
                <FieldGroup className="flex flex-row justify-between">
                  <FieldGroup className="flex-row gap-4 w-full">
                    <Button variant="outline" className="cursor-pointer">
                      <ImageUp />
                    </Button>
                    <Button variant="outline" className="cursor-pointer">
                      <Smile />
                    </Button>
                  </FieldGroup>
                  <Button variant="ghost" className="cursor-pointer">
                    <Send />
                  </Button>
                </FieldGroup>
              </FieldContent>
            </Field>
          </CardContent>
        </Card>

        {/* FEED */}
        <Card>
          <CardHeader>
            <CardTitle>Feed</CardTitle>
          </CardHeader>
          <CardContent className="place-items-center">
            <div className="relative w-[50%] aspect-square">
              {/* <Image src="" alt="" fill /> */}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            {/* BUTTONS */}
            <div>buttons</div>

            {/* COMMENT */}
            <div>comment</div>
          </CardFooter>
        </Card>
      </article>

      {/* RIGHT */}
      <article className="hidden md:block w-full">
        <Card className="sticky top-[12%]">
          <CardFooter>tes</CardFooter>
        </Card>
      </article>
    </section>
  );
}
