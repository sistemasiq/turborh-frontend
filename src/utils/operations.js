export const getAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
  
    let years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();
  

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
    }
  
    return isNaN(years) ? " " : years;
}