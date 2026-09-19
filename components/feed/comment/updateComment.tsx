"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { type CommentProps } from "./commentLists";
import { updateComment } from "@actions/feed";
import { Field, FieldContent, FieldError } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type UpdateCommentProps = {
  comment: CommentProps;
  onSetComments: React.Dispatch<
    React.SetStateAction<{ count: number; comments: CommentProps[] }>
  >;
  onEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateComment({
  comment,
  onEditing,
  onSetComments,
}: UpdateCommentProps) {
  const [state, dispatchAction, isLoading] = useActionState(
    updateComment,
    null,
  );

  useEffect(() => {
    if (state?.status !== 200) return;
    onSetComments((prev) => {
      return {
        ...prev,
        comments: prev.comments.map((c) =>
          c.id === state.comment.id ? state.comment : c,
        ),
      };
    });

    onEditing((prev) => !prev);
  }, [state, onEditing, onSetComments]);

  return (
    <Form action={dispatchAction}>
      <Field>
        <FieldContent className="relative mt-2 ms-8 max-w-70">
          <input type="hidden" name="commentId" value={comment.id} />
          <Textarea
            name="comment"
            autoFocus
            defaultValue={comment.comment}
            disabled={isLoading}
          />
          {state && <FieldError>{state.message}</FieldError>}
          <Button
            type="submit"
            variant="ghost"
            className="absolute right-0 bottom-0 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className="animate-spin" /> : <Send />}
          </Button>
        </FieldContent>
      </Field>
    </Form>
  );
}

export default UpdateComment;
