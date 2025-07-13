import React, { useState, useEffect, useMemo, ReactNode } from "react";
import "./blogPage.css";

interface BlogPost {
  id: number;
  userId: number;
  title: string;
  summary: string;
  content: string;
  genre: string;
  imageUrl: string | null;
  createdAt: string;
  author?: string;
}

interface BlogResponse {
  status: string;
  data: BlogPost[];
  count: number;
  message?: string;
  timestamp?: string;
}

const API_BASE_URL = "http://localhost/Hirlytics-final"; // Update this based on your environment

const BlogPage: React.FC = (): ReactNode => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/src/api/getUserBlogs.php`
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        let data: BlogResponse;
        try {
          data = await response.json();
        } catch {
          throw new Error("Failed to parse server response");
        }

        if (data.status === "success" && Array.isArray(data.data)) {
          const formattedBlogs = data.data.map((blog) => ({
            ...blog,
            createdAt: formatDate(blog.createdAt),
            imageUrl:
              blog.imageUrl ?? `${API_BASE_URL}/images/default-blog.jpg`,
          }));
          setBlogs(formattedBlogs);
          setError(null);
        } else {
          throw new Error(
            data.message ?? "Failed to fetch blogs: Invalid response format"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        console.error("Error fetching blogs:", err);
        setBlogs([]); // Reset blogs on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBlogs = useMemo(() => {
    if (!searchKeyword.trim()) return blogs;

    const keyword = searchKeyword.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(keyword) ||
        blog.summary.toLowerCase().includes(keyword) ||
        blog.content.toLowerCase().includes(keyword) ||
        blog.genre.toLowerCase().includes(keyword)
    );
  }, [blogs, searchKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

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

  const renderPostCard = (
    post: BlogPost,
    layout: "horizontal" | "vertical" = "vertical"
  ) => {
    const imageSrc = post.imageUrl || `${API_BASE_URL}/images/default-blog.jpg`;

    return (
      <div className={`post-card ${layout}`} key={post.id}>
        <div className="post-image">
          <img
            src={imageSrc}
            alt={post.title}
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `${API_BASE_URL}/images/default-blog.jpg`;
            }}
          />
        </div>
        <div className="post-content">
          <div className="post-meta">
            <span className="post-author">
              {post.author || `User #${post.userId}`}
            </span>
            <span className="post-date">• {post.createdAt}</span>
          </div>
          <h3 className="post-title">
            {post.title}
            <span className="arrow-icon">↗</span>
          </h3>
          <p className="post-excerpt">{post.summary}</p>
          <div className="post-categories">
            {renderCategoryTags(post.genre || "General")}
          </div>
        </div>
      </div>
    );
  };

  const renderFeaturedPosts = () => {
    const featuredBlogs = filteredBlogs.slice(0, 4);

    if (featuredBlogs.length === 0) {
      return (
        <div className="loading-message">No blogs available to display</div>
      );
    }

    if (featuredBlogs.length < 4) {
      return (
        <div className="all-posts-grid">
          {featuredBlogs.map((post: BlogPost) => (
            <div className="post-grid-item" key={post.id}>
              {renderPostCard(post)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="featured-posts-grid">
        <div className="featured-column-left">
          {renderPostCard(featuredBlogs[0], "horizontal")}
          <div className="climate-special-card">
            <div className="climate-content">
              <div className="record-dot"></div>
              <h2>
                Climate Endgame: Exploring catastrophic climate change scenarios
              </h2>
            </div>
          </div>
        </div>
        <div className="featured-column-right">
          <div className="featured-row">
            {renderPostCard(featuredBlogs[1], "horizontal")}
          </div>
          <div className="featured-row two-column">
            <div className="column">
              {renderPostCard(featuredBlogs[2], "horizontal")}
            </div>
            <div className="column">
              {renderPostCard(featuredBlogs[3], "vertical")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAllPosts = () => {
    return (
      <div className="all-posts-grid">
        {filteredBlogs.map((post: BlogPost) => (
          <div className="post-grid-item" key={post.id}>
            {renderPostCard(post)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>BLOG</h1>
      </header>

      <div className="blog-container">
        <div className="search-bar2">
          <form onSubmit={handleSearch}>
            <div className="search-input2">
              <span className="search-icon2">≡</span>
              <input
                type="text"
                placeholder="Keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button type="submit" className="search-button2">
                <span className="search-button-icon2">🔍</span>
              </button>
            </div>
          </form>
        </div>

        <div className="blog-tabs">
          <button
            className={activeTab === "recent" ? "active" : ""}
            onClick={() => setActiveTab("recent")}
          >
            Recent blog posts
          </button>
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All blog posts
          </button>
        </div>

        <div className="blog-content">
          {loading ? (
            <div className="loading-message">Loading blogs...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="no-blogs-message">
              {searchKeyword.trim()
                ? `No blogs found matching "${searchKeyword}"`
                : "No blogs found"}
            </div>
          ) : activeTab === "recent" ? (
            renderFeaturedPosts()
          ) : (
            renderAllPosts()
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
