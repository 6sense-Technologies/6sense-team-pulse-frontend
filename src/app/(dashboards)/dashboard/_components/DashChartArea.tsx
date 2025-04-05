import React from 'react'
import { DashDatePicker } from './DashDatepicker'
import { DashBarChart } from './DashBarchart'

const DashChartArea = () => {
    return (
        <div className='py-4'>
            <div className='bg-white border stroke-none border-[#E2E8F0] shadow-sm rounded-lg p-4 w-full px-4 py-2'>
                <div className='flex justify-between items-center pt-4'>
                    <p className='text-xl font-semibold text-[#1C2024] pl-1'>Daily Tasks</p>
                    <DashDatePicker />
                </div>
                <div className='py-4 w-full'>
                    <DashBarChart />
                </div>
            </div>
        </div>
    )
}

export default DashChartArea
