"use client";

import Form from "next/form";
import { redirect } from "next/navigation";
import {
  useActionState,
  useOptimistic,
  startTransition,
  useState,
  useMemo,
  useEffect,
} from "react";
import { LoaderCircle, MessageCircle, Send } from "lucide-react";

import { type FeedsProps } from "@/app/(home)/@feed/page";
import { addComment } from "@actions/feed";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@components/ui/dialog";
import { Field, FieldContent, FieldError } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import CommentList from "./commentList";

export type CommentProps = {
  comment: string;
  id: string;
  parentId: string | null;
  postId: string;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  createdAt: Date;
};

type CommentListsProps = {
  feed: FeedsProps;
  username?: string;
};

function CommentLists({ feed, username }: CommentListsProps) {
  const [state, dispatchAction, isLoading] = useActionState(
    addComment,
    undefined,
  );
  const [comments, setComments] = useState({
    count: feed._count.comment,
    comments: feed.comment,
  });
  const [optimisticState, setOptimistic] = useOptimistic(
    comments,
    (prev, action: "addComment" | "removeComment") => {
      if (action === "addComment") {
        return {
          ...prev,
          count: prev.count + 1,
        };
      } else if (action === "removeComment") {
        return {
          ...prev,
          count: prev.count - 1,
        };
      }
      return {
        ...prev,
      };
    },
  );
  const [reply, setReply] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (state?.status !== 200) return;

    setComments((prev) => {
      return { ...prev, comments: [...prev.comments, state.comment] };
    });
  }, [state]);

  const handleAddcomment = () => {
    if (!username) return redirect("/signin");
    startTransition(() => {
      setOptimistic("addComment");
      setComments((prev) => {
        return {
          ...prev,
          count: prev.count + 1,
        };
      });
      setReply("");
    });
  };

  const commentWithParentId = useMemo(() => {
    const group: Record<string, CommentProps[]> = {};

    optimisticState.comments.forEach((comment) => {
      if (comment.parentId === null) return;

      if (!group[comment.parentId]) {
        group[comment.parentId] = [];
      }

      group[comment.parentId].push(comment);
    });

    return group;
  }, [optimisticState.comments]);

  const getReplies = (parentId: string) => {
    return commentWithParentId[parentId];
  };

  return (
    <span className="flex items-center">
      {optimisticState.count}
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className="rounded-full cursor-pointer"
              onClick={() => setReply("")}
            >
              <MessageCircle />
            </Button>
          }
        />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>Feed Comment</DialogDescription>
            <section className="w-full max-h-100 overflow-y-scroll scrollbar-thin">
              {optimisticState.comments
                .filter((comment) => comment.parentId === null)
                .map((comment) => (
                  <CommentList
                    key={comment.id}
                    comment={comment}
                    user={comment.user}
                    username={username}
                    onSetComments={setComments}
                    onAddReply={setReply}
                    onSetParentId={setParentId}
                    getReplies={getReplies}
                  />
                ))}
            </section>
          </DialogHeader>

          <DialogFooter>
            <Form action={dispatchAction} className="w-full">
              <Field>
                <FieldContent className="relative">
                  <Textarea
                    id={
                      state?.status !== 200
                        ? "textarea-invalid"
                        : "textarea-message"
                    }
                    name="comment"
                    placeholder={
                      reply.length > 0 ? `Reply to ${reply}` : "Add Comment"
                    }
                    defaultValue={reply.length > 0 ? reply : ""}
                    autoFocus
                    maxLength={255}
                    disabled={isLoading || !username}
                  />
                  {state?.status !== 200 && (
                    <FieldError>{state?.message}</FieldError>
                  )}
                  <input type="hidden" name="feedId" value={feed.id} />
                  {reply.length > 0 && (
                    <input type="hidden" name="parentId" value={parentId} />
                  )}
                  <Button
                    type="submit"
                    variant="ghost"
                    className="absolute right-0 bottom-0 cursor-pointer"
                    disabled={isLoading || !username}
                    onClick={handleAddcomment}
                  >
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Send />
                    )}
                  </Button>
                </FieldContent>
              </Field>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </span>
  );
}

export default CommentLists;
