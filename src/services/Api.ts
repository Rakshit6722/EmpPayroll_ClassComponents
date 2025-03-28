import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export const addEmployee = async (data: any) => {
    try{
        const response = await axios.post(BASE_URL, data)
        return response
    }catch(err){
        throw err
    }
}

export const getEmployees = async () => {
    try{
        const resposne = await axios.get(BASE_URL)
        return resposne
    }catch(err){

        throw err 
    }
}

export const deleteEmployee = async (id: string | number) => {
    try{
        const response = await axios.delete(`${BASE_URL}/${id}`)
        return response
    }catch(err){
        throw err
    }
}

export const editEmployee = async (id: string | number, data: any) => {
    try{
        const response = await axios.put(`${BASE_URL}/${id}`, data)
        return response
    }catch(err){    
        throw err
    }
}


export const getIndividualEmployee = async (id: string) => {
    try{
        const response = await axios.get(`${BASE_URL}/${id}`)
        return response
    }catch(err){
        throw err
    }
}