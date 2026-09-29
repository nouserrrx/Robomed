import axios from 'axios'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('robomed_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

// Intercepteur réponse : nettoie le token si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('robomed_token')
      localStorage.removeItem('robomed_user')
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/accounts/login/', { email, password })
      if (response.data?.token) {
        localStorage.setItem('robomed_token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      console.warn('Backend login indisponible ou identifiants incorrects :', error)
      // Renvoie les données d'erreur pour que l'AuthContext puisse gérer pending_approval
      if (error.response?.data) return error.response.data
      return null
    }
  },
  me: async () => {
    try {
      const res = await api.get('/accounts/me/')
      return res.data
    } catch {
      return null
    }
  },
}

export const usersAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/accounts/users/')
      return res.data
    } catch (err) {
      console.warn('API users/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/accounts/users/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/accounts/users/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/accounts/users/${id}/`)
    return res.data
  },
}

export const contactsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/contacts/')
      return res.data
    } catch (err) {
      console.warn('API contacts/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/contacts/', data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/contacts/${id}/`)
    return res.data
  },
}

export const beneficiariesAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/beneficiaries/')
      return res.data
    } catch (err) {
      console.warn('API beneficiaries/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/beneficiaries/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/beneficiaries/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/beneficiaries/${id}/`)
    return res.data
  },
}

export const projectsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/projects/')
      return res.data
    } catch (err) {
      console.warn('API projects/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/projects/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/projects/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/projects/${id}/`)
    return res.data
  },
}

export const donationsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/donations/')
      return res.data
    } catch (err) {
      console.warn('API donations/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/donations/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/donations/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/donations/${id}/`)
    return res.data
  },
}

export const teamAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/accounts/team/')
      return res.data
    } catch (err) {
      console.warn('API accounts/team/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/accounts/team/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/accounts/team/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/accounts/team/${id}/`)
    return res.data
  },
}

export const stocksAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/stocks/')
      return res.data
    } catch (err) {
      console.warn('API stocks/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/stocks/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/stocks/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/stocks/${id}/`)
    return res.data
  },
}

export const distributionsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/distributions/')
      return res.data
    } catch (err) {
      console.warn('API distributions/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/distributions/', data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/distributions/${id}/`)
    return res.data
  },
}

export const logsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/accounts/logs/')
      return res.data
    } catch (err) {
      console.warn('API logs/ indisponible:', err)
      return null
    }
  },
  create: async (data: { level: string; message: string; source: string }) => {
    const res = await api.post('/accounts/logs/', data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/accounts/logs/${id}/`)
    return res.data
  },
}

export const galleryAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/gallery/medias/')
      return res.data
    } catch (err) {
      console.warn('API gallery/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/gallery/medias/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/gallery/medias/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/gallery/medias/${id}/`)
    return res.data
  },
}

export const newsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/news/actualites/')
      return res.data
    } catch (err) {
      console.warn('API news/actualites/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/news/actualites/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/news/actualites/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/news/actualites/${id}/`)
    return res.data
  },
}

export const statsAPI = {
  getImpact: async () => {
    try {
      const res = await api.get('/reports/stats/')
      return res.data
    } catch (err) {
      console.warn('API reports/stats/ indisponible:', err)
      return null
    }
  },
}

export const campaignsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/campaigns/')
      return res.data
    } catch (err) {
      console.warn('API campaigns/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/campaigns/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/campaigns/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/campaigns/${id}/`)
    return res.data
  },
}

export const volunteersAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/volunteers/')
      return res.data
    } catch (err) {
      console.warn('API volunteers/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/volunteers/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/volunteers/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/volunteers/${id}/`)
    return res.data
  },
  approve: async (id: number) => {
    const res = await api.post(`/volunteers/${id}/approve/`)
    return res.data
  },
  reject: async (id: number) => {
    const res = await api.post(`/volunteers/${id}/reject/`)
    return res.data
  },
}

export const missionsAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/projects/missions/')
      return res.data
    } catch (err) {
      console.warn('API projects/missions/ indisponible:', err)
      return null
    }
  },
  create: async (data: any) => {
    const res = await api.post('/projects/missions/', data)
    return res.data
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/projects/missions/${id}/`, data)
    return res.data
  },
  delete: async (id: number) => {
    const res = await api.delete(`/projects/missions/${id}/`)
    return res.data
  },
  apply: async (id: number) => {
    const res = await api.post(`/projects/missions/${id}/apply/`)
    return res.data
  },
}

export const reportsAPI = {
  downloadPdf: async () => {
    const res = await api.get('/reports/export/pdf/', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Rapport_Activite_RoBomed_${new Date().toISOString().split('T')[0]}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
  downloadExcel: async () => {
    const res = await api.get('/reports/export/excel/', { responseType: 'blob' })
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    )
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Donnees_Consolidees_RoBomed_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}


