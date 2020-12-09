import {createAppContainer, createSwitchNavigation} from 'react-native'

import Login from './pages/Login'
import Main from './pages/Main'
export default createAppContainer (
    createSwitchNavigation({
        Login,
        Main
    })
)