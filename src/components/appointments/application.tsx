// App.tsx
import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Confirmation from "./Confirmation";
import "./appointments.css";
import Header from "../Header/header";
import Footer from "../Footer/Footer";

export interface AppointmentData {
  date: string;
  time: string;
  location: string;
  company: string;
  mobile: string;
  notes: string;
}

function Appointments() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: "18 Sep, 2023",
    time: "5:30 PM- 5:55 PM",
    location: "Zoom",
    company: "",
    mobile: "",
    notes: "",
  });

  const handleNextStep = (): void => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = (): void => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleDateSelect = (date: string): void => {
    setAppointmentData((prev) => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string): void => {
    setAppointmentData((prev) => ({ ...prev, time }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location: string): void => {
    setAppointmentData((prev) => ({ ...prev, location }));
  };

  const handleSubmit = async (): Promise<void> => {
    // Here you would typically send the data to a server
    // handleNextStep(); // This will be called after successful API call

    // Combine date and time into a single datetime string
    const [day, monthStr, year] = appointmentData.date.split(" ");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = (monthNames.indexOf(monthStr) + 1)
      .toString()
      .padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Assuming time is in HH:MM AM/PM format, convert to HH:MM:SS
    let [time, meridiem] = appointmentData.time.split(" ");
    let [hours, minutes] = time.split(":");
    if (meridiem === "PM" && hours !== "12") {
      hours = (parseInt(hours, 10) + 12).toString();
    } else if (meridiem === "AM" && hours === "12") {
      hours = "00";
    }
    const formattedTime = `${hours}:${minutes}:00`;

    const appointmentDateTime = `${formattedDate} ${formattedTime}`;

    // Placeholder for user ID (replace with actual user ID from session/auth)
    const userId = 1;
    const appointmentType = "Meeting"; // Can be dynamic based on user input
    const appointmentStatus = "pending"; // Initial status

    try {
      const response = await fetch(
        "http://localhost/Hirlytics-final/src/api/createAppointment.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            User_ID: userId,
            Appointment_DateTime: appointmentDateTime,
            Appointment_Type: appointmentType,
            Appointment_Status: appointmentStatus,
            Notes: appointmentData.notes,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Appointment scheduled successfully!");
        handleNextStep(); // Move to confirmation step
      } else {
        alert(`Failed to schedule appointment: ${result.message}`);
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("An error occurred while scheduling the appointment.");
    }
  };

  const resetForm = (): void => {
    setCurrentStep(1);
    setAppointmentData({
      date: "18 Sep, 2023",
      time: "5:30 PM- 5:55 PM",
      location: "Zoom",
      company: "",
      mobile: "",
      notes: "",
    });
  };

  return (
    <div className="App">
      <Header />
      <div className="app-container2">
        {currentStep === 1 && (
          <Step1
            onNext={handleNextStep}
            onDateSelect={handleDateSelect}
            selectedDate={appointmentData.date}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            selectedDate={appointmentData.date}
            selectedTime={appointmentData.time}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onNext={handleSubmit}
            onPrev={handlePrevStep}
            appointmentData={appointmentData}
            onInputChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
          />
        )}
        {currentStep === 4 && (
          <Confirmation appointmentData={appointmentData} onReset={resetForm} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Appointments;
