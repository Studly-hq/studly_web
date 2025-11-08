export const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sparkle icon */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none"
        className="text-primary"
      >
        <path 
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
          fill="currentColor"
        />
      </svg>
      
      {/* Text */}
      <span className="text-xl font-bold text-white">
        Studly
      </span>
    </div>
  );
};