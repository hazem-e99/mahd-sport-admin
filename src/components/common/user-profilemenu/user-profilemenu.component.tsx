import SvgArrowdownicon from '@/components/icons/arrowdown-icon';
// import { handleLogout } from '@/msalConfig';
// import { useMsal } from '@azure/msal-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useLanguage } from '@/context/languageContext';
import MadietConfirmModal from '@/components/common/MadietConfirmModal/MadietConfirmModal';
import { updateEmployeesFromAzureAD } from '@/api/endpoints/EmployeesApi';
import './user-profilemenu.component.scss';

interface UserData {
    jobTitle: string;
}

interface UserProfileMenuProps {
    userData: UserData | null;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userData }) => {
    // const { accounts } = useMsal();
    const accounts: any[] = [{ name: 'Admin User' }];
    const { getValue } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleLogoutClick = async () => {
        alert('Logout clicked (Authentication is disabled)');
    };

    const handleSyncUsersClick = () => {
        setShowSyncModal(true);
        setShowMenu(false);
    };

    const handleSyncConfirm = async () => {
        try {
            setIsSyncing(true);
            await updateEmployeesFromAzureAD();
            toast.success(getValue('sync_success'));
            setShowSyncModal(false);
        } catch (error) {
            console.log(error)
            toast.error(getValue('sync_error'));
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSyncCancel = () => {
        setShowSyncModal(false);
    };
    return (
        <div className='user-profile-menu' ref={menuRef}>
            <div className="user-profile-menu-container" onClick={toggleMenu}>
                <div className="user-profile-menu-avatar">
                    {accounts[0]?.name?.charAt(0)}
                </div>
                <div className="user-profile-menu-info">
                    <h6>{accounts[0]?.name}</h6>
                    <span>{userData?.jobTitle || 'Admin'}</span>
                </div>
            </div>

            <div className="user-arow-icon" onClick={toggleMenu}>
                <SvgArrowdownicon />
            </div>

            {showMenu && (
                <div className="user-profile-dropdown">
                    <button
                        className="sync-users-button"
                        onClick={handleSyncUsersClick}
                    >
                        {getValue('sync_users')}
                    </button>
                    <button
                        className="logout-button"
                        onClick={handleLogoutClick}
                    >

                        {getValue('Logout')}
                    </button>
                </div>
            )}

            <MadietConfirmModal
                show={showSyncModal}
                onHide={handleSyncCancel}
                onConfirm={handleSyncConfirm}
                isLoading={isSyncing}
            />
        </div>
    );
};

export default UserProfileMenu;
