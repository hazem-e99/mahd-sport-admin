import React from 'react'
import SvgSearchicon from '@/components/icons/search-icon'
import "./search-box.component.scss"
import { useLanguage } from '@/context/languageContext'

const SearchBox: React.FC = () => {

    const { getValue } = useLanguage()

    return (

        <div className='search-box '>
            <div className="flex-grow-1 position-relative">
                <span className="search-box-icon">
                    <SvgSearchicon />
                </span>
                <input type="text" className="form-control search-box-input" placeholder={`${getValue("search")}...`} />
            </div>
        </div>


        /* 
                <div className="search-box">
                    <span className="search-box-icon">
                        <SvgSearchicon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search Here ..."
                        className="search-box-input"
                    />
                </div> */
    )
}

export default SearchBox