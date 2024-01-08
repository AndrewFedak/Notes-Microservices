import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

const getToken = () => localStorage.getItem('access_token')!

export const useAuth = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(getToken())

    const updateToken = (token: string) => {
        localStorage.setItem('access_token', token)
        setToken(token)
    }

    useEffect(() => {
        const token = getToken()
        if (token) {
            setToken(token)
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { token, setToken: updateToken }
}