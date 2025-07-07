import { useState } from 'react';
import Calendar from './Calendar';
import HirlyticsLogo from './Hirlyticslogo';
import ProgressStepper from './ProgressStepper';
import TimeSelector from './TimeSelector';

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  selectedDate: string;
  selectedTime: string;
}

const Step2: React.FC<Step2Props> = ({ 
  onNext, 
  onPrev, 
  onDateSelect, 
  onTimeSelect, 
  selectedDate, 
  selectedTime 
}) => {
  const [date, setDate] = useState<string>(selectedDate || '18 Sep, 2023');
  const [time, setTime] = useState<string>(selectedTime || '5:30 PM- 5:55 PM');

  const handleDateChange = (newDate: string): void => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  const handleTimeSelect = (newTime: string): void => {
    setTime(newTime);
    onTimeSelect(newTime);
  };

  return (
    <div className="appointment-container">
      <div className="sidebar">
        <HirlyticsLogo />
        <div className="step-info">
          <h3>Step 2</h3>
          <p>Please select your desired appointment date.</p>
        </div>
        <ProgressStepper currentStep={2} />
      </div>
      <div className="main-content">
        <h2>Select Date & Time</h2>
        <div className="date-time-selection">
          <Calendar 
            selectedDate={date} 
            onDateChange={handleDateChange} 
          />
          <TimeSelector 
            selectedTime={time}
            onTimeSelect={handleTimeSelect}
            onNext={onNext}
          />
        </div>
        <div className="navigation-buttons">
          <button className="back-link" onClick={onPrev}>
            <i className="fas fa-chevron-left"></i> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
