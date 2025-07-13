import React, { useState, useRef } from "react";
import { FileText, Tag, Image as ImageIcon } from "lucide-react";
import "./adminBlog.css";

interface BlogFormData {
  title: string;
  body: string;
  genre: string;
  image: File | null;
}

interface BlogResponse {
  status: string;
  message: string;
  blogId?: number;
  imageUrl?: string | null;
}

const AdminAddBlog = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    body: "",
    genre: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genreOptions = [
    "Technology",
    "Lifestyle",
    "Business",
    "Health",
    "Travel",
    "Food",
    "Fashion",
    "Sports",
    "Entertainment",
    "Education",
    "Other",
  ];

  const getCurrentAdminId = (): number => {
    return 1; // Replace with actual logic to get admin ID
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: 'Only JPG, PNG, and GIF images are allowed' }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'File size exceeds 5MB limit' }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Blog content is required";
    }

    if (!formData.genre) {
      newErrors.genre = "Genre selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', getCurrentAdminId().toString());
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('body', formData.body.trim());
      formDataToSend.append('genre', formData.genre);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/addNewBlog.php",
        {
          method: "POST",
          credentials: "include",
          body: formDataToSend,
        }
      );
      
      const result: BlogResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      if (result.status === "success") {
        setFormData({ title: "", body: "", genre: "", image: null });
        setPreviewImage(null);
        alert("Blog created successfully!");
      } else {
        throw new Error(result.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert(`Error creating blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="unique-adminBlogContainer">
      <div className="unique-adminBlogHeader">
        <h1>Add New Blog Post</h1>
      </div>

      <div className="unique-adminBlogFormContainer">
        <div className="unique-adminBlogForm">
          <div className="unique-adminBlogFormGroup">
            <label className="unique-adminBlogLabel">Blog Image</label>
            <div className="unique-adminBlogImageUploadContainer">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/gif"
                style={{ display: 'none' }}
              />
              
              {previewImage ? (
                <div className="unique-adminBlogImagePreviewContainer">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="unique-adminBlogImagePreview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, image: null }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="unique-adminBlogRemoveImageButton"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div 
                  className="unique-adminBlogImageUploadArea"
                  onClick={triggerFileInput}
                >
                  <ImageIcon size={40} className="unique-adminBlogImageUploadIcon" />
                  <p>Click to upload an image (JPEG, PNG, GIF)</p>
                  <p>Max size: 5MB</p>
                </div>
              )}
            </div>
            {errors.image && (
              <span className="unique-adminBlogErrorText">{errors.image}</span>
            )}
          </div>

          <div className="unique-adminBlogFormGroup">
            <label
              htmlFor="unique-adminBlogTitle"
              className="unique-adminBlogLabel"
            >
              Blog Title *
            </label>
            <div className="unique-adminBlogInputWithIcon">
              <FileText className="unique-adminBlogInputIcon" size={20} />
              <input
                type="text"
                id="unique-adminBlogTitle"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title..."
                className={`unique-adminBlogInput ${
                  errors.title ? "unique-adminBlogInputError" : ""
                }`}
                required
              />
            </div>
            {errors.title && (
              <span className="unique-adminBlogErrorText">{errors.title}</span>
            )}
          </div>

          <div className="unique-adminBlogFormGroup">
            <label
              htmlFor="unique-adminBlogGenre"
              className="unique-adminBlogLabel"
            >
              Genre *
            </label>
            <div className="unique-adminBlogInputWithIcon">
              <Tag className="unique-adminBlogInputIcon" size={20} />
              <select
                id="unique-adminBlogGenre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className={`unique-adminBlogSelect ${
                  errors.genre ? "unique-adminBlogInputError" : ""
                }`}
                required
              >
                <option value="">Select a genre...</option>
                {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            {errors.genre && (
              <span className="unique-adminBlogErrorText">{errors.genre}</span>
            )}
          </div>

          <div className="unique-adminBlogFormGroup">
            <label
              htmlFor="unique-adminBlogContent"
              className="unique-adminBlogLabel"
            >
              Blog Content *
            </label>
            <textarea
              id="unique-adminBlogContent"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Write your blog content here..."
              className={`unique-adminBlogTextarea ${
                errors.body ? "unique-adminBlogInputError" : ""
              }`}
              rows={12}
              required
            />
            {errors.body && (
              <span className="unique-adminBlogErrorText">{errors.body}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="unique-adminBlogSubmitButton"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Blog..." : "Create Blog Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBlog;