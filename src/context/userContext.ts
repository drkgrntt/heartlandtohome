import { User } from '@/types'
import { createContext, useContext } from 'react'

type UserContext = {
  currentUser: User | null
  setCurrentUser: Function
}

export const userContext = createContext<UserContext>({
  currentUser: {
    id: '',
    password: '',

    // Personal Info
    email: '',
    firstName: '',
    lastName: '',

    // Billing info
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',

    // Shipping info
    shippingFirstName: '',
    shippingLastName: '',
    shippingEmail: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: '',

    // Shop info
    cart: [],

    // Account creation date
    updatedAt: new Date(),
    createdAt: new Date(),

    // Etc
    isAdmin: false,
    isSubscribed: false,
    isBanned: false,
  },
  setCurrentUser: (user: User) => {},
})

const useUser = () => useContext(userContext)
export default useUser
