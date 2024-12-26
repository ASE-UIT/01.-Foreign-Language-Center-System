import axios, { CreateAxiosDefaults } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.2.2:5000/api'

export const http = () => {
  const defaultOption: CreateAxiosDefaults = {
    baseURL,
    withCredentials: true
  }

  const instance = axios.create(defaultOption)

  //       instance.interceptors.request.use(async (request) => {
  //     const session = await getSession();
  //     if (session) {
  //       request.headers.Authorization = `Bearer ${session.jwt}`;
  //     }
  //     return request;
  //   });

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log(`error`, error)
    }
  )

  return instance
}
