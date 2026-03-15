import { format, parseISO } from 'date-fns';

export const formatDateForView = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch (e) {
    return dateString;
  }
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm");
  } catch (e) {
    return '';
  }
};
