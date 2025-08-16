import { getSession } from "@/helpers";

export default function Account() {
  const user = getSession();
  return <div>Account page</div>;
}
