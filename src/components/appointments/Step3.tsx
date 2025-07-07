import { AppointmentData } from '../App';
import HirlyticsLogo from './Hirlyticslogo';
import ProgressStepper from './ProgressStepper';

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
  appointmentData: AppointmentData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationSelect: (location: string) => void;
}

const Step3: React.FC<Step3Props> = ({ 
  onNext, 
  onPrev, 
  appointmentData, 
  onInputChange, 
  onLocationSelect 
}) => {
  return (
    <div className="appointment-container">
      <div className="sidebar">
        <HirlyticsLogo />
        <div className="step-info">
          <h3>Step 3</h3>
          <p>Enter your information correctly</p>
        </div>
        <ProgressStepper currentStep={3} />
      </div>
      <div className="main-content">
        <div className="back-header">
          <button className="back-link" onClick={onPrev}>
            <i className="fas fa-chevron-left"></i> Back
          </button>
        </div>
        <h2>Please provide details</h2>
        
        <div className="details-form">
          <div className="form-section">
            <label>Location</label>
            <div 
              className="location-option selected" 
              onClick={() => onLocationSelect('Zoom')}
            >
              <i className="fas fa-video"></i> Zoom
            </div>
          </div>
          
          <div className="form-section">
            <label>Company</label>
            <div className="input-container">
              <i className="fas fa-building"></i>
              <input
                type="text"
                name="company"
                placeholder="Enter Ihr Unternehmen...."
                value={appointmentData.company}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="form-section">
            <label>Mobile</label>
            <div className="input-container">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                name="mobile"
                placeholder="+43 865 8596"
                value={appointmentData.mobile}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="form-section">
            <label>Any Notes?</label>
            <p className="form-hint">Feel free to add any notes you have here!</p>
            <textarea
              name="notes"
              placeholder="Any notes? (e.g., thoughts, questions, observations...)"
              value={appointmentData.notes}
              onChange={onInputChange}
            ></textarea>
          </div>
          
          <button className="schedule-button" onClick={onNext}>
            schedule an appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;