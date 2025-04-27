import { Tasks } from "./types"

export const initialBoard = (tasks: Tasks[]) => {
    return [
    {
          id: "todo",
          title: "todo",
        },
        {
          id: "inProgress",
          title: "in progress",
          tasks:[]
        },
        {
          id: "done",
          title: "done",
        },
    ]
}