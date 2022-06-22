import { BsCircle, BsFillCheckCircleFill } from "react-icons/bs";
import { Todo } from "../../types";

interface TodoDisplay extends Todo {
  toggle: (id: string) => Promise<void>;
}

export function TodoItem({
  completed,
  todo,
  toggle,
  id,
}: TodoDisplay): JSX.Element {
  return (
    <div
      onClick={() => toggle(id)}
      className="flex items-center py-[20px] border-solid border-b-2 border-slate-100 mx-3 text-slate-800 "
    >
      <div className={`w-[5%] ${completed && "opacity-25"}`}>
        {completed ? <BsFillCheckCircleFill /> : <BsCircle />}
      </div>
      <p
        className={`pl-2 w-[95%] ${
          completed && "opacity-25 line-through"
        } cursor-pointer`}
      >
        {todo}
      </p>
    </div>
  );
}
