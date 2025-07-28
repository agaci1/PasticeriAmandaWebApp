// Form data persistence utility
export interface FormData {
  [key: string]: any
}

const FORM_DATA_KEY = 'pending_form_data'

export const saveFormData = (formData: FormData) => {
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData))
}

export const getFormData = (): FormData | null => {
  const data = localStorage.getItem(FORM_DATA_KEY)
  return data ? JSON.parse(data) : null
}

export const clearFormData = () => {
  localStorage.removeItem(FORM_DATA_KEY)
}

export const saveCustomOrderData = (data: {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customNote?: string
  flavour?: string
  customFlavour?: string
  customOrderDate?: string
  uploadedImages?: File[]
  previewUrls?: string[]
}) => {
  saveFormData({
    type: 'custom_order',
    ...data
  })
}

export const saveCartData = (data: {
  name?: string
  surname?: string
  phone?: string
  email?: string
}) => {
  saveFormData({
    type: 'cart',
    ...data
  })
} 