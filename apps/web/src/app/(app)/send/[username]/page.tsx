import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SendMessageForm } from "@/modules/messaging";
import { getUserByUsername } from "@/modules/user/server";

type Props = { params: Promise<{ username: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { username } = await params;
  const receiver = await getUserByUsername(username);

  return { title: receiver ? `Send a message to ${receiver.name}` : "User not found" };
};

const SendMessagePage = async ({ params }: Props) => {
  const { username } = await params;
  const receiver = await getUserByUsername(username);

  if (!receiver) notFound();

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">
        Just Say it to <span className="text-indigo-600 dark:text-indigo-400">{receiver.name}</span>
      </h1>

      <SendMessageForm receiver={receiver} />
    </>
  );
};

export default SendMessagePage;
