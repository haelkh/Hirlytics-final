import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import ContactUs from "./components/ContactUs/ContactUs";
import ServicesPage from "./components/Services/Services";
import HistorySection from "./components/about-us/About_US";
import PostJobSteps from "./components/PostJob/PostJobSteps/PostJobSteps";

import BlogPage from "./components/BlogPage/blogPage";
import BlogDetail from "./components/BlogDetail/BlogDetail";
import JobApplicationForm from "./components/ApplyToAJob/applyToAJob";
import EventWorkshopDetails from "./components/events/EventWorkshopDetails";
import Appointments from "./components/appointments/application";
import Dashboard from "./components/admin-page/Dashboard";
import AdminDashboard from "./components/AdminUserManager/dashboard";
import TeamDashboard from "./components/team/teamDash";
import DashboardCalendar from "./components/adminCalendar/adminCalendar";
import EventsWorkshops from "./components/events&workshops/events_workshops";
import JobDetails from "./components/jobDetails/jobDetails";
import JobsPage from "./components/Jobs/jobs";
import AdminAddBlog from "./components/adminBlog/AdminAddBlog";
import ManageJobs from "./components/admin-page/ManageJobs";

function App() {
  console.log("App component rendered");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<HistorySection />} />
        <Route path="/Services" element={<ServicesPage />} />
        <Route path="/post-a-job" element={<PostJobSteps />} />
        <Route path="/blog-page" element={<BlogPage />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
        <Route path="/apply-to-a-job" element={<JobApplicationForm />} />
        <Route path="/events" element={<EventWorkshopDetails />} />
        <Route path="/event-details/:id" element={<EventWorkshopDetails />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/AdminPage" element={<Dashboard />} />
        <Route path="/AdminPage/Manage/users" element={<AdminDashboard />} />
        <Route path="/AdminPage/Manage/team" element={<TeamDashboard />} />
        <Route
          path="/AdminPage/Manage/calendar"
          element={<DashboardCalendar />}
        />
        <Route path="/AdminPage/Manage/jobs" element={<ManageJobs />} />
        <Route path="/Jobs" element={<JobsPage />} />
        <Route path="/Team" element={<TeamDashboard />} />
        <Route path="/JobDetails" element={<JobDetails />} />
        <Route path="/events&workshops" element={<EventsWorkshops />} />
        <Route path="/adminBlog" element={<AdminAddBlog />} />
      </Routes>
    </Router>
  );
}

export default App;
