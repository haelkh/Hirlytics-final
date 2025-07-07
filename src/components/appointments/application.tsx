// App.tsx
import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Confirmation from "./Confirmation";
import "./appointments.css";

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

  const handleSubmit = (): void => {
    // Here you would typically send the data to a server
    handleNextStep();
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
  );
}

export default Appointments;
