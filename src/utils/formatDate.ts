export const formatDateTime = (dateString: string): string => {
  if (!dateString || dateString === 'Unknown') return 'Unknown';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return 'Invalid Date';
  }
};