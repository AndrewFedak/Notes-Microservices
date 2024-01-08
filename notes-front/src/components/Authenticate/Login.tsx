import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";

import { loginUser } from "../../services/users";

export const Login = () => {
    const navigate = useNavigate()
    const { setToken } = useAuth()
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const onChange = (propName: keyof typeof user) => (e: ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [propName]: e.target.value
        })
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = await loginUser(user)
        setToken(token)
        navigate('/notes')
    }

    return (
        <form onSubmit={onSubmit}>
            <p>
                <label>Email</label><br />
                <input type="text" onChange={onChange('email')} />
            </p>
            <p>
                <label>Password</label><br />
                <input type="text" onChange={onChange('password')} />
            </p>
            <button>Submit</button>
        </form>
    )
}