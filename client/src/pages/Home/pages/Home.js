import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { columns } from '../constants/columns'
import service from '../service'
import { toast } from 'react-toastify'
import io from 'socket.io-client'
import { appConfig } from '../../../constants/appConfig'

const socket = io.connect(appConfig.socketUrl)

function Home() {
    const [time, setTime] = useState()
    const [notifications, setNotifications] = useState([])
    const [expiredNotifications, setExpiredNotifications] = useState([])
    const [payload, setPayload] = useState({
        message: '',
        expiry_date: '',
    })

    const getNotifications = async () => {
        const result = await service.getNotifications()
        setNotifications(result.data)
    }

    const getExpireds = async () => {
        const result = await service.getExpiredNotifications()
        setExpiredNotifications(result.data)
    }

    const createNotification = async () => {
        const result = await service.createNotification(payload)
        if (result.status === 200) {
            toast.success('Notification Created Successfully')
            getNotifications()
        } else {
            toast.error('Something went wrong')
        }
    }

    setInterval(() => {
        setTime(dayjs().format('DD/MM/YYYY HH:mm:ss'))
    }, 1000)

    useEffect(() => {
        // Set up the Socket.IO event listener when the component mounts
        socket.on('notification', (data) => {
            toast.error(
                `Notification with id ${data.notification_id
                } has been expired at ${dayjs(data.expiry_date).format(
                    'DD/MM/YYYY HH:mm:ss'
                )}`
            )
            setExpiredNotifications((prevExpiredNotifications) => [
                ...prevExpiredNotifications,
                data,
            ])

            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) =>
                        notification.notification_id !== data.notification_id
                )
            )
        })

        // Fetch initial notifications and expired notifications
        getNotifications()
        getExpireds()

        // Clean up the Socket.IO event listener when the component unmounts
        return () => {
            socket.off('notification')
        }
    }, [])

    return (
        <div className='p-10  '>
            <div className='flex flex-col justify-between items-center gap-5 p-3'>
                <div className='w-full flex justify-start items-center flex-row gap-5 h-24'>
                    <div className='w-full flex flex-row justify-center items-center border-2 border-[#b3b3b3] rounded-lg p-2 gap-3'>
                        <Typography variant='h6' color='initial'>
                            Current Time
                        </Typography>
                        <Typography variant='p' color='initial'>
                            {time}
                        </Typography>
                    </div>
                    <TextField
                        fullWidth
                        id='outlined'
                        label='Enter Message'
                        onChange={(e) => {
                            setPayload({
                                ...payload,
                                message: e.target.value,
                            })
                        }}
                    />

                    <TextField
                        fullWidth
                        label='Enter Expiry Date'
                        onChange={(e) => {
                            setPayload({
                                ...payload,
                                expiry_date: e.target.value,
                            })
                        }}
                    />

                    <Button fullWidth onClick={createNotification} variant='outlined'>
                        SAVE NOTIFICATION
                    </Button>
                </div>
                <div className='flex flex-row w-full gap-5 '>
                    <div className='w-1/2'>
                        <Typography variant='h6' gutterBottom>
                            Saved Notifications
                        </Typography>
                        <DataGrid
                            rows={notifications.map((notification) => ({
                                id: notification.notification_id,
                                message: notification.message,
                                expiryDate: notification.expiry_date,
                                createdAt: notification.created_at,
                            }))}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            disableRowSelectionOnClick
                        />
                    </div>
                    <div className='w-1/2'>
                        <Typography variant='h6' gutterBottom>
                            Expired Notifications
                        </Typography>
                        <DataGrid
                            rows={
                                expiredNotifications &&
                                expiredNotifications.map((notification) => ({
                                    id: notification.notification_id,
                                    message: notification.message,
                                    expiryDate: notification.expiry_date,
                                    createdAt: notification.created_at,
                                }))
                            }
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            disableRowSelectionOnClick
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
