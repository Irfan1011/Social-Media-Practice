"use client";

import { ChangeEvent, useRef } from "react";
import { PlusIcon, Camera } from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@components/ui/avatar";
import { updateUserImage } from "@actions/auth";

type UpdateProfileImageProps = {
  userImage: string;
  username: string;
  isSessionUser: boolean;
};

function UpdateProfileImage({
  userImage,
  username,
  isSessionUser,
}: UpdateProfileImageProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImage = () => {
    imageInputRef.current?.click();
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form action={updateUserImage}>
      <input
        type="file"
        name="image"
        ref={imageInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleChangeImage}
      />
      <button type="button" onClick={handleSelectImage}>
        <Avatar
          className={`group min-w-15 min-h-15 md:min-w-25 md:min-h-25 ${isSessionUser && "hover:after:bg-primary cursor-pointer"}`}
        >
          <AvatarImage src={userImage as string} alt={username} />
          <AvatarFallback className="text-4xl">
            {username.charAt(0)}
          </AvatarFallback>
          {isSessionUser && (
            <>
              <AvatarBadge className="md:bottom-2 md:right-2 z-0">
                <PlusIcon />
              </AvatarBadge>
              <span
                className="hidden group-hover:block absolute top-[50%] left-[50%]"
                style={{ transform: "translate(-50%,-50%)" }}
              >
                <Camera />
              </span>
            </>
          )}
        </Avatar>
      </button>
    </form>
  );
}

export default UpdateProfileImage;
