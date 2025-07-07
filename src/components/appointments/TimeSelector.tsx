interface TimeSelectorProps {
    selectedTime: string;
    onTimeSelect: (time: string) => void;
    onNext: () => void;
  }
  
  const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, onTimeSelect, onNext }) => {
    const timeSlots = ['5:30 PM', '6:30 PM', '7:30 PM', '8:30 PM', '9:30 PM'];
    
    const handleTimeSelect = (time: string): void => {
      onTimeSelect(`${time}- ${parseInt(time) + 0.5}:55 PM`);
    };
  
    return (
      <div className="time-selector">
        <h3>Monday, 18. September</h3>
        
        <div className="time-slots">
          {timeSlots.map(time => (
            <button
              key={time}
              className={`time-slot ${selectedTime.startsWith(time) ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
        
        <button className="next-button" onClick={onNext}>
          Next
        </button>
      </div>
    );
  };
  
  export default TimeSelector;
  