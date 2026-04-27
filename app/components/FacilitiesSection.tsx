import React from 'react'
import CourtsCarousel from './CourtsCarousel'

const FacilitiesSection = () => {
    return (
        <div className="flex flex-col px-16 pt-16" id='facilities'>
            <div className='flex flex-row gap-4 items-center'>
                <p className='border border-gray-500 rounded-4xl px-4 py-1.5 text-md text-black font-nav font-light'>Facilities</p>
                <h1 className='text-black text-2xl text-nav'>Explore Our Available Courts</h1>
            </div>
                <CourtsCarousel />
        </div>
    )
}

export default FacilitiesSection
