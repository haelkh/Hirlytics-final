import { AppointmentData } from './application';

interface ConfirmationProps {
  appointmentData: AppointmentData;
  onReset: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ appointmentData, onReset }) => {
  return (
    <div className="confirmation-container">
      <div className="check-icon">
        <i className="fas fa-check"></i>
      </div>
      
      <div className="appointment-details">
        <div className="date-time">
          <i className="far fa-calendar"></i> {appointmentData.date}
          <i className="far fa-clock"></i> {appointmentData.time}
        </div>
      </div>
      
      <h2>Thank You!</h2>
      <p className="confirmation-text">
        Your appointment is confirmed. A confirmation email with the details of your appointment will been sent to you.
      </p>
      
      <button className="go-back-button" onClick={onReset}>
        Go Back to the Start
      </button>
    </div>
  );
};

export default Confirmation;