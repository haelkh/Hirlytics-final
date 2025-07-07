import React, { useState } from "react";
import { FileText, Tag } from "lucide-react";
import "./adminBlog.css";

interface BlogFormData {
  title: string;
  body: string;
  genre: string;
}

interface BlogPayload {
  user_id: number;
  title: string;
  body: string;
  genre: string;
}

const AdminAddBlog = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    body: "",
    genre: "",
  });

  const getCurrentAdminId = (): number => {
    return 1; // Replace with actual logic to get admin ID
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
      const blogPayload: BlogPayload = {
        user_id: getCurrentAdminId(),
        title: formData.title.trim(),
        body: formData.body.trim(),
        genre: formData.genre,
      };

      console.log(
        "Sending request to:",
        "http://localhost/Web_Hirlytics/Hirlytics/src/api/addNewBlog.php"
      );
      console.log("Request payload:", blogPayload);

      const response = await fetch(
        "http://localhost/Web_Hirlytics/Hirlytics/src/api/addNewBlog.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(blogPayload),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      if (result.status === "success") {
        setFormData({ title: "", body: "", genre: "" });
        alert("Blog created successfully!");
      } else {
        throw new Error(result.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert(`Error creating blog: `);
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
