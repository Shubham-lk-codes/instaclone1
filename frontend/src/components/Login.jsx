import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gradient-to-r from-pink-100 to-peach-200'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8 w-[30vw] bg-white rounded-lg border border-gray-300'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-2xl text-pink-600'>
                        <img src="logo.png" alt="Logo" className='w-[10vw] mx-auto' />
                    </h1>
                    <p className='text-sm text-center text-gray-600'>Join today with friends</p>
                </div>
                <div>
                    <span className='font-medium text-pink-600'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 text-black border-2 border-pink-200 rounded px-3 py-2"
                    />
                </div>
                <div>
                    <span className='font-medium text-pink-600'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 text-black border-2 border-pink-200 rounded px-3 py-2"
                    />
                </div>
                {
                    loading ? (
                        <Button className='bg-pink-500 text-white hover:bg-pink-600'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className='bg-pink-500 text-white hover:bg-pink-600'>
                            Login
                        </Button>
                    )
                }
                <span className='text-center text-sm text-gray-600'>Doesn't have an account? <Link to="/signup" className='text-pink-600 hover:underline'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login;
