import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Tag,
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
} from "lucide-react";
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

interface Blog {
  BlogID: number;
  BlogPublisherID: number;
  Title: string;
  BriefBody: string;
  Body: string;
  Genre: string;
  ImagePath: string;
  ImageUrl: string | null;
}

const AdminAddBlog = () => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    body: "",
    genre: "",
    image: null,
  });

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
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

  // Fetch blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/getUserBlogs.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        setBlogs(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const getCurrentAdminId = (): number => {
    return 1; // Replace with actual logic to get admin ID
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, PNG, and GIF images are allowed",
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size exceeds 5MB limit",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: "" }));

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

      if (editingBlogId) {
        formDataToSend.append("blog_id", editingBlogId.toString());
      } else {
        formDataToSend.append("user_id", getCurrentAdminId().toString());
      }

      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("body", formData.body.trim());
      formDataToSend.append("genre", formData.genre);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const endpoint = editingBlogId
        ? "http://localhost/Hirlytics-final/src/api/updateBlog.php"
        : "http://localhost/Hirlytics-final/src/api/addNewBlog.php";

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result: BlogResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      if (result.status === "success") {
        resetForm();
        fetchBlogs();
        alert(
          editingBlogId
            ? "Blog updated successfully!"
            : "Blog created successfully!"
        );
      } else {
        throw new Error(
          result.message ||
            (editingBlogId ? "Failed to update blog" : "Failed to create blog")
        );
      }
    } catch (error) {
      console.error(
        editingBlogId ? "Error updating blog:" : "Error creating blog:",
        error
      );
      alert(
        `Error ${editingBlogId ? "updating" : "creating"} blog: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.Title,
      body: blog.Body,
      genre: blog.Genre,
      image: null,
    });
    setEditingBlogId(blog.BlogID);
    setPreviewImage(blog.ImageUrl);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (blogId: number) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/Hirlytics-final/src/api/deleteBlog.php?id=${blogId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        fetchBlogs(); // Refresh the blog list
        alert("Blog deleted successfully!");
      } else {
        throw new Error(result.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(
        `Error deleting blog: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      genre: "",
      image: null,
    });
    setEditingBlogId(null);
    setPreviewImage(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowAddForm(false);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.Genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.Body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="unique-adminBlogContainer">
      <div className="unique-adminBlogHeader">
        <h1>
          {showAddForm
            ? editingBlogId
              ? "Edit Blog Post"
              : "Add New Blog Post"
            : "Blog Management"}
        </h1>
        {!showAddForm ? (
          <button
            className="unique-adminBlogAddButton"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={18} />
            Add New Blog
          </button>
        ) : (
          <button className="unique-adminBlogCancelButton" onClick={resetForm}>
            <X size={18} />
            Cancel
          </button>
        )}
      </div>

      {showAddForm ? (
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
                  style={{ display: "none" }}
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
                        setFormData((prev) => ({ ...prev, image: null }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
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
                    <ImageIcon
                      size={40}
                      className="unique-adminBlogImageUploadIcon"
                    />
                    <p>Click to upload an image (JPEG, PNG, GIF)</p>
                    <p>Max size: 5MB</p>
                  </div>
                )}
              </div>
              {errors.image && (
                <span className="unique-adminBlogErrorText">
                  {errors.image}
                </span>
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
                <span className="unique-adminBlogErrorText">
                  {errors.title}
                </span>
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
                <span className="unique-adminBlogErrorText">
                  {errors.genre}
                </span>
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
              {isSubmitting
                ? editingBlogId
                  ? "Updating Blog..."
                  : "Creating Blog..."
                : editingBlogId
                ? "Update Blog Post"
                : "Create Blog Post"}
            </button>
          </div>
        </div>
      ) : (
        <div className="unique-adminBlogListContainer">
          <div className="unique-adminBlogSearchContainer">
            <div className="unique-adminBlogSearchBox">
              <Search size={20} className="unique-adminBlogSearchIcon" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="unique-adminBlogSearchInput"
              />
            </div>
          </div>

          {loadingBlogs ? (
            <div className="unique-adminBlogLoading">Loading blogs...</div>
          ) : filteredBlogs.length > 0 ? (
            <div className="unique-adminBlogList">
              {filteredBlogs.map((blog) => (
                <div key={blog.BlogID} className="unique-adminBlogCard">
                  <div className="unique-adminBlogCardImageContainer">
                    {blog.ImageUrl ? (
                      <img
                        src={blog.ImageUrl}
                        alt={blog.Title}
                        className="unique-adminBlogCardImage"
                      />
                    ) : (
                      <div className="unique-adminBlogCardNoImage">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>
                  <div className="unique-adminBlogCardContent">
                    <h3 className="unique-adminBlogCardTitle">{blog.Title}</h3>
                    <div className="unique-adminBlogCardMeta">
                      <span className="unique-adminBlogCardGenre">
                        {blog.Genre}
                      </span>
                      <span className="unique-adminBlogCardDate">
                        {/* Assuming createdAt is available in the Blog interface */}
                        {/* If not, you might need to fetch it separately or remove this line */}
                        {/* For now, keeping it as is, but it might cause an error if not present */}
                        {/* blog.createdAt ? formatDate(blog.createdAt) : "No date" */}
                        No date
                      </span>
                    </div>
                    <p className="unique-adminBlogCardSummary">
                      {blog.BriefBody}
                    </p>
                  </div>
                  <div className="unique-adminBlogCardActions">
                    <button
                      className="unique-adminBlogCardEditButton"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit size={18} />
                      Edit
                    </button>
                    <button
                      className="unique-adminBlogCardDeleteButton"
                      onClick={() => handleDelete(blog.BlogID)}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="unique-adminBlogEmpty">
              <p>
                No blogs found.{" "}
                {searchTerm
                  ? "Try a different search term."
                  : "Create your first blog post!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAddBlog;
