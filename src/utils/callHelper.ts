export const handleCallClick = (e: React.MouseEvent | Event, phoneNumber: string, toastError?: any) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }

  const today = new Date().toISOString().split('T')[0];
  const callDataStr = localStorage.getItem('callData');
  let callData = callDataStr ? JSON.parse(callDataStr) : { date: today, count: 0 };

  if (callData.date !== today) {
    callData = { date: today, count: 0 };
  }

  if (callData.count >= 50) {
    const errorMsg = "You have reached your daily limit of 50 calls. Please try again tomorrow.";
    if (toastError) {
      toastError(errorMsg);
    } else {
      alert(errorMsg);
    }
    return;
  }

  callData.count += 1;
  localStorage.setItem('callData', JSON.stringify(callData));

  // Remove any non-digit characters for the actual call link, but keep '+' if it's the first character
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  window.location.href = `tel:${cleanPhone}`;
};
