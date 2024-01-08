import { USERS_API_URL } from "../constants/api"

export const loginUser = async (userDetails: any): Promise<string> => {
    const { data } = await fetch(`${USERS_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(userDetails),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())

    return data.token as string
}