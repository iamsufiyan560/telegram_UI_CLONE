import { useState } from "react";

const SwitchButton = () => {
  const [isCheked, setIsCheked] = useState(true);

  const handleCheked = () => {
    setIsCheked((prev) => !prev);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        onChange={handleCheked}
        checked={isCheked}
        type="checkbox"
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 dark:peer-focus:ring-purple-950 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-purple-950 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-purple-950 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-900"></div>
    </label>
  );
};

export default SwitchButton;
