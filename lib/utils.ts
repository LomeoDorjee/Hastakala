
export function formatDateString(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
  
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return `${time.toUpperCase()} - ${formattedDate}`;
}
  
  
export function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
  
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  
}
  
export function Convert24To12Hour(oldFormatTime: string) {
    
    const oldFormatTimeArray = oldFormatTime.split(":");
    const HH = parseInt(oldFormatTimeArray[0]);
    const min = oldFormatTimeArray[1];
    const AMPM = HH >= 12 ? "PM" : "AM";
  
    let hours;

    if(HH == 0){
        hours = HH + 12;
    } else if (HH > 12) {
        hours = HH - 12;
    } else {
        hours = HH;
    }
    return hours + ":" + min + " " + AMPM
}

export const catchErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message)
  } else {
    message = "Uncaught Error"
  }

  return message
}