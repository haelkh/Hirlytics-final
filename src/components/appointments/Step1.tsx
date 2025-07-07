import { useState } from 'react';
import Calendar from './Calendar';
import HirlyticsLogo from './Hirlyticslogo';
import ProgressStepper from './ProgressStepper';

interface Step1Props {
  onNext: () => void;
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

const Step1: React.FC<Step1Props> = ({ onNext, onDateSelect, selectedDate }) => {
  const [date, setDate] = useState<string>(selectedDate || '18 Sep, 2023');

  const handleDateChange = (newDate: string): void => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <div className="appointment-container">
      <div className="sidebar">
        <HirlyticsLogo />
        <div className="step-info">
          <h3>Step 1</h3>
          <p>Just three simple steps to book your appointment!</p>
        </div>
        <ProgressStepper currentStep={1} />
      </div>
      <div className="main-content">
        <h2>Select Date & Time</h2>
        <Calendar 
          selectedDate={date} 
          onDateChange={handleDateChange} 
          onNext={onNext} 
        />
      </div>
    </div>
  );
};

export default Step1;