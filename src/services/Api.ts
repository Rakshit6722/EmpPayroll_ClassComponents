import axios from "axios"

const BASE_URL = 'http://localhost:3000/employeeList'

export const addEmployee = async (data: any) => {
    try{
        const response = await axios.post(BASE_URL, data)
        return response
    }catch(err){
        console.log(err)
        throw err
    }
}

export const getEmployees = async () => {
    try{
        const resposne = await axios.get(BASE_URL)
        return resposne
    }catch(err){
        console.log(err)
        throw err 
    }
}