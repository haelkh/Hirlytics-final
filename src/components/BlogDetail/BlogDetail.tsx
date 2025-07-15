import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/header";
import Footer from "../Footer/Footer";
import "./BlogDetail.css";

interface BlogPost {
  BlogID: number;
  BlogPublisherID: number;
  Title: string;
  BriefBody: string;
  Body: string;
  Genre: string;
  ImagePath: string | null;
  ImageUrl: string | null;
  // No direct createdAt field in the API response
}

const API_BASE_URL = "http://localhost/Hirlytics-final";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/src/api/getUserBlogs.php`
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data)) {
          const blogId = parseInt(id || "0", 10);
          const foundBlog = data.data.find(
            (b: BlogPost) => b.BlogID === blogId
          );

          if (foundBlog) {
            setBlog(foundBlog);

            // Find related posts with the same genre
            const related = data.data
              .filter(
                (b: BlogPost) =>
                  b.BlogID !== blogId && b.Genre === foundBlog.Genre
              )
              .slice(0, 3);

            setRelatedPosts(related);
          } else {
            throw new Error(`Blog with ID ${id} not found`);
          }
        } else {
          throw new Error(data.message || "Failed to fetch blog details");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const getGenreAsTags = (genre: string) => {
    return genre ? genre.split(",").map((g) => g.trim()) : ["General"];
  };

  const renderCategoryTags = (genre: string) => {
    const categories = getGenreAsTags(genre);
    return categories.map((category, index) => (
      <span key={index} className={`category-tag ${category.toLowerCase()}`}>
        {category}
      </span>
    ));
  };

  const handleBackClick = () => {
    navigate("/blog-page");
  };

  const handleRelatedPostClick = (blogId: number) => {
    navigate(`/blog-detail/${blogId}`);
    // Scroll to top when navigating to a new blog
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="blog-detail-wrapper">
        <Header />
        <div className="blog-detail-page">
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Loading blog details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-wrapper">
        <Header />
        <div className="blog-detail-container">
          <div className="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>{error || "Blog not found"}</p>
            <button className="back-button" onClick={handleBackClick}>
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="blog-detail-wrapper">
      <Header />
      <br />
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <div className="blog-detail-header">
            <button className="back-button" onClick={handleBackClick}>
              <span className="back-icon">←</span> Back to Blogs
            </button>
            <div className="blog-meta">
              <div className="blog-categories">
                {renderCategoryTags(blog.Genre || "General")}
              </div>
              <h1 className="blog-title">{blog.Title}</h1>
              <div className="blog-info">
                {/* No direct createdAt field in the API response */}
              </div>
            </div>
          </div>

          {blog.ImageUrl && (
            <div className="blog-hero-image">
              <img
                src={blog.ImageUrl}
                alt={blog.Title}
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src = `${API_BASE_URL}/images/default-blog.jpg`;
                }}
              />
            </div>
          )}

          <div className="blog-content">
            <div className="blog-summary">
              <p>{blog.BriefBody}</p>
            </div>
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: blog.Body }}
            />
          </div>

          {relatedPosts.length > 0 && (
            <div className="related-posts">
              <h2>Related Posts</h2>
              <div className="related-posts-grid">
                {relatedPosts.map((post) => (
                  <div
                    key={post.BlogID}
                    className="related-post-card"
                    onClick={() => handleRelatedPostClick(post.BlogID)}
                  >
                    <div className="related-post-image">
                      <img
                        src={
                          post.ImageUrl ||
                          `${API_BASE_URL}/images/default-blog.jpg`
                        }
                        alt={post.Title}
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src = `${API_BASE_URL}/images/default-blog.jpg`;
                        }}
                      />
                    </div>
                    <div className="related-post-content">
                      <h3>{post.Title}</h3>
                      <p>{post.BriefBody}</p>
                      <div className="related-post-meta">
                        {/* No direct createdAt field in the API response */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
