"use client";

import Link from "next/link";
import React, { startTransition, useState } from "react";
import { Pencil, Trash } from "lucide-react";

import { type CommentProps } from "./commentLists";
import { shortDateTimeFormatter } from "@/lib/utils";
import { deleteComment } from "@actions/feed";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import UpdateComment from "./updateComment";

type CommentListProps = {
  comment: CommentProps;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  username?: string;
  getReplies: (parentId: string) => CommentProps[];
  onAddReply: React.Dispatch<string>;
  onSetParentId: React.Dispatch<string>;
};

function CommentList({
  comment,
  user,
  username,
  onAddReply,
  onSetParentId,
  getReplies,
}: CommentListProps) {
  const [showReply, setShowReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const childComponents = getReplies(comment.id) ?? [];

  const handleDeleteComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await deleteComment(formData);
    });
  };

  const handleAddReply = () => {
    onAddReply(`@${user.username}`);
    onSetParentId(comment.id);
  };

  const handleShowReplies = () => {
    setShowReply(true);
  };

  const repliesLineStyles =
    "before:border-l before:border-secondary before:h-full before:absolute before:top-9 before:left-4";

  return (
    <section
      className={`${comment.parentId && "ms-8"} mt-2 overflow-clip relative ${repliesLineStyles}`}
    >
      <Link
        href={`/${user.username}`}
        className="w-fit flex items-center gap-2"
      >
        <Avatar>
          <AvatarImage src={user.image as string} alt={user.username} />
          <AvatarFallback className="uppercase">
            {user.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p>{user.username}</p>
      </Link>

      {isEditing ? (
        <UpdateComment comment={comment} onEditing={setIsEditing} />
      ) : (
        <p className="px-10">{comment.comment}</p>
      )}

      <div className="flex justify-start items-center px-10 text-xs">
        <p className="text-stone-500">
          {shortDateTimeFormatter.format(comment.createdAt)}
        </p>
        {username && (
          <Button
            variant="link"
            className="capitalize text-xs cursor-pointer"
            onClick={handleAddReply}
          >
            reply
          </Button>
        )}
        {user.username === username && (
          <div className="flex gap-2">
            <Button
              variant="link"
              className="p-0 cursor-pointer"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Pencil />
            </Button>
            <form onSubmit={handleDeleteComment}>
              <input type="hidden" name="commentId" value={comment.id} />
              <Button
                type="submit"
                variant="link"
                className="p-0 cursor-pointer"
              >
                <Trash className="text-red-500" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {childComponents.length > 0 && (
        <Button
          variant="link"
          className={`w-full h-fit text-xs capitalize cursor-pointer ${showReply && "hidden"}`}
          onClick={handleShowReplies}
        >
          View More Replies
        </Button>
      )}
      {showReply &&
        childComponents.map(
          (reply) =>
            reply.parentId === comment.id && (
              <CommentList
                key={reply.id}
                comment={reply}
                user={reply.user}
                username={username}
                onAddReply={onAddReply}
                onSetParentId={onSetParentId}
                getReplies={getReplies}
              />
            ),
        )}
    </section>
  );
}

export default CommentList;
