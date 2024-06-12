
// Get an auth token
export const getAuthToken = async (email:string, password: string) => {
    const authResponse = await fetch("https://auth.prismic.io/login", {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "prismic-clone-script",
      },
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  
    const token = await authResponse.text();
    return token;
  };