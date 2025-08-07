"use client";

import { createCounter } from "./counter-actions";

export default function CreateCounter() {
  return (
    <form action={createCounter}>
      <input type="text" name="name" placeholder="Counter Name" />
      <button className="bg-blue-500 text-white p-2 rounded-md">
        Create Counter
      </button>
    </form>
  );
}
