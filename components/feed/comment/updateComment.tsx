"use client";

import { Dispatch, startTransition, useActionState } from "react";
import { LoaderCircle, Send } from "lucide-react";

import { type CommentProps } from "./commentLists";
import { updateComment } from "@actions/feed";
import { Field, FieldContent, FieldError } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type UpdateCommentProps = {
  comment: CommentProps;
  onEditing: Dispatch<React.SetStateAction<boolean>>;
};

function UpdateComment({ comment, onEditing }: UpdateCommentProps) {
  const [state, dispatchAction, isLoading] = useActionState(
    updateComment,
    null,
  );

  const handleUpdateComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      dispatchAction(formData);

      onEditing((prev) => !prev);
    });
  };

  return (
    <form onSubmit={handleUpdateComment}>
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
    </form>
  );
}

export default UpdateComment;
