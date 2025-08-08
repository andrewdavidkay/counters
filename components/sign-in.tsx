import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitter");
      }}
    >
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Sign in with X
      </button>
    </form>
  );
}
