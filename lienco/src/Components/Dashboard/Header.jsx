import React from 'react'
import './Header.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const Header = () => {
  return (
    <div className='header'>
    <input type="text" name="search" id="search" placeholder='search' />
    <div className='profile'>
    <Menu>
        <div>
            <MenuButton >
        
          <div className='user'>
           {/* <span className="sr-only">Name</span> */}

            </div>
            
            </MenuButton>
        </div>
      
    
    </Menu>
    </div>
    </div>
  )
}

export default Header
