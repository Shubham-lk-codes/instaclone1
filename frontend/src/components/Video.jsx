/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment, FaShare } from "react-icons/fa";

const Video = () => {
  const [posts, setPosts] = useState([]);
  const [isCommentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://mern-azure-web-h4ashbdzdtg0amhr.eastus-01.azurewebsites.net/api/videos/videos");
        console.log("Response Data:", response.data);
        if (response.data.success) {
          setPosts(response.data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            videoRefs.current.forEach((v) => v && v.pause()); // Pause all videos
            video.play(); // Play only the current video
          }
        });
      },
      { threshold: 0.8 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [posts]);

  const handleLike = async (postId) => {
    try {
      await axios.put(`http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/videos/${postId}/like`);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.put(`http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/videos/${postId}/dislike`);
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await axios.put(`http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/videos/${postId}/bookmark`);
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleCommentOpen = (postId) => {
    setCurrentPostId(postId);
    setCommentDialogOpen(true);
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/videos/${currentPostId}/comments`, {
        text: newComment,
      });
      setNewComment("");
      setCommentDialogOpen(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto  overflow-auto hide-scrollbar">
      <div className="overflow-y-scroll h-screen snap-y hide-scrollbar  snap-mandatory">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post._id} className="relative snap-center h-screen flex items-center justify-center  ">
              <video
                src={post.url}
                className="w-full h-full object-contain  overflow-auto hide-scrollbar "
                controls={false}
                ref={(el) => (videoRefs.current[index] = el)}
                onError={(e) => console.error("Error loading video:", e.target.src)}
              />
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {/* Top text overlay */}
                

                {/* Side actions */}
                <div className="absolute right-4 bottom-16 space-y-4 flex flex-col items-center">
                  <button onClick={() => handleLike(post._id)}>
                    <FaHeart size={24} className="text-white hover:text-red-500 mt-10 " />
                  </button>
                  {/* <button onClick={() => handleDislike(post._id)}>
                    <FaRegHeart size={24} className="text-white hover:text-gray-400" />
                  </button> */}
                  <button onClick={() => handleBookmark(post._id)}>
                    <FaBookmark size={24} className="text-white hover:text-yellow-400 mt-10" />
                  </button>
                  <button className="text-white" onClick={() => handleCommentOpen(post._id)}>
                    <FaComment size={24} className="hover:text-blue-400 mt-10" />
                  </button>
                  <button>
                    <FaShare size={24} className="text-white hover:text-green-400 mt-10" />
                  </button>
                </div>
              </div>
              {/* Bottom branding */}
              
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onClose={() => setCommentDialogOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md max-w-lg w-full">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full h-32 border border-gray-300 p-2"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Video;
