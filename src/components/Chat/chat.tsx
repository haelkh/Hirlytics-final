import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import "./chat.css";

interface ChatButtonProps {
  onToggleChat: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onToggleChat }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="chat-button-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onToggleChat}
        className="chat-button"
        aria-label="Chat with a recruiter"
      >
        <MessageCircle size={24} />
        {isHovered && <span className="chat-tooltip">Chat with Hirlytics</span>}
      </button>
    </div>
  );
};

// Message interface
interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Chat Modal Component
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyInfo: CompanyInfo;
}

interface CompanyInfo {
  name: string;
  mission: string;
  servicesFocus: string;
  services: Service[];
  location: string;
  contactInfo: ContactInfo;
  hours: BusinessHours;
  newsletter?: NewsletterInfo;
  employerBranding?: string;
  jobBoard?: string;
}

interface Service {
  name: string;
  description: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface NewsletterInfo {
  description: string;
  content: string[];
}

// Define company information
const COMPANY_INFO: CompanyInfo = {
  name: "Hirlytics",
  mission:
    "Hirlytics aims to connect businesses across the MENA region with exceptional tech talent that drives results.",
  servicesFocus:
    "The company specializes in tech recruitment, focusing on connecting businesses with top professionals in the tech industry.",
  services: [
    {
      name: "Tech Talent Solutions",
      description:
        "We learn about your business, goals, and team culture to ensure perfect matches. We source top talent using our extensive network and data-driven methods, conduct thorough screening, speed up the hiring process, and provide ongoing support even after placement.",
    },
    {
      name: "Recruitment Process Outsourcing (RPO)",
      description:
        "We handle all or part of a company's recruitment process, freeing up internal resources and improving efficiency.",
    },
    {
      name: "Talent Pipeline Development",
      description:
        "We help businesses develop a continuous pipeline of top talent, ensuring a steady supply of qualified candidates.",
    },
    {
      name: "Employer Branding",
      description:
        "We help businesses develop a strong employer brand, attracting top talent and improving employee engagement.",
    },
    {
      name: "Job Board",
      description:
        "We provide a job board for businesses to post their job openings, reaching a wider audience of potential candidates.",
    },
  ],
  location: "Beirut, BA 1881 LB",
  contactInfo: {
    phone: "+961 818 31733",
    email: "recruitment@hirlytics.co",
    address: "Beirut, BA 1881 LB",
  },
  hours: {
    monday: "9:00am - 7:00pm",
    tuesday: "9:00am - 7:00pm",
    wednesday: "9:00am - 7:00pm",
    thursday: "9:00am - 7:00pm",
    friday: "9:00am - 7:00pm",
    saturday: "9:00am - 2:00pm",
    sunday: "10:00am - 2:30pm",
  },
  newsletter: {
    description: "Stay updated with Hirlytics through our newsletter",
    content: [
      "News and updates about Hirlytics",
      "Industry insights and trends",
      "Tips and advice for businesses and job seekers",
      "Promotions and special offers",
    ],
  },
};

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  companyInfo,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hello! I'm the Hirlytics virtual assistant. How can I help you learn about our tech recruitment services?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Function to handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    // Remove duplicate comment
    if (inputValue.trim() === "") return;

    // Handle Enter key submission
  

