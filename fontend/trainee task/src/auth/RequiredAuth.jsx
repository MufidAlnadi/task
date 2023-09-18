import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthContext'

export default function RequiredAuth({allowed}) {
    const {authenticated} = useAuth()
    const location = useLocation()
  return (
    authenticated?<Outlet/> : <Navigate to='/' state={{from: location}} replace/>
  )
}
