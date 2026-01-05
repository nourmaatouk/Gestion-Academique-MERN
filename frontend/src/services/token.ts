const KEY = "ga_token"

interface DecodedToken {
  userId: string
  role: string
  email: string
  exp: number
  iat: number
}

export const token = {
  get: () => localStorage.getItem(KEY),
  set: (t: string) => localStorage.setItem(KEY, t),
  clear: () => localStorage.removeItem(KEY),
  decode: (): DecodedToken | null => {
    const t = localStorage.getItem(KEY)
    if (!t) return null
    try {
      const payload = t.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch {
      return null
    }
  },
  isValid: (): boolean => {
    const decoded = token.decode()
    if (!decoded) return false
    return decoded.exp * 1000 > Date.now()
  }
}
