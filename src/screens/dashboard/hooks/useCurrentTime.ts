import { useEffect, useMemo, useState } from "react";

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [currentTime],
  );

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [currentTime],
  );

  const formattedSeconds = useMemo(
    () => currentTime.toLocaleTimeString("fr-FR", { second: "2-digit" }),
    [currentTime],
  );

  return {
    currentTime,
    formattedDate,
    formattedTime,
    formattedSeconds,
  };
};