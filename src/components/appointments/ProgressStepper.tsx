interface ProgressStepperProps {
    currentStep: number;
  }
  
  const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
    return (
      <div className="progress-stepper">
        <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-icon">
            <i className="far fa-calendar"></i>
          </div>
          <div className="step-label">Tag</div>
          {currentStep > 1 && <div className="step-connector"></div>}
        </div>
        
        <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-icon">
            <i className="far fa-clock"></i>
          </div>
          <div className="step-label">Time</div>
          {currentStep > 2 && <div className="step-connector"></div>}
        </div>
        
        <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-icon">
            <i className="far fa-user"></i>
          </div>
          <div className="step-label">Enter information
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressStepper;
  