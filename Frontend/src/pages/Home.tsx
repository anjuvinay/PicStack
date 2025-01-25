
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UploadedImage {
  id: string;
  url: string;
  title: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [fetchedImages, setFetchedImages] = useState<UploadedImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingFile, setEditingFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchImages(token);
    }

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [navigate]);

  const fetchImages = async (token: string) => {
    try {
      const response = await axios.get("https://picbackend.onrender.com/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;
      setFetchedImages(data.data);
      console.log("Fetched Images:", data.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching images:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/");
      } else {
        toast.info("Failed to fetch images.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setSelectedFiles(fileArray);
      setTitles(fileArray.map(() => ""));
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    setTitles((prev) => {
      const newTitles = [...prev];
      newTitles[index] = value;
      return newTitles;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in. Please log in to upload images.");
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file, idx) => {
        formData.append("images", file);
        formData.append("titles", titles[idx]);
      });

      await axios.post("https://picbackend.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Images uploaded successfully!");
      fetchImages(token);

      setSelectedFiles([]);
      setTitles([]);
      setPreviews([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Upload failed:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/");
      } else {
        toast.error("Upload failed.");
      }
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in to edit images.");
        return;
      }

      if (!editingTitle && !editingFile) {
        toast.error("Please provide a new title or image.");
        return;
      }

      const formData = new FormData();
      formData.append("id", id);
      if (editingTitle) formData.append("title", editingTitle);
      if (editingFile) formData.append("image", editingFile);

      await axios.put("https://picbackend.onrender.com/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Image updated successfully!");
      fetchImages(token);
      setEditingImageId(null);
      setEditingTitle("");
      setEditingFile(null);
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error("Failed to edit image.");
    }
  };

  const handleDelete = async (image: UploadedImage) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in. Please log in to delete images.");
        return;
      }
      await axios.delete("https://picbackend.onrender.com/image", {
        data: { Id: image.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Image deleted successfully!");
      setFetchedImages(fetchedImages.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData("index"), 10);
    const reorderedImages = [...fetchedImages];
    const [draggedImage] = reorderedImages.splice(dragIndex, 1);
    reorderedImages.splice(index, 0, draggedImage);
    setFetchedImages(reorderedImages);
  };

  const saveOrder = async () => {
    const updatedOrder = fetchedImages.map((img, index) => ({
      id: img.id,
      order: index + 1,
    }));

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("https://picbackend.onrender.com/reorder", { reorderedImages: updatedOrder }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Image order updated successfully!");
        fetchImages(token);
      }
    } catch (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to save order.");
    }
  };

  return (
    <div className="p-10">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4 pt-20 mt-10">Add Images With Title</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        <div className="flex flex-row flex-wrap gap-4 mb-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="mb-4 border p-2">
              <img src={previews[index]} alt="preview" className="w-32 h-32 object-cover mb-2" />
              <p>{file.name}</p>
              <input
                type="text"
                placeholder="Enter title"
                value={titles[index] || ""}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="border px-2 py-1 mt-1 block"
              />
            </div>
          ))}
        </div>

        {selectedFiles.length > 0 && (
          <button type="submit" className="bg-teal-500 text-white px-4 py-2 mt-2">
            Upload
          </button>
        )}
      </form>

      {fetchedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Your Uploaded Images:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-10">
            {fetchedImages.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="border rounded-lg shadow-md p-2 bg-white"
              >
                <div className="w-full aspect-square overflow-hidden rounded-md">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                </div>
                {editingImageId === img.id ? (
                  <>
                    <input
                      type="text"
                      placeholder="Edit title"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="border px-2 py-1 mt-1 block"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditingFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="border px-2 py-1 mt-1 block"
                    />
                    <button
                      onClick={() => handleEdit(img.id)}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 mt-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingImageId(null);
                        setEditingTitle("");
                        setEditingFile(null);
                      }}
                      className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 mt-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-0.5 text-sm font-medium">{img.title}</p>
                    <div className="mt-1 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingImageId(img.id);
                          setEditingTitle(img.title);
                        }}
                        className="px-5 py-1 bg-cyan-700 text-white text-xs rounded hover:bg-cyan-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img)}
                        className="px-5 py-1 bg-cyan-700 text-white text-xs rounded hover:bg-cyan-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={saveOrder}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded"
          >
            Save Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;







