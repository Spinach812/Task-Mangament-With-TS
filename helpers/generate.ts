export const generateRandomString = (length: number): string => {
  const characters: string =
    "ASDFGHJKLZXCVBNMQWERTYUIOPasdfghjklzxcvbnmqwertyuiop0987654321";

  let result: string = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const generateRandomNumber = (length: number): string => {
  const characters: string = "0987654321";

  let result: string = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