  // Add user message
    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call to Gemini
    setTimeout(() => {
      const botResponse = generateResponse(userMessage.text, companyInfo);

      setMessages((prev) => [
        ...prev,
        {
          text: botResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  // Function to generate responses based on company info only
  // Enhanced response generator with better formatting
  const generateResponse = (query: string, info: CompanyInfo): string => {
    const queryLower = query.toLowerCase();

    // About the company / mission / who are you
    if (
      queryLower.includes("about") ||
      queryLower.includes("who") ||
      queryLower.includes("what company") ||
      queryLower.includes("mission") ||
      queryLower.includes("purpose") ||
      queryLower.includes("hirlytics")
    ) {
      return `📢 **About Hirlytics**\n\n${info.name} is a tech recruitment company focused on the MENA region.\n\n📋 **Our Mission**\n${info.mission}\n\n💼 **Our Focus**\n${info.servicesFocus}`;
    }

    // Services / what do you do
    else if (
      queryLower.includes("service") ||
      queryLower.includes("what do you") ||
      queryLower.includes("what does") ||
      queryLower.includes("offer") ||
      queryLower.includes("provide") ||
      queryLower.includes("specialize") ||
      queryLower.includes("recruitment")
    ) {
      const servicesText = info.services
        .map((s) => `• **${s.name}**\n  ${s.description}`)
        .join("\n\n");
      return `🌟 **Our Services at ${info.name}**\n\n${servicesText}`;
    }

    // Tech talent solutions specifically
    else if (
      queryLower.includes("tech talent") ||
      queryLower.includes("talent solution")
    ) {
      const techService = info.services.find(
        (s) => s.name === "Tech Talent Solutions"
      );
      return `💻 **Tech Talent Solutions**\n\n${techService?.description}\n\nFor more details or to discuss your specific needs, please contact us at ${info.contactInfo.email}.`;
    }

    // RPO specifically
    else if (
      queryLower.includes("rpo") ||
      queryLower.includes("recruitment process") ||
      queryLower.includes("outsourcing")
    ) {
      const rpoService = info.services.find(
        (s) => s.name === "Recruitment Process Outsourcing (RPO)"
      );
      return `🔄 **Recruitment Process Outsourcing (RPO)**\n\n${rpoService?.description}\n\nThis service allows your HR team to focus on strategic initiatives while we handle the recruitment process.`;
    }

    // Talent pipeline specifically
    else if (
      queryLower.includes("pipeline") ||
      queryLower.includes("talent pipeline")
    ) {
      const pipelineService = info.services.find(
        (s) => s.name === "Talent Pipeline Development"
      );
      return `🔍 **Talent Pipeline Development**\n\n${pipelineService?.description}\n\nA strong talent pipeline ensures you're never caught off-guard when new positions open up.`;
    }

    // Employer Branding specifically
    else if (
      queryLower.includes("employer brand") ||
      queryLower.includes("branding")
    ) {
      const brandingService = info.services.find(
        (s) => s.name === "Employer Branding"
      );
      return `🏆 **Employer Branding Service**\n\n${brandingService?.description}\n\nA strong employer brand can reduce hiring costs by up to 50% and attract higher quality candidates.`;
    }

    // Job Board specifically
    else if (
      queryLower.includes("job board") ||
      queryLower.includes("job posting") ||
      queryLower.includes("post job")
    ) {
      const jobBoardService = info.services.find((s) => s.name === "Job Board");
      return `📝 **Our Job Board Service**\n\n${jobBoardService?.description}\n\nReach tech talent across the MENA region with targeted job postings.`;
    }

    // Location / where
    else if (
      queryLower.includes("where") ||
      queryLower.includes("location") ||
      queryLower.includes("address") ||
      queryLower.includes("office")
    ) {
      return `📍 **Our Location**\n\n${info.name} is headquartered in ${info.contactInfo.address}.\n\nWe serve clients throughout the MENA region.`;
    }

    // Contact information
    else if (
      queryLower.includes("contact") ||
      queryLower.includes("email") ||
      queryLower.includes("phone") ||
      queryLower.includes("call") ||
      queryLower.includes("reach")
    ) {
      return `📱 **Contact Information**\n\n• **Phone**: ${info.contactInfo.phone}\n• **Email**: ${info.contactInfo.email}\n• **Address**: ${info.contactInfo.address}\n\nWe look forward to hearing from you!`;
    }

    // Social media
    else if (
      queryLower.includes("social") ||
      queryLower.includes("linkedin") ||
      queryLower.includes("twitter") ||
      queryLower.includes("facebook") ||
      queryLower.includes("instagram")
    ) {
      return `🔗 **Connect With Us**\n\nFor information about our social media presence and to stay updated with our latest news, please visit our website or contact us at ${info.contactInfo.email}.`;
    }

    // Newsletter
    else if (
      queryLower.includes("newsletter") ||
      queryLower.includes("subscribe") ||
      queryLower.includes("updates") ||
      queryLower.includes("news")
    ) {
      if (info.newsletter) {
        const contentList = info.newsletter.content
          .map((item) => `• ${item}`)
          .join("\n");
        return `📬 **Our Newsletter**\n\n${info.newsletter.description}.\n\n**What you'll receive:**\n${contentList}\n\nYou can subscribe on our website to stay informed about industry trends and our services.`;
      }
      return `📬 **Our Newsletter**\n\nYou can subscribe to our newsletter on our website to receive updates about our services and industry insights.`;
    }

    // Business hours
    else if (
      queryLower.includes("hour") ||
      queryLower.includes("open") ||
      queryLower.includes("time") ||
      queryLower.includes("available") ||
      queryLower.includes("operation")
    ) {
      return `⏰ **Business Hours**\n\n• **Monday**: ${info.hours.monday}\n• **Tuesday**: ${info.hours.tuesday}\n• **Wednesday**: ${info.hours.wednesday}\n• **Thursday**: ${info.hours.thursday}\n• **Friday**: ${info.hours.friday}\n• **Saturday**: ${info.hours.saturday}\n• **Sunday**: ${info.hours.sunday}`;
    }

    // Specific day's hours
    else if (queryLower.includes("monday")) {
      return `⏰ **Monday Hours**\n\nOn Mondays, ${info.name} is open from ${info.hours.monday}.`;
    } else if (queryLower.includes("tuesday")) {
      return `⏰ **Tuesday Hours**\n\nOn Tuesdays, ${info.name} is open from ${info.hours.tuesday}.`;
    } else if (queryLower.includes("wednesday")) {
      return `⏰ **Wednesday Hours**\n\nOn Wednesdays, ${info.name} is open from ${info.hours.wednesday}.`;
    } else if (queryLower.includes("thursday")) {
      return `⏰ **Thursday Hours**\n\nOn Thursdays, ${info.name} is open from ${info.hours.thursday}.`;
    } else if (queryLower.includes("friday")) {
      return `⏰ **Friday Hours**\n\nOn Fridays, ${info.name} is open from ${info.hours.friday}.`;
    } else if (queryLower.includes("saturday")) {
      return `⏰ **Saturday Hours**\n\nOn Saturdays, ${info.name} is open from ${info.hours.saturday}.`;
    } else if (queryLower.includes("sunday")) {
      return `⏰ **Sunday Hours**\n\nOn Sundays, ${info.name} is open from ${info.hours.sunday}.`;
    }

    // Meeting / Appointment
    else if (
      queryLower.includes("meeting") ||
      queryLower.includes("appointment") ||
      queryLower.includes("schedule") ||
      queryLower.includes("book")
    ) {
      return `📅 **Schedule a Meeting**\n\nTo arrange an appointment with our team, you can:\n\n• Email us: ${info.contactInfo.email}\n• Call us: ${info.contactInfo.phone}\n• Use the contact form on our website\n\nWe'll respond promptly to discuss your recruitment needs.`;
    }

    // Region / area covered
    else if (
      queryLower.includes("region") ||
      queryLower.includes("area") ||
      queryLower.includes("country") ||
      queryLower.includes("mena")
    ) {
      return `🌍 **Our Service Region**\n\n${info.name} connects businesses across the MENA (Middle East and North Africa) region with exceptional tech talent.\n\nWe understand the unique recruitment challenges in this region and provide specialized solutions.`;
    }

    // Team information
    else if (
      queryLower.includes("team") ||
      queryLower.includes("staff") ||
      queryLower.includes("employee") ||
      queryLower.includes("people")
    ) {
      return `👥 **Our Team**\n\nThe Hirlytics team consists of experienced recruitment professionals with deep knowledge of the tech industry in the MENA region.\n\nFor specific information about our team members and their expertise, please visit our website or contact us at ${info.contactInfo.email}.`;
    }

    // Events or webinars
    else if (
      queryLower.includes("event") ||
      queryLower.includes("webinar") ||
      queryLower.includes("conference") ||
      queryLower.includes("workshop")
    ) {
      return `🎯 **Events & Webinars**\n\nWe regularly host events and webinars on tech recruitment trends, talent acquisition strategies, and market insights.\n\nVisit our website or subscribe to our newsletter for updates on upcoming events.`;
    }

    // For any other query, provide a general response
    else {
      return `👋 **Welcome to Hirlytics!**\n\nWe're a specialized tech recruitment company connecting businesses across the MENA region with exceptional tech talent.\n\n**Our key services include:**\n• Tech Talent Solutions\n• Recruitment Process Outsourcing (RPO)\n• Talent Pipeline Development\n• Employer Branding\n• Job Board\n\nHow can I help you today? Feel free to ask about our services, location, business hours, or contact information.`;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="chat-modal">
      <div className="chat-header">
        <h3 className="chat-title">Hirlytics Assistant</h3>
        <button onClick={onClose} className="close-button">
          <X size={20} />
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.isUser ? "user-message" : "bot-message"}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: message.text
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br/>')
              }}
              className="message-content"
            />
          </div>
        ))}
        {isLoading && <div className="loading-indicator">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask about Hirlytics..."
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          />
          <button
            className="send-button"
            disabled={isLoading}
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Main component
const HirlyticsChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <ChatButton onToggleChat={toggleChat} />
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        companyInfo={COMPANY_INFO}
      />
    </>
  );
};

export default HirlyticsChatWidget;
