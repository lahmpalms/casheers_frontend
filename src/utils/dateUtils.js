// Utility functions for date formatting with Thailand timezone (UTC+7)

// Helper function to convert any date to Thailand time (UTC+7)
const convertToThailandTime = (date) => {
  if (!date) return null;
  
  try {
    // Create a new date with 7 hours added (UTC+7)
    return new Date(date.getTime() + (7 * 60 * 60 * 1000));
  } catch (error) {
    console.error('Error converting to Thailand time:', error);
    return null;
  }
};

// Format date to display in Thailand time (UTC+7)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Create a date object from the input string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Convert to Thailand time
    const thailandTime = convertToThailandTime(date);
    
    // Format the date
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return thailandTime.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format date and time to display in Thailand time (UTC+7)
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Create a date object from the input string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Convert to Thailand time
    const thailandTime = convertToThailandTime(date);
    
    // Format the date
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    return thailandTime.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

// Format short date to display in Thailand time (UTC+7)
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Create a date object from the input string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Convert to Thailand time
    const thailandTime = convertToThailandTime(date);
    
    // Format the date
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return thailandTime.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting short date:', error);
    return '';
  }
};

// Convert a date to Thailand time (UTC+7) and return the Date object
export const toThailandTime = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Create a date object from the input string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Convert to Thailand time
    return convertToThailandTime(date);
  } catch (error) {
    console.error('Error converting to Thailand time:', error);
    return null;
  }
};

// Format ISO date string to Thailand time (UTC+7)
export const formatISOToThailandTime = (isoString) => {
  if (!isoString) return '';
  
  try {
    // Create a date object from the input string
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Convert to Thailand time
    const thailandTime = convertToThailandTime(date);
    
    // Format as ISO string and replace Z with +07:00
    return thailandTime.toISOString().replace('Z', '+07:00');
  } catch (error) {
    console.error('Error formatting ISO to Thailand time:', error);
    return '';
  }
}; 