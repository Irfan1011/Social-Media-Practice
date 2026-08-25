"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useRef, useState } from "react";
import { ImageUp, Video, Send } from "lucide-react";

import { addFeed } from "@actions/feed";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@components/ui/button";

function Page() {
  const [state, dispatchAction, isLoading] = useActionState(addFeed, {
    status: 200,
    message: "",
    data: [],
  });
  const imageRef = useRef<HTMLInputElement>(null);
  const [pickedImage, setPickedImage] = useState<File[]>([]);

  const handleSelectImage = () => {
    imageRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const newFiles = Array.from(files);

    setPickedImage((prev) => [...prev, ...newFiles]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldContent>
            <form action={dispatchAction}>
              {/* POST DESCRIPTION */}
              <textarea
                name="description"
                placeholder="What's In Your Mind?"
                rows={4}
                className="border rounded-md p-4 w-full"
              />
              {state.status !== 200 && (
                <FieldError className="px-4">{state.message}</FieldError>
              )}

              {/* BUTTON SELECT IMAGE OR VIDEO */}
              <FieldGroup className="flex flex-row justify-between">
                <FieldGroup className="flex-row gap-4 w-full">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleSelectImage}
                  >
                    <ImageUp />
                  </Button>
                  <Button variant="outline" className="cursor-pointer">
                    <Video />
                  </Button>
                </FieldGroup>
                <Button
                  type="submit"
                  variant="ghost"
                  className={
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }
                  disabled={isLoading ? true : false}
                  onClick={() => setPickedImage([])}
                >
                  <Send />
                </Button>
              </FieldGroup>

              {/* IMAGE PREVIEW */}
              <FieldGroup>
                <input
                  type="file"
                  name="images"
                  ref={imageRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                />
                {pickedImage && (
                  <div className="flex gap-4 flex-wrap">
                    {pickedImage.map((img) => (
                      <Image
                        key={img.name}
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        width={150}
                        height={150}
                        className="my-4"
                      />
                    ))}
                  </div>
                )}
              </FieldGroup>
            </form>
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}

export default Page;
