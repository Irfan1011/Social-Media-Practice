import Form from "next/form";
import { MoveLeft, Send } from "lucide-react";

import { Bubble, BubbleContent, BubbleGroup } from "@components/ui/bubble";
import { Field, FieldContent } from "@components/ui/field";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";

type ChatDetailProps = {
  onHandleCloseChat: () => void;
};

const ChatDetail = ({ onHandleCloseChat }: ChatDetailProps) => {
  return (
    <section className="md:col-span-2 flex flex-col justify-between">
      <Button
        variant="ghost"
        className="w-fit rounded-full cursor-pointer"
        onClick={onHandleCloseChat}
      >
        <MoveLeft />
      </Button>

      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>tes</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>tes</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Form action="">
        <Field>
          <FieldContent className="flex flex-row justify-between items-center">
            <Textarea></Textarea>
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Send />
            </Button>
          </FieldContent>
        </Field>
      </Form>
    </section>
  );
};

export default ChatDetail;
