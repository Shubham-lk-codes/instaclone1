import React, { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Loader2 } from "lucide-react";

const UploadReel = ({ isDialogOpen, setDialogOpen }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileError, setFileError] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setFileError(""); // Clear error if file type is valid
      setVideoFile(file);
    } else {
      setFileError("Please select a valid video file.");
      setVideoFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setErrorMessage("Please select a video file.");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("tags", tags);

    try {
      setLoading(true);
      const response = await axios.post("http://pr-gwhve7cwb3fwdmcu.canadacentral-01.azurewebsites.net/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSuccessMessage("Video uploaded successfully!");
        setVideoFile(null); // Clear file after success
        setTitle("");
        setTags("");
      } else {
        setErrorMessage(response.data.message || "Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-[#FFEBEB] p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
          <h2 className="text-2xl font-semibold text-center text-[#F4A9A9]">Upload Your Reel</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-[#F4A9A9] font-medium">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="file-input w-full border border-[#F4A9A9] rounded-md p-3 mt-2"
              />
              {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
            </div>

            <div>
              <label className="block text-[#F4A9A9] font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                className="input w-full border border-[#F4A9A9] rounded-md p-3 mt-2"
              />
            </div>

            <div>
              <label className="block text-[#F4A9A9] font-medium">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., travel, food, vlog"
                className="input w-full border border-[#F4A9A9] rounded-md p-3 mt-2"
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

            <button
              type="submit"
              className="btn w-full bg-[#FFB8B8] text-white py-3 rounded-md hover:bg-[#FF9B9B] disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Uploading...
                </div>
              ) : (
                "Upload Video"
              )}
            </button>
          </form>

          <div className="flex justify-between">
            <button
              onClick={() => setDialogOpen(false)}
              className="mt-4 text-[#F4A9A9] hover:text-[#FF8A8A] font-semibold"
            >
              Close
            </button>
            {/* Add extra actions here if necessary */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadReel;
