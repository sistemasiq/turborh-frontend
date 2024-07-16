export const formatDate = (datetimeString) => {
    // Split the datetime string to get the date part
    const [datePart] = datetimeString.split(' ');
  
    // Create a new Date object from the date part
    const date = new Date(datePart);
  
    // Define options for formatting the date
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
  
    // Format the date using toLocaleDateString
    return date.toLocaleDateString('es-ES', options);
  }