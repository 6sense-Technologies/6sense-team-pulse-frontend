import React from 'react'
import { DashDatePicker } from './DashDatepicker'
import DashMemberTable from './DashMemberTable'

const DashMemberArea = () => {

    const DashMemberTempData = [
        {
            avatar: "https://randomuser.me/api/portraits/men/1.jpg", 
            name: "Talha Jubaer",
            responsibility: "Frontend",
            performance: "92.67%",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/2.jpg", 
            name: "Ikbal Mahmud",
            responsibility: "UI/UX",
            performance: "91.55%",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/3.jpg", 
            name: "Dabasish Das Joy",
            responsibility: "Backend",
            performance: "90.88%",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/4.jpg",
            name: "Fahad Hossain",
            responsibility: "Backend",
            performance: "90.67%",
        },
        {
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            name: "Iftekhar Uddin Mullick",
            responsibility: "Coordinator",
            performance: "88.01%",
        },
    ];

    return (
        <div className='py-4'>
            <div className='bg-white border stroke-none border-[#E2E8F0] shadow-sm rounded-lg p-4 w-full px-4 py-2'>
                <div className='flex justify-between items-center pt-4'>
                    <p className='text-xl font-semibold text-[#1C2024] pl-1'>Top Members</p>
                    <DashDatePicker />
                </div>
                <div className='py-3 w-full'>
                    <DashMemberTable data={DashMemberTempData} />
                </div>
            </div>
        </div>
    )
}

export default DashMemberArea
