import SignIn from "@/components/sign-in";
import SignOut from "@/components/sign-out";
import User from "@/components/user";

export default function Home() {
  return (
    <div>
      <SignIn />
      <SignOut />
      <User />
    </div>
  );
}
