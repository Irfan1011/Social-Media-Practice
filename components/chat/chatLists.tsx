import type { ChatProps } from "./chat";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent, CardTitle } from "@components/ui/card";

type ChatListsProps = ChatProps & {
  onHandleOpenChat: () => void;
};

const ChatLists = ({ followingUser, onHandleOpenChat }: ChatListsProps) => {
  return (
    <section className="flex flex-col gap-2">
      {followingUser.map((following) => (
        <Card
          key={following.id}
          className="hover:bg-primary hover:text-card cursor-pointer"
          onClick={onHandleOpenChat}
        >
          <CardContent className="flex items-center gap-4">
            <Avatar>
              <AvatarImage
                src={following.follower.image || ""}
                alt={following.follower.username}
              />
              <AvatarFallback className="uppercase">
                {following.follower.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{following.follower.username}</CardTitle>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default ChatLists;
