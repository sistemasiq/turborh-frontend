//Get the date of birth of the user, and return the age of the user
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

//Made to build the object that will be sended to change the password
export const userCredentials = (id, password) => {
  return {
    id: id,
    password: password
  }
}

export const requestSuccessfull = (status) => {
  return status === 200 || status === 201 || status === 202;
}


export const gendersObject = {
  M:"Masculino",
  F:"Femenino",
  O:"Otro"
}
