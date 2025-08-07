import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";
import User from "@/components/user";
import CreateCounter from "@/components/create-counter";

export default function Home() {
  return (
    <div>
      <SignIn />
      <SignOut />
      <User />
      <CreateCounter />
    </div>
  );
}
