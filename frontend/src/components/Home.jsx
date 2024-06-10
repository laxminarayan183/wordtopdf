import React, { useState } from "react";
import { AiFillFileWord } from "react-icons/ai";
import axios from "axios";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setConvert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:3000/convertFile",
        formData,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      link.click();
      link.parentNode.removeChild(link);
      setSelectedFile(null);
      setDownloadError("");
      setConvert("File Converted Succefully");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status == 400) {
        setDownloadError("Error Occurred", error.response.data.msg);
      } else {
        setConvert("");
      }
    }
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
        <div className="flex h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word to PDF Online
            </h1>
            <p className="text-sm text-center mb-5">
              Easily convert Word documents to PDF format online,without having
              to install any software
            </p>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept=".doc,.docx"
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileInput"
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg cursor-pointer border-blue-300 hover:bg-blue-700 duration-300  hover:text-white"
              >
                <AiFillFileWord className="text-3xl mr-3" />
                <span className="text-2xl mr-2">
                  {selectedFile ? selectedFile.name : "Choose File"}
                </span>
              </label>
              <button
                disabled={!selectedFile}
                className="text-white bg-blue-500 hover:bg-blue-700 duration-300 font-bold px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:pointer-events-none"
                onClick={handleSubmit}
              >
                Convert file
              </button>
              {convert && (
                <div className="text-green-500 text-center">{convert}</div>
              )}
              {downloadError && (
                <div className="text-red-500 text-center">{downloadError}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;