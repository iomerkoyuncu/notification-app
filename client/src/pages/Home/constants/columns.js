import dayjs from "dayjs"
export const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90,
    },
    {
        field: 'message',
        headerName: 'Message',
        width: 150,
    },
    {
        field: 'expiryDate',
        headerName: 'Expiry Date',
        width: 200,
        renderCell: (params) => {
            return (
                <div>
                    {dayjs(params.value).format('DD/MM/YYYY HH:mm:ss')}
                </div>
            )
        }
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
        renderCell: (params) => {
            return (
                <div>
                    {dayjs(params.value).format('DD/MM/YYYY HH:mm:ss')}
                </div>
            )
        }
    },
]