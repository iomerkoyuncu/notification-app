import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { columns } from '../constants/columns'
import service from '../service'
import { toast } from 'react-toastify'

function Home() {
    const [time, setTime] = React.useState('')
    const [notifications, setNotifications] = React.useState([])
    const [payload, setPayload] = React.useState({
        message: '',
        expiry_date: '',
    })

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs().format('DD/MM/YYYY hh:mm:ss'))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const getNotifications = async () => {
        const result = await service.getNotifications()
        setNotifications(result.data)
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

    React.useEffect(() => {
        getNotifications()
    }, [])

    return (
        <div className='p-10'>
            <div className=' '>
                <div className='flex justify-start items-center gap-3 p-3'>
                    <div className='flex flex-row justify-center items-center border-2 border-blue-400 rounded-lg p-2 gap-3'>
                        <Typography variant='h6' color='initial'>
                            Current Time
                        </Typography>
                        <Typography variant='p' color='initial'>
                            {time}
                        </Typography>
                    </div>
                    <TextField
                        id='outlined'
                        label='Enter Message'
                        onChange={(e) => {
                            setPayload({
                                ...payload,
                                message: e.target.value,
                            })
                        }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label='Select Expiry Date'
                            disablePast
                            ampm={false}
                            onChange={(e) => {
                                setPayload({
                                    ...payload,
                                    expiry_date: e,
                                })
                            }}
                        />
                    </LocalizationProvider>
                    <Button onClick={createNotification} variant='outlined'>
                        POST NOTIFICATION
                    </Button>

                </div>
            </div>
            <div className=' '>
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
        </div>
    )
}

export default Home
