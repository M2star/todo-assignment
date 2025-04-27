import axios from "axios";

export const getTasks = async() => {
    const tasks = await axios.get("https://jsonplaceholder.typicode.com/todos")
    return tasks
}

export const createTask = async(body: {}) => {
    const tasks = await axios.post("https://jsonplaceholder.typicode.com/todos", body)
    return tasks

}

export const deleteTask = async(id: number| string) => {
    const tasks = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    return tasks
}

export const updateTask = async(id: number| string, body: {}) => {
    const tasks = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, body)
    return tasks
}