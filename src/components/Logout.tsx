import { BiLogOut } from "react-icons/bi";

export function Logout({ logout }: any): JSX.Element {
  return (
    <span
      onClick={logout}
      className="text-slate-800 position: absolute top-0 right-0 pt-1 pr-2 hover:text-slate-500 cursor-pointer transition ease-in-out delay-50"
    >
      <BiLogOut />
    </span>
  );
}
