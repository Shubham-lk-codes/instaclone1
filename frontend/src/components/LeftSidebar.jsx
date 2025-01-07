import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { PiVideoBold } from "react-icons/pi";
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuUpload } from "react-icons/lu";
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import UploadReel from './CreateVideo';
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'upload'){
            setDialogOpen(true);  // Open the upload reel dialog
        } else if (textType === 'Explore' ){
            navigate("/video");
        }
    }

    const sidebarItems = [
        { icon: <Home className='text-[#]' />, text: "Home" },
        { icon: <LuUpload className='text-[#]' />, text: "upload" },
        { icon: <PiVideoBold className='text-[#]' />, text: "Explore" },
        { icon: <MessageCircle className='text-[#]' />, text: "Messages" },
        { icon: <Heart className='text-[#]' />, text: "Notifications" },
        { icon: <PlusSquare className='text-[' />, text: "Create" },
        {
            icon: (
                <Avatar className='w-8 h-8'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className='text-[#]' />, text: "Logout" },
    ]

    return (
        <div className='fixed top-0 left-0 z-10 w-[20%] h-screen bg-gradient-to-b from-[#FF8A65] to-[#FF7043] shadow-lg rounded-lg'>
            <div className='flex flex-col p-6'>
                <h1 className='my-8 pl-3 font-bold text-2xl text-white'>Tiktok</h1>
                <div className='space-y-4'>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div 
                                    onClick={() => sidebarHandler(item.text)} 
                                    key={index} 
                                    className='flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-[#FF6F47] transition-all duration-200 ease-in-out'>
                                    {item.icon}
                                    <span className='text-white font-medium'>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute top-3 right-3">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p className='text-sm text-gray-700'>No new notifications</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm text-gray-700'>
                                                                                <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Dialog for Create Post */}
            <CreatePost open={open} setOpen={setOpen} />

            {/* Dialog for Upload Reel */}
            <UploadReel isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    )
}

export default LeftSidebar;
