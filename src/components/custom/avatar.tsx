import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function avatar() {
  return (
    <Avatar className="outline-none">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
export default avatar;
