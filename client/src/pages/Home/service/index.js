import axios from 'axios'
import { appConfig } from '../../../constants/appConfig'

const service = {
    async getNotifications() {
        const endPoint = `/notifications`
        const result = await axios.get(appConfig.baseUrl + endPoint, {
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        return result
    },
    async getNotification(id) {
        const endPoint = `/notifications/${id}`
        const result = await axios.get(appConfig.baseUrl + endPoint, {
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        return result
    },

    async createNotification(payload) {
        const endPoint = `/notifications`
        const result = await axios.post(appConfig.baseUrl + endPoint, payload, {
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        return result
    },

    async updateNotification(id, payload) {
        const endPoint = `/notifications/${id}`
        const result = await axios.put(appConfig.baseUrl + endPoint, payload, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        })
        return result
    },

    async deleteNotification(id) {
        const endPoint = `/notifications/${id}`
        const result = await axios.delete(appConfig.baseUrl + endPoint, {
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        return result
    }
}

export default service
