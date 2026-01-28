import React, { useRef, useState, useEffect } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { TbVideoPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import { setPostData } from "../redux/postSlice";
import { setLoopData } from "../redux/loopSlice";

const API_BASE_URL = "https://vybe-backend-8yqs.onrender.com/api";

function Upload() {
  const nav = useNavigate();
  const [uploadType, setUploadType] = useState("story");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaInput = useRef();

  const { postData } = useSelector((state) => state.post);
  const { storyData } = useSelector((state) => state.story);
  const { loopData } = useSelector((state) => state.loop);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (frontendImage) URL.revokeObjectURL(frontendImage);
    };
  }, [frontendImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size too large! Maximum 50MB allowed.");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please select a valid image or video file!");
      return;
    }

    if (uploadType === "loop") {
      if (!isVideo) {
        alert("Only short videos are allowed for Loops!");
        return;
      }

      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoEl.src);
        const duration = videoEl.duration;
        if (duration > 150) {
          alert("Loop video must be 150 seconds or shorter!");
          setBackendImage(null);
          setFrontendImage(null);
          return;
        }
        if (frontendImage) URL.revokeObjectURL(frontendImage);
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
      };
      videoEl.src = URL.createObjectURL(file);
      return;
    }

    if (frontendImage) URL.revokeObjectURL(frontendImage);
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!backendImage) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    const fileType = backendImage.type.startsWith("video") ? "video" : "image";

    if (uploadType === "post") {
      formData.append("midia", backendImage);
      formData.append("caption", caption);
      formData.append("midiaType", fileType);
    } else if (uploadType === "story") {
      formData.append("midia", backendImage);
      formData.append("caption", caption);
      formData.append("midiaType", fileType);
    } else if (uploadType === "loop") {
      formData.append("midia", backendImage);
      formData.append("caption", caption);
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const url = `${API_BASE_URL}/${uploadType}/upload`;
      const result = await axios.post(url, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        },
      });

      alert("✅ Uploaded successfully!");
      const newData = result.data;

      if (uploadType === "post") {
        dispatch(setPostData([...(postData || []), newData]));
      } else if (uploadType === "story") {
        dispatch(setStoryData([...(Array.isArray(storyData) ? storyData : []), newData]));
      } else if (uploadType === "loop") {
        dispatch(setLoopData([...(loopData || []), newData]));
      }

      nav("/");
    } catch (err) {
      console.error("Upload error details:", err);
      if (err.response?.status === 413) {
        alert("File too large!");
      } else if (err.response?.status === 401) {
        alert("Please log in again!");
        nav("/singin");
      } else if (err.response?.data?.message) {
        alert(`Upload failed: ${err.response.data.message}`);
      } else {
        alert("Upload failed! Please try again.");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const uploadOptions = ["post", "story", "loop"];

  return (
    <div className="w-full h-[100vh] bg-black text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-6 py-6">
        <MdOutlineArrowBack
          onClick={() => nav(`/`)}
          className="text-3xl cursor-pointer bg-white text-black rounded-full p-1 transition-all duration-300 hover:scale-110"
        />
        <h1 className="text-2xl font-semibold tracking-wide">Upload Media</h1>
      </div>

      {/* Upload Type Selector */}
      <div className="w-[85%] max-w-[500px] mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex justify-around items-center shadow-lg">
        {uploadOptions.map((type) => (
          <div
            key={type}
            onClick={() => setUploadType(type)}
            className={`cursor-pointer text-lg font-medium px-4 py-2 rounded-xl transition-all ${
              uploadType === type ? "bg-white text-black" : "text-white"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      {/* Upload Preview Box */}
      <div
        onClick={() => mediaInput.current.click()}
        className="w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[10vh] rounded-2xl cursor-pointer hover:bg-[#353a3d] transition-all"
      >
        <input
          type="file"
          hidden
          ref={mediaInput}
          onChange={handleFileChange}
          accept="image/*,video/*"
        />

        {frontendImage ? (
          <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden">
            {backendImage?.type.startsWith("video") ? (
              <video src={frontendImage} className="w-full h-full object-cover" controls />
            ) : (
              <img src={frontendImage} alt="preview" className="w-full h-full object-cover" />
            )}
          </div>
        ) : (
          <>
            <TbVideoPlus className="text-white text-3xl hover:scale-110 transition-transform duration-200 hover:text-blue-400 cursor-pointer" />
            <div className="text-[19px] font-semibold">Upload {uploadType}</div>
          </>
        )}
      </div>

      {/* Caption (not for stories) */}
        {uploadType !== "story" && (
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-6 w-[80%] max-w-[500px] bg-[#0e1316] border border-gray-800 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
        />)}
      

      {/* Progress Bar */}
      {loading && (
        <div className="mt-4 w-[80%] max-w-[500px]">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-400">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !backendImage}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-10 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading..." : `Upload ${uploadType}`}
      </button>
    </div>
  );
}

export default Upload;
